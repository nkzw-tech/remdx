import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { compile, CompileOptions, createProcessor, nodeTypes } from '@mdx-js/mdx';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { transformerMetaHighlight } from '@shikijs/transformers';
import { toJs } from 'estree-util-to-js';
import matter from 'gray-matter';
import normalizeNewline from 'normalize-newline';
import rehypeRaw from 'rehype-raw';
import { createHighlighter, type ShikiTransformer, type ThemeRegistrationResolved } from 'shiki';
import type { Plugin } from 'vite';

type Slide = [string, Record<string, unknown>];

const EXPORT_DEFAULT_REGEXP = /export\sdefault\s/g;
const MODULE_HEADER_REGEXP = /^(?:import|export)\s/;
const CODE_FENCE_HEADER_REGEXP = /^```([^\s`{]+)([^\n]*)$/gm;

const Licht = JSON.parse(
  readFileSync(join(import.meta.dirname, './lib/licht.json'), 'utf8'),
) as ThemeRegistrationResolved;
const Dunkel = JSON.parse(
  readFileSync(join(import.meta.dirname, './lib/dunkel.json'), 'utf8'),
) as ThemeRegistrationResolved;

const parseTitle = (raw: string | undefined) => {
  if (!raw) {
    return null;
  }

  const match = raw.match(/(?:^|\s)title=(?:"([^"]+)"|'([^']+)'|(\S+))(?:\s|$)/);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
};

const shikiTransformerCodeTitle = (): ShikiTransformer => ({
  name: 'code-title',
  pre(node) {
    const raw = this.options.meta?.__raw;
    const title = parseTitle(raw);
    if (!title) {
      return;
    }

    node.properties ??= {};
    node.properties['data-title'] = title;
  },
});

const extractFenceLanguages = (source: string) => {
  const languages = new Set<string>();
  for (const match of source.matchAll(CODE_FENCE_HEADER_REGEXP)) {
    const language = match[1]?.trim().toLowerCase();
    if (language) {
      languages.add(language);
    }
  }
  return languages;
};

const addTagsToTypescript = (language: string) =>
  language === 'ts' || language === 'typescript' ? 'ts-tags' : language;

type MarkdownTreeNode = {
  children?: Array<unknown>;
  data?: Record<string, unknown>;
  meta?: string;
  type: string;
};

const visitCodeNodes = (node: MarkdownTreeNode) => {
  if (node.type === 'code' && node.meta) {
    node.data ??= {};
    node.data.meta = node.meta;
    const hProperties = (node.data.hProperties as Record<string, unknown> | undefined) ?? {};
    hProperties['metastring'] = node.meta;
    node.data.hProperties = hProperties;
  }

  for (const child of node.children || []) {
    if (typeof child === 'object' && child !== null && 'type' in child) {
      visitCodeNodes(child as MarkdownTreeNode);
    }
  }
};

const preserveCodeBlockMetaTransformer = (tree: MarkdownTreeNode) => {
  visitCodeNodes(tree);
};

const preserveCodeBlockMeta = () => preserveCodeBlockMetaTransformer;

type JavaScriptProgram = Parameters<typeof toJs>[0];

const isSourceDeclaration = (node: JavaScriptProgram['body'][number]) =>
  'start' in node && typeof node.start === 'number';

const removeModuleDeclarations = () => (tree: JavaScriptProgram) => {
  tree.body = tree.body.filter(
    (node) =>
      !isSourceDeclaration(node) &&
      node.type !== 'ImportDeclaration' &&
      node.type !== 'ExportNamedDeclaration' &&
      node.type !== 'ExportAllDeclaration',
  );
};

const compileMDX = async (content: string, options: CompileOptions, development = true) =>
  String(
    (
      await compile(content, {
        ...options,
        development,
        providerImportSource: '@mdx-js/react',
      })
    ).value,
  );

const parseSlide = (text: string): Slide => {
  text = text.trim();
  if (text.match(/^--$/gm)?.length === 1) {
    text = `---\n${text}`;
  }

  const { content, data } = matter(text.replaceAll(/^--$/gm, '---'));
  return [content, data];
};

