import { createBrowserHistory, Location } from 'history';
import { useCallback, useEffect, useState } from 'react';
import { DeckView, GOTO_FINAL_STEP } from './use-deck-state.tsx';

export type SlideState = {
  slideIndex?: number;
  stepIndex?: number | typeof GOTO_FINAL_STEP;
};

const slidePath = /^(.*)\/slide-([^/]+)(?:\/step-([^/]+))?\/?$/;

function parseIndex(value: string, minimum: number, label: string): number {
  const index = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(index) || index < minimum) {
    throw new Error(`Invalid ${label}: '${value}'`);
  }
  return index;
}

function getBasePath(pathname: string): string {
  return (slidePath.exec(pathname)?.[1] ?? pathname).replace(/\/+$/, '');
}

export function mapLocationToState(location: Pick<Location, 'pathname' | 'search'>): DeckView {
  const { pathname, search } = location;
  const route = slidePath.exec(pathname);
  if (route) {
    const [, , slide, step] = route;
    return {
      slideIndex: parseIndex(slide, 1, 'slide number in URL path') - 1,
      stepIndex:
        step === 'final'
          ? GOTO_FINAL_STEP
          : step === undefined
            ? 0
            : parseIndex(step, 1, 'step number in URL path'),
    };
  }

  // Read old links, but always write the canonical path below.
  const { slideIndex: rawSlideIndex, stepIndex: rawStepIndex } = Object.fromEntries(
    new URLSearchParams(search),
  );
  if (rawSlideIndex === undefined) {
    return { slideIndex: 0, stepIndex: 0 };
  }
  return {
    slideIndex: parseIndex(rawSlideIndex, 0, 'slide index in URL query string'),
    stepIndex:
      rawStepIndex === 'final'
        ? GOTO_FINAL_STEP
        : rawStepIndex === undefined
          ? 0
          : parseIndex(rawStepIndex, 0, 'step index in URL query string'),
  };
}

export function mapStateToLocation(state: SlideState, basePath = '') {
  const { slideIndex, stepIndex } = state;
  if (typeof slideIndex !== 'number') {
    return {};
  }
  const slide = parseIndex(String(slideIndex), 0, 'slide index');
  const step =
    stepIndex === GOTO_FINAL_STEP
      ? '/step-final'
      : typeof stepIndex === 'number' && stepIndex !== 0
        ? `/step-${parseIndex(String(stepIndex), 1, 'step index')}`
        : '';
  return {
    pathname: `${basePath.replace(/\/+$/, '')}/slide-${slide + 1}${step}`,
    search: '',
  };
}

type LocationStateOptions = {
  historyFactory?: typeof createBrowserHistory;
  setState(state: DeckView): void;
  slideCount?: number;
};

export default function useLocationSync({
  historyFactory = createBrowserHistory,
  setState,
  slideCount = Infinity,
}: LocationStateOptions) {
  const [history] = useState(() => (typeof document !== 'undefined' ? historyFactory() : null));
  const [basePath] = useState(() => getBasePath(history?.location.pathname ?? '/'));
  const [initialized, setInitialized] = useState(false);
  const normalizeState = useCallback(
    (state: DeckView): DeckView => ({
      ...state,
      slideIndex: Math.min(state.slideIndex, Math.max(0, slideCount - 1)),
    }),
    [slideCount],
  );

  useEffect(() => {
    return initialized
      ? history?.listen(({ action, location }) => {
          if (action !== 'POP') {
            return;
          }
          const state = normalizeState(mapLocationToState(location));
          const canonical = mapStateToLocation(state, basePath);
          if (location.pathname !== canonical.pathname || location.search !== canonical.search) {
            history.replace(canonical);
          }
          setState(state);
        })
      : undefined;
  }, [basePath, initialized, history, normalizeState, setState]);

  return [
    useCallback(
      (defaultState: DeckView): DeckView => {
        if (!history) {
          return defaultState;
        }

        const { location } = history;
        const initialState = normalizeState({
          ...defaultState,
          ...mapLocationToState(location),
        });
        history.replace(mapStateToLocation(initialState, basePath));
        setInitialized(true);
        return initialState;
      },
      [basePath, history, normalizeState],
    ),
    useCallback(
      (state: SlideState) => {
        if (!initialized || !history) {
          return;
        }

        const { location } = history;
        const nextLocation = mapStateToLocation(
          {
            ...mapLocationToState(location),
            ...state,
          },
          basePath,
        );
        if (
          location.pathname !== nextLocation.pathname ||
          location.search !== nextLocation.search
        ) {
          history.push(nextLocation);
        }
      },
      [basePath, history, initialized],
    ),
  ] as const;
}
