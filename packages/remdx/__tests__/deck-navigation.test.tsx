// @vitest-environment happy-dom
import { act, useContext, useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vite-plus/test';
import Deck, { DeckContext } from '../src/deck.tsx';
import useDeck, { type DeckControls } from '../src/hooks/use-deck.tsx';
import Slide from '../src/slide.tsx';

let root: Root;
let container: HTMLDivElement;
let controls: DeckControls;

function Content({ title }: { title: string }) {
  const deck = useDeck();
  const { activeView, navigationDirection } = useContext(DeckContext);
  useEffect(() => {
    controls = deck;
  }, [deck]);
  return (
    <>
      <p>{title}</p>
      <button data-back onClick={deck.previousSlide} type="button">
        Back
      </button>
      <button data-next onClick={deck.nextSlide} type="button">
        Next
      </button>
      <output>{JSON.stringify({ ...activeView, direction: navigationDirection })}</output>
    </>
  );
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([
    new DOMRect(0, 0, 1280, 720),
  ] as unknown as DOMRectList);
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    addEventListener() {},
    matches: false,
    removeEventListener() {},
  } as unknown as MediaQueryList);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
  window.history.replaceState(null, '', '/');
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function mount(path: string) {
  window.history.replaceState(null, '', path);
  await act(() =>
    root.render(
      <Deck
        slides={['First', 'Second', 'Third'].map((title, id) => (
          <Slide id={id} key={id}>
            <Content title={title} />
          </Slide>
        ))}
        transition={{}}
      />,
    ),
  );
}

function activeSlide() {
  return container.querySelector<HTMLElement>('[aria-hidden="false"]')!;
}

async function navigate(action: 'back' | 'next') {
  await act(() => activeSlide().querySelector<HTMLButtonElement>(`[data-${action}]`)!.click());
}

test.each(['/slide-999', '/?slideIndex=998'])(
  'out-of-range link %s selects the last slide',
  async (path) => {
    await mount(path);
    expect(activeSlide().querySelector('p')?.textContent).toBe('Third');
    expect(window.location.pathname).toBe('/slide-3');
    expect(window.location.search).toBe('');
    await navigate('next');
    expect(activeSlide().querySelector('p')?.textContent).toBe('Third');
    await navigate('back');
    expect(activeSlide().querySelector('p')?.textContent).toBe('Second');
  },
);

test('out-of-range links reached through history also select a valid slide', async () => {
  await mount('/slide-1');
  await act(() => {
    window.history.replaceState(window.history.state, '', '/slide-999');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  expect(activeSlide().querySelector('p')?.textContent).toBe('Third');
  expect(window.location.pathname).toBe('/slide-3');
});

test.each(['/slide-2/step-2', '/slide-2/step-final', '/?slideIndex=1&stepIndex=2'])(
  'unsupported steps in %s normalize before Back navigates',
  async (path) => {
    await mount(path);
    expect(window.location.pathname).toBe('/slide-2');
    expect(JSON.parse(activeSlide().querySelector('output')!.textContent!)).toMatchObject({
      slideIndex: 1,
      stepIndex: 0,
    });
    await navigate('back');
    expect(activeSlide().querySelector('p')?.textContent).toBe('First');
    expect(window.location.pathname).toBe('/slide-1');
    expect(JSON.parse(activeSlide().querySelector('output')!.textContent!)).toMatchObject({
      direction: -1,
    });
  },
);

test('step links reached through history normalize before forward navigation', async () => {
  await mount('/slide-1');
  await act(() => {
    window.history.replaceState(window.history.state, '', '/slide-2/step-2');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  expect(window.location.pathname).toBe('/slide-2');
  await navigate('next');
  expect(activeSlide().querySelector('p')?.textContent).toBe('Third');
  expect(window.location.pathname).toBe('/slide-3');
});

test.each([
  ['ArrowRight', false, '/slide-3', 1],
  ['PageDown', false, '/slide-3', 1],
  [' ', false, '/slide-3', 1],
  ['ArrowLeft', false, '/slide-1', -1],
  ['PageUp', false, '/slide-1', -1],
  [' ', true, '/slide-1', -1],
  ['Home', false, '/slide-1', -1],
  ['End', false, '/slide-3', 1],
])('%s (shift: %s) navigates to %s', async (key, shiftKey, path, direction) => {
  await mount('/slide-2');
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, shiftKey });
  await act(() => document.body.dispatchEvent(event));
  expect(window.location.pathname).toBe(path);
  expect(controls.direction).toBe(direction);
  expect(event.defaultPrevented).toBe(true);
});

test.each([
  ['input', {}],
  ['textarea', {}],
  ['select', {}],
  ['button', {}],
  ['a', { href: '#' }],
  ['div', { contenteditable: 'true' }],
  ['div', { role: 'textbox' }],
  ['div', { role: 'slider' }],
  ['div', { role: 'checkbox' }],
] as const)('presentation keys leave %s %j alone', async (tag, attributes) => {
  await mount('/slide-2');
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  const child = document.createElement('span');
  element.append(child);
  activeSlide().append(element);
  for (const key of [' ', 'ArrowLeft', 'PageDown', 'Home', 'End']) {
    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
    await act(() => child.dispatchEvent(event));
    expect(window.location.pathname).toBe('/slide-2');
    expect(event.defaultPrevented).toBe(false);
  }
});

test.each([
  { altKey: true },
  { ctrlKey: true },
  { metaKey: true },
  { shiftKey: true },
  { isComposing: true },
])('modified or composing keyboard events %j do not navigate', async (options) => {
  await mount('/slide-2');
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key: 'ArrowRight',
    ...options,
  });
  await act(() => document.body.dispatchEvent(event));
  expect(window.location.pathname).toBe('/slide-2');
  expect(event.defaultPrevented).toBe(false);
});

