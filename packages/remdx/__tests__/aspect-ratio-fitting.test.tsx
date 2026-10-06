// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useResizeObserver } from 'use-resize-observer';
import { afterEach, beforeEach, expect, test, vi } from 'vite-plus/test';
import useAspectRatioFitting from '../src/hooks/use-aspect-ratio-fitting.tsx';

vi.mock('use-resize-observer', () => ({
  useResizeObserver: vi.fn(() => ({ ref: vi.fn() })),
}));

let root: Root;
let container: HTMLDivElement;

function Layout() {
  const [ref, style] = useAspectRatioFitting(16 / 9);
  return (
    <div ref={ref}>
      <output>{JSON.stringify(style)}</output>
    </div>
  );
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.mocked(useResizeObserver).mockClear();
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test('a hidden deck waits for a measurable size and fits when it becomes visible', async () => {
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([] as unknown as DOMRectList);
  await act(() => root.render(<Layout />));
  expect(container.querySelector('output')).not.toBeNull();
  const onResize = vi.mocked(useResizeObserver).mock.calls.at(-1)![0]!.onResize!;
  await act(() =>
    onResize({
      entry: {
        borderBoxSize: [],
        contentBoxSize: [],
        contentRect: new DOMRect(0, 0, 683, 900),
        devicePixelContentBoxSize: [],
        target: container,
      },
      height: 900,
      width: 683,
    }),
  );
  const style = JSON.parse(container.querySelector('output')!.textContent!);
  expect(style.transform).toContain('scale(0.5)');
  expect(style.transformOrigin).not.toMatch(/NaN|Infinity/);
});

test.each([
  [1366, 900, 'translate(0px, 65.8125px) scale(1)'],
  [1600, 768.375, 'translate(117px, 0px) scale(1)'],
  [1366, 768.375, 'translate(0px, 0px) scale(1)'],
  [683, 900, 'translate(0px, 257.90625px) scale(0.5)'],
])('centers a deck in a %s × %s viewport', async (width, height, transform) => {
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([
    new DOMRect(0, 0, width, height),
  ] as unknown as DOMRectList);
  await act(() => root.render(<Layout />));
  const style = JSON.parse(container.querySelector('output')!.textContent!);
  expect(style.transform).toBe(transform);
  expect(style.transformOrigin).toBe('0 0');
});
