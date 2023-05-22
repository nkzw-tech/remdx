import { useMemo, useReducer } from 'react';

export const GOTO_FINAL_STEP = null as unknown as number;

export type DeckView = {
  slideIndex: number;
  stepIndex: number;
};
export type DeckState = {
  activeView: DeckView;
  initialized: boolean;
  navigationDirection: number;
  pendingView: DeckView;
};

const initialDeckState: DeckState = {
  activeView: {
    slideIndex: 0,
    stepIndex: 0,
  },
  initialized: false,
  navigationDirection: 0,
  pendingView: {
    slideIndex: 0,
    stepIndex: 0,
  },
};

type ReducerActions =
  | { payload: Partial<DeckView>; type: 'INITIALIZE_TO' }
  | { payload: Partial<DeckView>; type: 'SKIP_TO' }
  | { payload?: undefined; type: 'STEP_FORWARD' }
  | { payload?: undefined; type: 'STEP_BACKWARD' }
  | { payload?: undefined; type: 'ADVANCE_SLIDE' }
  | { payload?: Pick<DeckView, 'stepIndex'>; type: 'REGRESS_SLIDE' }
  | { payload?: DeckView; type: 'COMMIT_TRANSITION' }
  | { payload?: undefined; type: 'CANCEL_TRANSITION' };

function deckReducer(state: DeckState, { type, payload = {} }: ReducerActions) {
  switch (type) {
    case 'INITIALIZE_TO':
      return {
        activeView: { ...state.activeView, ...payload },
        initialized: true,
        navigationDirection: 0,
        pendingView: { ...state.pendingView, ...payload },
      };
    case 'SKIP_TO':
      return {
        ...state,
        pendingView: { ...state.pendingView, ...payload },
      };
    case 'STEP_FORWARD':
      return {
        ...state,
        navigationDirection: 1,
        pendingView: {
          ...state.pendingView,
          stepIndex: state.pendingView.stepIndex + 1,
        },
      };
    case 'STEP_BACKWARD':
      return {
        ...state,
        navigationDirection: -1,
        pendingView: {
          ...state.pendingView,
          stepIndex: state.pendingView.stepIndex - 1,
        },
      };
    case 'ADVANCE_SLIDE':
      return {
        ...state,
        navigationDirection: 1,
        pendingView: {
          ...state.pendingView,
          slideIndex: state.pendingView.slideIndex + 1,
          stepIndex: 0,
        },
      };
    case 'REGRESS_SLIDE':
      return {
        ...state,
        navigationDirection: -1,
        pendingView: {
          ...state.pendingView,
          slideIndex: Math.max(0, state.pendingView.slideIndex - 1),
          stepIndex: payload?.stepIndex ?? GOTO_FINAL_STEP,
        },
      };
    case 'COMMIT_TRANSITION': {
      const pendingView = { ...state.pendingView, ...payload };
      return {
        ...state,
        activeView: { ...state.activeView, ...pendingView },
        pendingView,
      };
    }
    case 'CANCEL_TRANSITION':
      return {
        ...state,
        pendingView: { ...state.pendingView, ...state.activeView },
      };
    default:
      return state;
  }
}

export default function useDeckState() {
  const [
    { initialized, navigationDirection, pendingView, activeView },
    dispatch,
  ] = useReducer(deckReducer, initialDeckState);

  return {
    activeView,
    initialized,
    navigationDirection,
    pendingView,
    ...useMemo(
      () => ({
        advanceSlide: () => dispatch({ type: 'ADVANCE_SLIDE' }),
        cancelTransition: () => dispatch({ type: 'CANCEL_TRANSITION' }),
        commitTransition: (payload?: DeckView) =>
          dispatch({ payload, type: 'COMMIT_TRANSITION' }),
        initializeTo: (payload: Partial<DeckView>) =>
          dispatch({ payload, type: 'INITIALIZE_TO' }),
        regressSlide: (payload?: Pick<DeckView, 'stepIndex'>) =>
          dispatch({ payload, type: 'REGRESS_SLIDE' }),
        skipTo: (payload: Partial<DeckView>) =>
          dispatch({ payload, type: 'SKIP_TO' }),
        stepBackward: () => dispatch({ type: 'STEP_BACKWARD' }),
        stepForward: () => dispatch({ type: 'STEP_FORWARD' }),
      }),
      [dispatch],
    ),
  };
}
