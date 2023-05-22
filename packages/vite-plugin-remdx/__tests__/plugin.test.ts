import { expect, test } from 'vitest';
import remdx from '../index.ts';

const { transform } = remdx();

test('remdx compiler', async () => {
  const transformFn = transform as unknown as (
    code: string,
    id: string,
  ) => Promise<string>;

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
          import { useMDXComponents as _provideComponents } from \\"@nkzw/remdx\\";
          import data from './data.tsx';
    export { Components } from './Components.tsx';

          export default [(() => {
        function MDXContentWrapper(props) {
          /*@jsxRuntime automatic @jsxImportSource react*/




    function _createMdxContent(props) {
      const _components = Object.assign({
        h1: \\"h1\\"
      }, _provideComponents(), props.components);
      return _jsxDEV(_components.h1, {
        children: \\"Slide 1\\"
      }, undefined, false, {
        fileName: \\"<source.js>\\",
        lineNumber: 4,
        columnNumber: 1
      }, this);
    }
    function MDXContent(props = {}) {
      const {wrapper: MDXLayout} = Object.assign({}, _provideComponents(), props.components);
      return MDXLayout ? _jsxDEV(MDXLayout, Object.assign({}, props, {
        children: _jsxDEV(_createMdxContent, props, undefined, false, {
          fileName: \\"<source.js>\\"
        }, this)
      }), undefined, false, {
        fileName: \\"<source.js>\\"
      }, this) : _createMdxContent(props);
    }
    MDXContent;
          return _jsxDEV(MDXContent, props);
        };
        MDXContentWrapper.isMDXComponent = true;
        return {Component: MDXContentWrapper, data: {}};
        })(),
    (() => {
        function MDXContentWrapper(props) {
          /*@jsxRuntime automatic @jsxImportSource react*/




    function _createMdxContent(props) {
      const _components = Object.assign({
        h1: \\"h1\\"
      }, _provideComponents(), props.components);
      return _jsxDEV(_components.h1, {
        children: \\"Slide 2\\"
      }, undefined, false, {
        fileName: \\"<source.js>\\",
        lineNumber: 5,
        columnNumber: 1
      }, this);
    }
    function MDXContent(props = {}) {
      const {wrapper: MDXLayout} = Object.assign({}, _provideComponents(), props.components);
      return MDXLayout ? _jsxDEV(MDXLayout, Object.assign({}, props, {
        children: _jsxDEV(_createMdxContent, props, undefined, false, {
          fileName: \\"<source.js>\\"
        }, this)
      }), undefined, false, {
        fileName: \\"<source.js>\\"
      }, this) : _createMdxContent(props);
    }
    MDXContent;
          return _jsxDEV(MDXContent, props);
        };
        MDXContentWrapper.isMDXComponent = true;
        return {Component: MDXContentWrapper, data: {\\"theme\\":\\"dark\\"}};
        })()];
        "
  `);
});
