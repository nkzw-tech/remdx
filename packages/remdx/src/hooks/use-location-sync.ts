import { createBrowserHistory, Location } from 'history';
import { useCallback, useEffect, useState } from 'react';
import { DeckView, GOTO_FINAL_STEP } from '../hooks/use-deck-state';

export type SlideState = {
  slideIndex?: number;
  stepIndex?: number | typeof GOTO_FINAL_STEP;
};

export function mapLocationToState(
  location: Pick<Location, 'search'>,
): SlideState {
  const { search } = location;
  const { slideIndex: rawSlideIndex, stepIndex: rawStepIndex } =
    Object.fromEntries(new URLSearchParams(search));

  const nextState: SlideState = {};
  if (rawSlideIndex === undefined) {
    return nextState;
  }

  nextState.slideIndex = Number(rawSlideIndex);
  if (Number.isNaN(nextState.slideIndex)) {
    throw new Error(`Invalid slide index in URL query string: '${search}'`);
  }

  if (rawStepIndex === 'final') {
    nextState.stepIndex = GOTO_FINAL_STEP;
  } else if (rawStepIndex !== undefined) {
    nextState.stepIndex = Number(rawStepIndex);
    if (Number.isNaN(nextState.stepIndex)) {
      throw new Error(`Invalid step index in URL query string: '${search}'`);
    }
  }

  return nextState;
}

export function mapStateToLocation(state: SlideState) {
  const { slideIndex, stepIndex } = state;
  const query: Record<string, string> = {};
  if (typeof slideIndex !== 'number') {
    return {};
  }

  query.slideIndex = String(slideIndex);
  if (typeof stepIndex === 'number') {
    query.stepIndex = String(stepIndex);
  } else if (stepIndex === GOTO_FINAL_STEP) {
    query.stepIndex = 'final';
  }
  return {
    search: '?' + new URLSearchParams(query).toString(),
  };
}

type LocationStateOptions = {
  historyFactory?: typeof createBrowserHistory;
  setState(state: Partial<DeckView>): void;
};

export default function useLocationSync({
  historyFactory = createBrowserHistory,
  setState,
}: LocationStateOptions) {
  const [history] = useState(() =>
    typeof document !== 'undefined' ? historyFactory() : null,
  );
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    return initialized
      ? history?.listen(({ location }) => {
          setState(mapLocationToState(location));
        })
      : undefined;
  }, [initialized, history, setState]);

  return [
    useCallback(
      (defaultState: DeckView): DeckView => {
        if (!history) {
          return defaultState;
        }

        const { location } = history;
        const initialState: DeckView = {
          ...defaultState,
          ...mapLocationToState(location),
        };
        history.replace(mapStateToLocation(initialState));
        setInitialized(true);
        return initialState;
      },
      [history],
    ),
    useCallback(
      (state: SlideState) => {
        if (!initialized || !history) {
          return;
        }

        const { location } = history;
        const nextLocation = mapStateToLocation({
          ...mapLocationToState(location),
          ...state,
        });
        if (location.search != nextLocation.search) {
          history.push(nextLocation);
        }
      },
      [history, initialized],
    ),
  ] as const;
}
