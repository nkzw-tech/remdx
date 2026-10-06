// @vitest-environment happy-dom
import { createMemoryHistory, type MemoryHistory } from 'history';
import { act, type Dispatch, useEffect, useReducer } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, test, vi } from 'vite-plus/test';
import { type DeckView, GOTO_FINAL_STEP } from '../src/hooks/use-deck-state.tsx';
import useLocationSync, {
  mapLocationToState,
  mapStateToLocation,
} from '../src/hooks/use-location-sync.tsx';

test.each([
  ['/slide-1', 0, 0],
  ['/slide-8', 7, 0],
  ['/slide-8/step-2', 7, 2],
  ['/slide-8/step-final', 7, GOTO_FINAL_STEP],
  ['/talk/slide-8/step-2/', 7, 2],
  ['/', 0, 0],
  ['/talk/', 0, 0],
])('reads %s as slide %s, step %s', (pathname, slideIndex, stepIndex) => {
  expect(mapLocationToState({ pathname, search: '' })).toEqual({ slideIndex, stepIndex });
});

test.each([
  [{ slideIndex: 0, stepIndex: 0 }, '/slide-1'],
  [{ slideIndex: 7, stepIndex: 0 }, '/slide-8'],
  [{ slideIndex: 7, stepIndex: 2 }, '/slide-8/step-2'],
  [{ slideIndex: 7, stepIndex: GOTO_FINAL_STEP }, '/slide-8/step-final'],
])('writes %j as %s without query parameters', (state, pathname) => {
  expect(mapStateToLocation(state)).toEqual({ pathname, search: '' });
});

test('reads old query links and gives the path priority', () => {
  expect(mapLocationToState({ pathname: '/', search: '?slideIndex=7&stepIndex=2' })).toEqual({
    slideIndex: 7,
    stepIndex: 2,
  });
  expect(mapLocationToState({ pathname: '/', search: '?slideIndex=7&stepIndex=final' })).toEqual({
    slideIndex: 7,
    stepIndex: GOTO_FINAL_STEP,
  });
  expect(mapLocationToState({ pathname: '/', search: '?slideIndex=7' })).toEqual({
    slideIndex: 7,
    stepIndex: 0,
  });
  expect(mapLocationToState({ pathname: '/slide-2', search: '?slideIndex=7&stepIndex=2' })).toEqual(
    {
      slideIndex: 1,
      stepIndex: 0,
    },
  );
});

test.each([
  '/slide-0',
  '/slide--1',
  '/slide-1.5',
  '/slide-Infinity',
  '/slide-9007199254740992',
  '/slide-2/step-0',
  '/slide-2/step--1',
  '/slide-2/step-nope',
])('rejects invalid route %s', (pathname) => {
  expect(() => mapLocationToState({ pathname, search: '' })).toThrow(/Invalid/);
});

test.each(['?slideIndex=-1', '?slideIndex=1.5', '?slideIndex=', '?slideIndex=1&stepIndex=NaN'])(
  'rejects invalid old query %s',
  (search) => {
    expect(() => mapLocationToState({ pathname: '/', search })).toThrow(/Invalid/);
  },
);

const defaultState: DeckView = { slideIndex: 0, stepIndex: 0 };
let root: Root;
let container: HTMLDivElement;
let updateView: Dispatch<DeckView>;

function Harness({ history }: { history: MemoryHistory }) {
  const [state, setState] = useReducer((_state: DeckView, next: DeckView) => next, defaultState);
  useEffect(() => {
    updateView = setState;
  }, [setState]);
  const [initialize, onActiveStateChange] = useLocationSync({
    historyFactory: () => history,
    setState,
  });
  useEffect(() => setState(initialize(defaultState)), [initialize]);
  useEffect(() => onActiveStateChange(state), [onActiveStateChange, state]);
  return <output>{JSON.stringify(state)}</output>;
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

async function mount(entries: Array<string>) {
  const history = createMemoryHistory({ initialEntries: entries });
  await act(() => root.render(<Harness history={history} />));
  return history;
}

function view() {
  return JSON.parse(container.textContent!) as DeckView;
}

test.each([
  ['/', '/slide-1', { slideIndex: 0, stepIndex: 0 }],
  ['/slide-8/step-2', '/slide-8/step-2', { slideIndex: 7, stepIndex: 2 }],
  ['/?slideIndex=7&stepIndex=2', '/slide-8/step-2', { slideIndex: 7, stepIndex: 2 }],
  ['/talk/', '/talk/slide-1', { slideIndex: 0, stepIndex: 0 }],
  ['/talk/slide-8/', '/talk/slide-8', { slideIndex: 7, stepIndex: 0 }],
  ['/talk?slideIndex=7', '/talk/slide-8', { slideIndex: 7, stepIndex: 0 }],
] as const)('initializes %s without adding a history entry', async (entry, pathname, state) => {
  const history = await mount([entry]);
  expect(view()).toEqual(state);
  expect(history.location.pathname).toBe(pathname);
  expect(history.location.search).toBe('');
  expect(history.index).toBe(0);
});

test('navigation, steps, and browser history stay in sync without duplicate entries', async () => {
  const history = await mount(['/talk/slide-1']);
  await act(() => updateView({ slideIndex: 2, stepIndex: 0 }));
  expect(history.location.pathname).toBe('/talk/slide-3');
  await act(() => updateView({ slideIndex: 2, stepIndex: 2 }));
  expect(history.location.pathname).toBe('/talk/slide-3/step-2');
  expect(history.index).toBe(2);
  await act(() => updateView({ slideIndex: 2, stepIndex: 2 }));
  expect(history.index).toBe(2);
  await act(() => history.back());
  expect(view()).toEqual({ slideIndex: 2, stepIndex: 0 });
  expect(history.index).toBe(1);
  await act(() => history.back());
  expect(view()).toEqual({ slideIndex: 0, stepIndex: 0 });
  expect(history.index).toBe(0);
  await act(() => history.forward());
  await act(() => history.forward());
  expect(view()).toEqual({ slideIndex: 2, stepIndex: 2 });
  expect(history.index).toBe(2);
});

test('returning to the deck root resets the slide and step', async () => {
  const history = await mount(['/talk/', '/talk/slide-3/step-2']);
  await act(() => history.back());
  expect(view()).toEqual({ slideIndex: 0, stepIndex: 0 });
  expect(history.location.pathname).toBe('/talk/slide-1');
  expect(history.index).toBe(0);
  await act(() => history.forward());
  expect(view()).toEqual({ slideIndex: 2, stepIndex: 2 });
});

test('old links reached through history are replaced rather than pushed', async () => {
  const history = await mount(['/?slideIndex=1&stepIndex=2', '/slide-5']);
  await act(() => history.back());
  expect(view()).toEqual({ slideIndex: 1, stepIndex: 2 });
  expect(history.location.pathname).toBe('/slide-2/step-2');
  expect(history.location.search).toBe('');
  expect(history.index).toBe(0);
  await act(() => history.forward());
  expect(view()).toEqual({ slideIndex: 4, stepIndex: 0 });
});
