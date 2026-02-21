import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { compile, CompileOptions, nodeTypes } from '@mdx-js/mdx';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { transformerMetaHighlight } from '@shikijs/transformers';
import matter from 'gray-matter';
import normalizeNewline from 'normalize-newline';
import rehypeRaw from 'rehype-raw';
import {
  createHighlighter,
  type ShikiTransformer,
  type ThemeRegistrationResolved,
} from 'shiki';
import type { Plugin } from 'vite';

type Slide = [string, Record<string, unknown>];

const EXPORT_DEFAULT_REGEXP = /export\sdefault\s/g;
const MODULE_REGEXP = /\\`|`(?:\\`|[^`])*`|(^(?:import|export)[^;]+;)/gm;
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

  const match = raw.match(
    /(?:^|\s)title=(?:"([^"]+)"|'([^']+)'|(\S+))(?:\s|$)/,
  );
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

const replaceUnsupportedFenceLanguages = (
  source: string,
  unsupportedLanguages: ReadonlySet<string>,
) =>
  source.replaceAll(
    CODE_FENCE_HEADER_REGEXP,
    (header, language: string, metadata = '') =>
      unsupportedLanguages.has(language.trim().toLowerCase())
        ? `\`\`\`text${metadata}`
        : header,
  );

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
    const hProperties =
      (node.data.hProperties as Record<string, unknown> | undefined) ?? {};
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

const compileMDX = async (
  content: string,
  options: CompileOptions,
  development = true,
) =>
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
  let highlighterPromise: Promise<
    Awaited<ReturnType<typeof createHighlighter>>
  >;
  const loadedLanguages = new Set<string>();
  const isProduction = process.env.NODE_ENV === 'production';

  const wrapComponent = (
    content: string,
    data: Record<string, unknown>,
  ) => `(() => {
    function MDXContentWrapper(props) {
      ${content
        .replaceAll(EXPORT_DEFAULT_REGEXP, '')
        .replaceAll(MODULE_REGEXP, (value, group1) => (group1 ? '' : value))
        .trim()}
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
              compileMDX(
                `${inlineModules.join('\n')}\n\n${content}`,
                options,
                !isProduction,
              ).then((content) => [content, data]) as Promise<Slide>,
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

    const lines = normalizeNewline(source)
      .replaceAll(MODULE_REGEXP, (value, group1) => {
        if (!group1) {
          return value;
        }
        inlineModules.push(value);
        return '';
      })
      .split(/\n/g);

    inlineModules = Array.from(new Set(inlineModules));

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
      }
    }

    if (start <= lines.length - 1) {
      slice(lines.length);
    }

    return `
      import React from 'react';
      ${
        isProduction
          ? `import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';`
          : `import { Fragment as _Fragment, jsxDEV as _jsxDEV } from 'react/jsx-dev-runtime';`
      }
      import { useMDXComponents as _provideComponents } from "@nkzw/remdx";
      ${inlineModules.join('\n')}\n
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

  const loadFenceLanguages = async (source: string) => {
    const unsupportedLanguages = new Set<string>();
    const highlighter = await getHighlighter();

    for (const language of extractFenceLanguages(source)) {
      if (loadedLanguages.has(language)) {
        continue;
      }
      try {
        await highlighter.loadLanguage(language as never);
        loadedLanguages.add(language);
      } catch {
        unsupportedLanguages.add(language);
      }
    }

    return unsupportedLanguages;
  };

  return {
    enforce: 'pre',
    name: 'mdx-transform',
    async transform(code: string, id: string) {
      if (id.endsWith('.re.mdx')) {
        const highlighter = await getHighlighter();
        const unsupportedLanguages = await loadFenceLanguages(code);
        const normalizedCode =
          unsupportedLanguages.size > 0
            ? replaceUnsupportedFenceLanguages(code, unsupportedLanguages)
            : code;

        return await transform(normalizedCode, {
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
                transformers: [
                  shikiTransformerCodeTitle(),
                  transformerMetaHighlight(),
                ],
              },
            ],
          ],
          remarkPlugins: [preserveCodeBlockMeta],
        });
      }
    },
  };
}
