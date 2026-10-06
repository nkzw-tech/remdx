// @vitest-environment happy-dom
import { act, type ComponentProps } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vite-plus/test';
import { DeckContext } from '../src/deck.tsx';
import { deckReducer, type DeckState } from '../src/hooks/use-deck-state.tsx';
import useSlideTransition from '../src/hooks/use-slide-transition.tsx';
import useSlide from '../src/hooks/use-slide.tsx';
import Slide from '../src/slide.tsx';
import { defaultTransition, Transitions } from '../src/transitions.tsx';
import type { SlideTransition } from '../types.tsx';

const transition: SlideTransition = {
  enter: {
    keyframes: {
      back: [{ transform: 'translateX(-32px)' }, { transform: 'none' }],
      forward: [{ transform: 'translateX(32px)' }, { transform: 'none' }],
    },
    options: { duration: 500, easing: 'linear' },
  },
  leave: {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    options: { duration: 360, easing: 'linear' },
  },
};

const playbacks: Array<{ cancel: ReturnType<typeof vi.fn>; finish(): void }> = [];
const animate = vi.fn<HTMLElement['animate']>(() => {
  let finish!: () => void;
  let reject!: (reason: Error) => void;
  const finished = new Promise<void>((resolve, rejectPromise) => {
    finish = resolve;
    reject = rejectPromise;
  });
  const playback = {
    cancel: vi.fn(() => reject(new Error('Animation cancelled'))),
    finish,
    finished,
  };
  playbacks.push(playback);
  return playback as unknown as Animation;
});

type Props = {
  direction?: number;
  initialized?: boolean;
  isActive: boolean;
  transition?: SlideTransition;
};

function Harness({ direction = 1, initialized = true, isActive, transition = {} }: Props) {
  const [ref, isExiting] = useSlideTransition(isActive, initialized, direction, transition);
  return <div data-exiting={isExiting} ref={ref} />;
}

let root: Root;
let container: HTMLDivElement;
let reducedMotion: boolean;
let media: EventTarget;
const originalAnimate = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'animate');

async function render(props: Props) {
  await act(() => root.render(<Harness {...props} />));
}

