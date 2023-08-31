import { basename } from 'node:path';
import { compile, CompileOptions, nodeTypes } from '@mdx-js/mdx';
import matter from 'gray-matter';
import normalizeNewline from 'normalize-newline';
import rehypeRaw from 'rehype-raw';
import shikiTwoslash, { setupForFile } from 'remark-shiki-twoslash';
import type { Plugin } from 'vite';
import ColorReplacements from './lib/ColorReplacements';

type Slide = [string, Record<string, unknown>];

const EXPORT_DEFAULT_REGEXP = /export\sdefault\s/g;
const MODULE_REGEXP = /\\`|`(?:\\`|[^`])*`|(^(?:import|export).*$)/gm;

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
  let initialized = false;
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

  const root = process.cwd();
  const shikiOptions = {
    addTryButton: false as true, // LOL
    paths: { themes: root },
    themes: [
      `${
        basename(root) === 'remdx'
          ? `/packages/vite-plugin-remdx/`
          : `/node_modules/@nkzw/vite-plugin-remdx/`
      }lib/licht`,
    ],
    vfsRoot: root,
  };

  const shikiTwoslashFn =
    (shikiTwoslash as unknown as { default: typeof shikiTwoslash }).default ||
    shikiTwoslash;

  return {
    enforce: 'pre',
    name: 'mdx-transform',
    async transform(code: string, id: string) {
      if (id.endsWith('.re.mdx')) {
        if (!initialized) {
          const {
            highlighters: [highlighter],
          } = await setupForFile(shikiOptions);
          highlighter?.setColorReplacements?.(ColorReplacements);
          initialized = true;
        }

        return await transform(code, {
          // @ts-expect-error
          rehypePlugins: [[rehypeRaw, { passThrough: nodeTypes }]],
          remarkPlugins: [[shikiTwoslashFn, shikiOptions]],
        });
      }
    },
  };
}
