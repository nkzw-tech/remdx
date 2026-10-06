import { expect, test } from 'vitest';
import remdx from '../index.ts';

const { transform } = remdx();

test('remdx compiler', async () => {
  const transformFn = transform as unknown as (code: string, id: string) => Promise<string>;

  expect(
    await transformFn(
      `
import data from './data.tsx';
export { Components } from './Components.tsx';

# Slide 1

---

theme: dark

--

# Slide 2
  `,
      'slides.re.mdx',
    ),
  ).toMatchInlineSnapshot(`
    "
          import React from 'react';
          import { Fragment as _Fragment, jsxDEV as _jsxDEV } from 'react/jsx-dev-runtime';
          import { useMDXComponents as _provideComponents } from "@nkzw/remdx";
          import data from './data.tsx';
    export { Components } from './Components.tsx';

          export default [(() => {
        function MDXContentWrapper(props) {
          function _createMdxContent(props) {
      const _components = {
        h1: "h1",
        ..._provideComponents(),
        ...props.components
      };
      return _jsxDEV(_components.h1, {
        children: "Slide 1"
      }, undefined, false, {
        fileName: "<source.js>",
        lineNumber: 4,
        columnNumber: 1
      }, this);
    }
    function MDXContent(props = {}) {
      const {wrapper: MDXLayout} = {
        ..._provideComponents(),
        ...props.components
      };
      return MDXLayout ? _jsxDEV(MDXLayout, {
        ...props,
        children: _jsxDEV(_createMdxContent, {
          ...props
        }, undefined, false, {
          fileName: "<source.js>"
        }, this)
      }, undefined, false, {
        fileName: "<source.js>"
      }, this) : _createMdxContent(props);
    }
          return _jsxDEV(MDXContent, props);
        };
        MDXContentWrapper.isMDXComponent = true;
        return {Component: MDXContentWrapper, data: {}};
        })(),
    (() => {
        function MDXContentWrapper(props) {
          function _createMdxContent(props) {
      const _components = {
        h1: "h1",
        ..._provideComponents(),
        ...props.components
      };
      return _jsxDEV(_components.h1, {
        children: "Slide 2"
      }, undefined, false, {
        fileName: "<source.js>",
        lineNumber: 5,
        columnNumber: 1
      }, this);
    }
    function MDXContent(props = {}) {
      const {wrapper: MDXLayout} = {
        ..._provideComponents(),
        ...props.components
      };
      return MDXLayout ? _jsxDEV(MDXLayout, {
        ...props,
        children: _jsxDEV(_createMdxContent, {
          ...props
        }, undefined, false, {
          fileName: "<source.js>"
        }, this)
      }, undefined, false, {
        fileName: "<source.js>"
      }, this) : _createMdxContent(props);
    }
          return _jsxDEV(MDXContent, props);
        };
        MDXContentWrapper.isMDXComponent = true;
        return {Component: MDXContentWrapper, data: {"theme":"dark"}};
        })()];
        "
  `);
});

test('shiki metadata is preserved for titles and highlighted lines', async () => {
  const transformFn = remdx().transform as unknown as (code: string, id: string) => Promise<string>;

  const fence = '```';
  const output = await transformFn(
    [
      '# Slide',
      '',
      `${fence}js title="demo.ts" {2}`,
      'const a = 1;',
      'const b = 2;',
      fence,
      '',
    ].join('\n'),
    'slides.re.mdx',
  );

  expect(output).toContain('"data-title": "demo.ts"');
  expect(output).toContain('className: "line highlighted"');
  expect(output).toContain('className: "shiki shiki-themes Licht Dunkel"');
  expect(output).toContain('--shiki-dark');
});