test('presentation controls honor events handled by slide content', async () => {
  await mount('/slide-2');
  const element = document.createElement('div');
  element.addEventListener('keydown', (event) => event.preventDefault());
  activeSlide().append(element);
  await act(() =>
    element.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: ' ' }),
    ),
  );
  expect(window.location.pathname).toBe('/slide-2');
});

test('presentation controls preserve keyboard events inside an interactive shadow host', async () => {
  await mount('/slide-2');
  const element = document.createElement('div');
  element.setAttribute('role', 'textbox');
  const shadow = element.attachShadow({ mode: 'open' });
  const child = document.createElement('div');
  shadow.append(child);
  activeSlide().append(element);
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    composed: true,
    key: ' ',
  });
  await act(() => child.dispatchEvent(event));
  expect(window.location.pathname).toBe('/slide-2');
  expect(event.defaultPrevented).toBe(false);
});

test('useDeck jumps use zero-based indices, clamp bounds, and preserve the URL prefix', async () => {
  await mount('/talk/slide-1');
  expect(controls).toMatchObject({ direction: 0, slideCount: 3, slideIndex: 0 });
  await act(() => controls.goToSlide(2));
  expect(activeSlide().querySelector('p')?.textContent).toBe('Third');
  expect(window.location.pathname).toBe('/talk/slide-3');
  expect(controls).toMatchObject({ direction: 1, slideIndex: 2 });
  await act(() => controls.goToSlide(-100));
  expect(window.location.pathname).toBe('/talk/slide-1');
  expect(controls).toMatchObject({ direction: -1, slideIndex: 0 });
  await act(() => controls.goToSlide(999));
  expect(window.location.pathname).toBe('/talk/slide-3');
  await act(() => controls.previousSlide());
  expect(window.location.pathname).toBe('/talk/slide-2');
  await act(() => controls.nextSlide());
  expect(window.location.pathname).toBe('/talk/slide-3');
});

test.each([Number.NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1])(
  'goToSlide rejects invalid index %s without changing the current slide',
  async (index) => {
    await mount('/slide-2');
    expect(() => controls.goToSlide(index)).toThrow(
      'remdx: goToSlide() expects a safe integer slide index.',
    );
    expect(window.location.pathname).toBe('/slide-2');
  },
);

test('useDeck reports a useful error outside a deck', () => {
  expect(() => renderToString(<Content title="Outside" />)).toThrow(
    'remdx: useDeck() must be called inside a <Deck>.',
  );
});

test('controls stop listening when the deck unmounts', async () => {
  await mount('/slide-2');
  await act(() => root.render(null));
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: ' ' });
  document.body.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(false);
});
