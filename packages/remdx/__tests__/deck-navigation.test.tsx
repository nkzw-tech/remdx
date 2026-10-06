// @vitest-environment happy-dom
import { act, useContext } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, test, vi } from 'vite-plus/test';
import Deck, { DeckContext } from '../src/deck.tsx';
import Slide from '../src/slide.tsx';

let root: Root;
let container: HTMLDivElement;

function Content({ title }: { title: string }) {
  const { activeView, navigationDirection, stepBackward, stepForward } = useContext(DeckContext);
  return (
    <>
      <p>{title}</p>
      <button data-back onClick={stepBackward} type="button">
        Back
      </button>
      <button data-next onClick={stepForward} type="button">
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
