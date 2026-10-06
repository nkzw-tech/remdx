import { transformWithOxc } from 'vite';
import { expect, test } from 'vite-plus/test';
import remdx from '../index.ts';

async function compile(source: string) {
  const transform = remdx().transform as unknown as (code: string, id: string) => Promise<string>;
  const output = await transform(source, 'slides.re.mdx');
  await transformWithOxc(output, 'slides.js');
  return output;
}

test('complete exported function bodies are hoisted and available on every slide', async () => {
  const output = await compile(
    [
      'export const Greeting = () => {',
      '  const message = "hello";',
      '',
      '  return message;',
      '};',
      '',
      '<Greeting />',
      '',
      '---',
      '',
      '<Greeting />',
    ].join('\n'),
  );
  expect(output).toContain('const message = "hello";');
  expect(output).toContain('return message;');
  expect(output.match(/export const Greeting/g)).toHaveLength(1);
  expect(output).not.toContain('_missingMdxReference("Greeting"');
  expect(output.match(/data: \{\}/g)).toHaveLength(2);
});

test('module declarations can omit semicolons', async () => {
  const output = await compile('import Greeting from "./greeting"\n\n<Greeting />\n');
  expect(output).toContain('import Greeting from "./greeting"');
});

test('template literals in modules can contain slide separators', async () => {
  const output = await compile('export const text = `before\n---\nafter`;\n\n{text}\n');
  expect(output).toContain('`before\n---\nafter`');
  expect(output.match(/data: \{\}/g)).toHaveLength(1);
});

test('imports and exports inside code fences stay in the displayed example', async () => {
  const output = await compile('# Slide\n\n```\nexport const example = 1;\n```\n');
  expect(output).toContain('export const example = 1;');
  expect(output.match(/data: \{\}/g)).toHaveLength(1);
});

test('exported functions containing JSX compile to JavaScript before hoisting', async () => {
  const output = await compile(
    'export const Greeting = () => { const text = "hello"; return <b>{text}</b>; };\n\n<Greeting />\n',
  );
  expect(output).toContain('export const Greeting');
  expect(output).toContain('const text = "hello";');
  expect(output).not.toContain('<b>');
});