export default function remdx(): Plugin {
  let highlighterPromise: Promise<Awaited<ReturnType<typeof createHighlighter>>>;
  const loadedLanguages = new Set<string>();
  const isProduction = process.env.NODE_ENV === 'production';

  const wrapComponent = (content: string, data: Record<string, unknown>) => `(() => {
    function MDXContentWrapper(props) {
      ${content.replaceAll(EXPORT_DEFAULT_REGEXP, '').trim()}
      return ${isProduction ? '_jsx' : '_jsxDEV'}(MDXContent, props);
    };
    MDXContentWrapper.isMDXComponent = true;
    return {Component: MDXContentWrapper, data: ${JSON.stringify(data)}};
    })()`;

  const transform = async (source: string, options: CompileOptions = {}) => {
    let inlineModules: Array<string> = [];
    const slides: Array<Slide> = [];
    let start = 0;

    const compileSlides = async (content: ReadonlyArray<Slide>) =>
      (
        await Promise.all(
          content.map(
            ([content, data]) =>
              compileMDX(`${inlineModules.join('\n')}\n\n${content}`, options, !isProduction).then(
                (content) => [content, data],
              ) as Promise<Slide>,
          ),
        )
      ).map(([content, data]) => wrapComponent(content, data));

    const slice = (end: number) => {
      if (start !== end) {
        const line = lines.slice(start, end).join('\n');
        slides.push(parseSlide(line));
        start = end + 1;
      }
    };

    const lines = normalizeNewline(source).split(/\n/g);
    const parser = createProcessor();

    const extractModule = (start: number) => {
      for (let end = start; end < lines.length; end++) {
        if (end + 1 < lines.length && lines[end + 1].trim() !== '') {
          continue;
        }
        let tree;
        try {
          tree = parser.parse(lines.slice(start, end + 1).join('\n'));
        } catch (error) {
          // Blank lines inside function bodies and template literals do not
          // terminate a module. Let the MDX parser find the complete statement.
          if (end === lines.length - 1) {
            throw error;
          }
          continue;
        }
        const node = tree.children[0];
        if (node?.type === 'mdxjsEsm') {
          inlineModules.push(node.value);
          const lastLine = start + node.position!.end.line - 1;
          lines.fill('', start, lastLine + 1);
          return lastLine;
        }
      }
      throw new Error('Expected an MDX import or export declaration.');
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trimEnd();
      if (line.match(/^---$/)) {
        slice(i);

        const next = lines[i + 1];
        if (line.match(/^---$/) && !next?.match(/^\s*$/)) {
          start = i;
          for (i += 1; i < lines.length; i++) {
            if (lines[i].trimEnd().match(/^---$/)) {
              break;
            }
          }
        }
      } else if (line.startsWith('```')) {
        for (i += 1; i < lines.length; i++) {
          if (lines[i].startsWith('```')) {
            break;
          }
        }
      } else if (MODULE_HEADER_REGEXP.test(line)) {
        i = extractModule(i);
      }
    }

    if (start <= lines.length - 1) {
      slice(lines.length);
    }

    inlineModules = Array.from(new Set(inlineModules));
    let compiledModules = '';
    if (inlineModules.length) {
      await compileMDX(
        inlineModules.join('\n'),
        {
          ...options,
          recmaPlugins: [
            () => (tree: JavaScriptProgram) => {
              // Original ESM nodes retain their source offsets. MDX's generated
              // runtime imports and component wrappers have no source offsets.
              compiledModules = toJs({
                ...tree,
                body: tree.body.filter(isSourceDeclaration),
              }).value;
            },
            ...(options.recmaPlugins ?? []),
          ],
        },
        !isProduction,
      );
    }

    return `
      import React from 'react';
      ${
        isProduction
          ? `import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';`
          : `import { Fragment as _Fragment, jsxDEV as _jsxDEV } from 'react/jsx-dev-runtime';`
      }
      import { useMDXComponents as _provideComponents } from "@nkzw/remdx";
      ${compiledModules}\n
      export default [${(await compileSlides(slides)).join(',\n')}];
    `;
  };

  const getHighlighter = () => {
    highlighterPromise ??= createHighlighter({
      langs: [],
      themes: [Licht, Dunkel],
    });
    return highlighterPromise;
  };

  const normalizeAndLoadFenceLanguages = async (source: string) => {
    const unsupportedLanguages = new Set<string>();
    const highlighter = await getHighlighter();

    for (const language of extractFenceLanguages(source)) {
      const normalizedLanguage = addTagsToTypescript(language);

      if (loadedLanguages.has(normalizedLanguage)) {
        continue;
      }
      if (unsupportedLanguages.has(normalizedLanguage)) {
        continue;
      }
      try {
        await highlighter.loadLanguage(normalizedLanguage as never);
        loadedLanguages.add(normalizedLanguage);
      } catch {
        unsupportedLanguages.add(normalizedLanguage);
      }
    }

    return source.replaceAll(
      CODE_FENCE_HEADER_REGEXP,
      (header, language: string, metadata = '') => {
        const rawLanguage = language.trim().toLowerCase();
        const normalizedLanguage = addTagsToTypescript(rawLanguage);

        if (unsupportedLanguages.has(normalizedLanguage)) {
          return `\`\`\`text${metadata}`;
        }

        if (normalizedLanguage !== rawLanguage) {
          return `\`\`\`${normalizedLanguage}${metadata}`;
        }

        return header;
      },
    );
  };

  return {
    enforce: 'pre',
    name: 'mdx-transform',
    async transform(code: string, id: string) {
      if (id.endsWith('.re.mdx')) {
        const normalizedCode = await normalizeAndLoadFenceLanguages(code);
        const highlighter = await getHighlighter();

        return await transform(normalizedCode, {
          recmaPlugins: [removeModuleDeclarations],
          rehypePlugins: [
            [rehypeRaw, { passThrough: nodeTypes }],
            [
              rehypeShikiFromHighlighter,
              highlighter,
              {
                themes: {
                  dark: 'Dunkel',
                  light: 'Licht',
                },
                transformers: [shikiTransformerCodeTitle(), transformerMetaHighlight()],
              },
            ],
          ],
          remarkPlugins: [preserveCodeBlockMeta],
        });
      }
    },
  };
}
