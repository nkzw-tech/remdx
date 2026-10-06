import { expect, test } from 'vite-plus/test';
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

test.each(
  ['json', 'ts', 'typescript', 'unsupported-language'].flatMap((language) =>
    ['  ', '\t'].map((indentation) => [language, indentation]),
  ),
)(
  'indented %s fences are highlighted without changing code indentation or metadata',
  async (language, indentation) => {
    const transformFn = remdx().transform as unknown as (
      code: string,
      id: string,
    ) => Promise<string>;
    const fence = '```';
    const output = await transformFn(
      [
        '<div>',
        `${indentation}${fence}${language} title="demo" {2}`,
        `${indentation}{`,
        `${indentation}  "enabled": true`,
        `${indentation}}`,
        `${indentation}${fence}`,
        '</div>',
        '',
        '---',
        '',
        'Second slide',
      ].join('\n'),
      'slides.re.mdx',
    );

    expect(output).toContain('className: "shiki shiki-themes Licht Dunkel"');
    expect(output).toContain('"data-title": "demo"');
    expect(output).toContain('className: "line highlighted"');
    expect(output.match(/MDXContentWrapper\.isMDXComponent/g)).toHaveLength(2);
    expect(output).not.toContain('children: "    ');
  },
);

test.each(['````', '~~~'])(
  'fence-shaped content inside %s fences is preserved',
  async (outerFence) => {
    const transformFn = remdx().transform as unknown as (
      code: string,
      id: string,
    ) => Promise<string>;
    const fence = '```';
    const output = await transformFn(
      [
        `${outerFence}text`,
        `  ${fence}typescript`,
        `  ${fence}unsupported-language`,
        `  ${fence}`,
        outerFence,
        '',
        '---',
        '',
        'Second slide',
      ].join('\n'),
      'slides.re.mdx',
    );

    expect(output.match(/MDXContentWrapper\.isMDXComponent/g)).toHaveLength(2);
    expect(output).toContain(`${fence}typescript`);
    expect(output).toContain(`${fence}unsupported-language`);
    expect(output).not.toContain('ts-tags');
  },
);

test('frontmatter scalar is preserved', async () => {
  const transform = remdx().transform as unknown as (code: string, id: string) => Promise<string>;
  const output = await transform(
    [
      '# First',
      '',
      '---',
      'example: |',
      '  ```typescript',
      '  const x = 1;',
      '  ```',
      '---',
      '',
      '# Slide',
    ].join('\n'),
    'slides.re.mdx',
  );
  expect(output).toContain('"example":"```typescript\\nconst x = 1;\\n```\\n"');
});

test.each([
  ['{/*', '  ```typescript', '*/}'],
  ['{', '  /*', '  ```typescript', '  */', '}'],
  ['- ```typescript', '  const x = 1;', '  ```'],
  ['1. ```typescript', '   const x = 1;', '   ```'],
])('fence-shaped comments and list fences preserve slide separators', async (...lines) => {
  const transformFn = remdx().transform as unknown as (code: string, id: string) => Promise<string>;
  const output = await transformFn(
    [...lines, '', '---', '', '# Second'].join('\n'),
    'slides.re.mdx',
  );
  expect(output.match(/MDXContentWrapper\.isMDXComponent/g)).toHaveLength(2);
});

test.each([
  ['- ```text', '  payload', '', '---', '', '# Second'],
  ['- item', '', '  ```text', '  payload', '', '---', '', '# Second'],
  ['- ```text', '  payload', '- sibling', '', '---', '', '# Second'],
])('list fences end before the following slide', async (...lines) => {
  const transformFn = transform as unknown as (code: string, id: string) => Promise<string>;
  const output = await transformFn(lines.join('\n'), 'slides.re.mdx');
  expect(output.match(/MDXContentWrapper\.isMDXComponent/g)).toHaveLength(2);
});

test('root fence after a list keeps slide separators in code', async () => {
  const transformFn = transform as unknown as (code: string, id: string) => Promise<string>;
  const output = await transformFn(
    ['- ```text', '  payload', '```', '---', '', '# Second'].join('\n'),
    'slides.re.mdx',
  );
  expect(output.match(/MDXContentWrapper\.isMDXComponent/g)).toHaveLength(1);
  expect(output).toContain('---');
});