async function finish(index: number) {
  await act(async () => {
    playbacks[index].finish();
    await Promise.resolve();
  });
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  reducedMotion = false;
  media = new EventTarget();
  Object.defineProperty(media, 'matches', { get: () => reducedMotion });
  vi.spyOn(window, 'matchMedia').mockReturnValue(media as MediaQueryList);
  Object.defineProperty(HTMLElement.prototype, 'animate', {
    configurable: true,
    value: animate,
    writable: true,
  });
  animate.mockClear();
  playbacks.length = 0;
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
  if (originalAnimate) {
    Object.defineProperty(HTMLElement.prototype, 'animate', originalAnimate);
  } else {
    Reflect.deleteProperty(HTMLElement.prototype, 'animate');
  }
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test('initial loading does not animate', async () => {
  await render({ initialized: false, isActive: false, transition });
  await render({ isActive: true, transition });
  expect(animate).not.toHaveBeenCalled();
});

test.each([1, -1])('entry follows navigation direction %s', async (direction) => {
  await render({ direction, isActive: false, transition });
  await render({ direction, isActive: true, transition });
  const keyframes = transition.enter!.keyframes;
  expect(animate).toHaveBeenCalledWith(
    'forward' in keyframes ? (direction < 0 ? keyframes.back : keyframes.forward) : keyframes,
    { duration: 500, easing: 'linear', fill: 'both' },
  );
});

test('exit stays visible until playback completes', async () => {
  await render({ isActive: true, transition });
  await render({ isActive: false, transition });
  expect(animate).toHaveBeenCalledWith(transition.leave!.keyframes, {
    duration: 360,
    easing: 'linear',
    fill: 'both',
  });
  expect(container.firstElementChild?.getAttribute('data-exiting')).toBe('true');
  await finish(0);
  expect(container.firstElementChild?.getAttribute('data-exiting')).toBe('false');
});

test('navigation cancels interrupted playback', async () => {
  await render({ isActive: true, transition });
  await render({ isActive: false, transition });
  await render({ direction: -1, isActive: true, transition });
  expect(playbacks[0].cancel).toHaveBeenCalledOnce();
  expect(container.firstElementChild?.getAttribute('data-exiting')).toBe('false');
});

test('obsolete completion cannot hide a new outgoing slide', async () => {
  await render({ isActive: true, transition });
  await render({ isActive: false, transition });
  // Simulate a completion already queued when cancellation occurs.
  playbacks[0].cancel.mockImplementation(() => {});
  await render({ isActive: true, transition });
  await render({ isActive: false, transition });
  await finish(0);
  expect(container.firstElementChild?.getAttribute('data-exiting')).toBe('true');
  await finish(2);
  expect(container.firstElementChild?.getAttribute('data-exiting')).toBe('false');
});

test('steps and new transition objects do not restart or cancel entry', async () => {
  await render({ isActive: false, transition });
  await render({ isActive: true, transition });
  await render({ direction: -1, isActive: true, transition: { ...transition } });
  expect(animate).toHaveBeenCalledOnce();
  expect(playbacks[0].cancel).not.toHaveBeenCalled();
});

test('reduced motion switches immediately', async () => {
  reducedMotion = true;
  await render({ isActive: true, transition });
  await render({ isActive: false, transition });
  expect(animate).not.toHaveBeenCalled();
  expect(container.firstElementChild?.getAttribute('data-exiting')).toBe('false');
});

test('enabling reduced motion settles playback already in progress', async () => {
  await render({ isActive: true, transition });
  await render({ isActive: false, transition });
  await act(() => {
    reducedMotion = true;
    media.dispatchEvent(new Event('change'));
  });
  expect(playbacks[0].cancel).toHaveBeenCalledOnce();
  expect(container.firstElementChild?.getAttribute('data-exiting')).toBe('false');
});

test('empty keyframes and none do not start playback', async () => {
  await render({ isActive: true, transition: Transitions.none });
  await render({ isActive: false, transition: Transitions.none });
  await render({ isActive: true, transition: { enter: { keyframes: [] } } });
  expect(animate).not.toHaveBeenCalled();
});

type Context = ComponentProps<typeof DeckContext.Provider>['value'];

function context(index: number, direction = 1, preset = transition): Context {
  return {
    activeView: { slideIndex: index, stepIndex: 0 },
    advanceSlide: vi.fn(),
    cancelTransition: vi.fn(),
    commitTransition: vi.fn(),
    goToSlide: vi.fn(),
    initialized: true,
    navigationDirection: direction,
    onSwiped: vi.fn(),
    pendingView: { slideIndex: index, stepIndex: 0 },
    regressSlide: vi.fn(),
    slideCount: 2,
    stepBackward: vi.fn(),
    stepForward: vi.fn(),
    transition: preset,
  };
}

function Lifecycle({ label }: { label: string }) {
  const slide = useSlide();
  return <output data-lifecycle={label}>{JSON.stringify(slide)}</output>;
}

async function renderSlides(value: Context, override?: SlideTransition) {
  await act(() => {
    root.render(
      <DeckContext.Provider value={value}>
        <Slide id={0}>
          <p data-label="first">First</p>
          <Lifecycle label="first" />
        </Slide>
        <Slide id={1} transition={override}>
          <p data-label="second">Second</p>
          <Lifecycle label="second" />
        </Slide>
      </DeckContext.Provider>,
    );
  });
}

function frame(label: string) {
  return container.querySelector(`[data-label="${label}"]`)!.closest<HTMLElement>('[aria-hidden]')!;
}

function lifecycle(label: string) {
  return JSON.parse(container.querySelector(`[data-lifecycle="${label}"]`)!.textContent!);
}

test('useSlide reports active, entering, exiting, and settled states', async () => {
  await renderSlides(context(0));
  expect(lifecycle('first')).toEqual({
    direction: 1,
    isActive: true,
    isEntering: false,
    isExiting: false,
    slideIndex: 0,
  });
  expect(lifecycle('second')).toMatchObject({
    isActive: false,
    isEntering: false,
    isExiting: false,
    slideIndex: 1,
  });

  await renderSlides(context(1));
  expect(lifecycle('first')).toMatchObject({ isActive: false, isExiting: true });
  expect(lifecycle('second')).toMatchObject({ isActive: true, isEntering: true });
  await finish(0);
  await finish(1);
  expect(lifecycle('first')).toMatchObject({ isActive: false, isExiting: false });
  expect(lifecycle('second')).toMatchObject({ isActive: true, isEntering: false });

  await renderSlides(context(0, -1));
  expect(lifecycle('first')).toMatchObject({ direction: -1, isActive: true, isEntering: true });
  expect(lifecycle('second')).toMatchObject({ direction: -1, isActive: false, isExiting: true });
});

test('useSlide settles both phases when reduced motion is enabled during entry', async () => {
  await renderSlides(context(0));
  await renderSlides(context(1));
  await act(() => {
    reducedMotion = true;
    media.dispatchEvent(new Event('change'));
  });
  expect(lifecycle('first')).toMatchObject({ isEntering: false, isExiting: false });
  expect(lifecycle('second')).toMatchObject({ isEntering: false, isExiting: false });
});

test('useSlide reports a useful error outside a slide', () => {
  expect(() => renderToString(<Lifecycle label="outside" />)).toThrow(
    'remdx: useSlide() must be called inside a <Slide>.',
  );
});

test.each([1, -1])('Slide layers and hides outgoing content in direction %s', async (direction) => {
  const start = direction > 0 ? 0 : 1;
  await renderSlides(context(start, direction));
  await renderSlides(context(1 - start, direction));
  const outgoing = frame(start === 0 ? 'first' : 'second');
  const incoming = frame(start === 0 ? 'second' : 'first');
  expect(outgoing.style.display).toBe('block');
  expect(outgoing.getAttribute('aria-hidden')).toBe('true');
  expect(outgoing.hasAttribute('inert')).toBe(true);
  expect(outgoing.style.zIndex).toBe('1');
  expect(incoming.style.zIndex).toBe('2');
  expect(incoming.getAttribute('aria-hidden')).toBe('false');
  const exitIndex = animate.mock.contexts.indexOf(outgoing);
  await finish(exitIndex);
  expect(outgoing.style.display).toBe('none');
  expect(incoming.style.display).toBe('block');
});

test('a slide override replaces the deck transition completely', async () => {
  await renderSlides(context(0), Transitions.none);
  await renderSlides(context(1), Transitions.none);
  expect(animate).toHaveBeenCalledOnce();
  expect(animate.mock.contexts[0]).toBe(frame('first'));
});

test('leaveOnly reveals the incoming slide beneath the departing slide', async () => {
  await renderSlides(context(0, 1, Transitions.leaveOnly));
  await renderSlides(context(1, 1, Transitions.leaveOnly));
  expect(animate).toHaveBeenCalledOnce();
  expect(frame('first').style.zIndex).toBe('1');
  expect(frame('second').style.zIndex).toBe('0');
});

test('none changes slides without retaining an outgoing frame', async () => {
  await renderSlides(context(0, 1, Transitions.none));
  await renderSlides(context(1, 1, Transitions.none));
  expect(animate).not.toHaveBeenCalled();
  expect(frame('first').style.display).toBe('none');
  expect(frame('second').style.display).toBe('block');
});

test('default preset reverses both entrance and exit', async () => {
  await renderSlides(context(1, -1, defaultTransition));
  await renderSlides(context(0, -1, defaultTransition));
  expect(animate.mock.calls.map(([keyframes]) => keyframes)).toEqual([
    [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0%)' }],
    [{ transform: 'translateX(0%)' }, { transform: 'translateX(100%)' }],
  ]);
});

test.each([
  [0, -1],
  [5, 1],
  [2, 0],
])('history jump to %s derives direction %s', (index, direction) => {
  const state: DeckState = {
    activeView: { slideIndex: 2, stepIndex: 0 },
    initialized: true,
    navigationDirection: direction === 1 ? -1 : 1,
    pendingView: { slideIndex: 2, stepIndex: 0 },
  };
  expect(
    deckReducer(state, { payload: { slideIndex: index }, type: 'SKIP_TO' }).navigationDirection,
  ).toBe(direction);
});
