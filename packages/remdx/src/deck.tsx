import {
  createContext,
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { SwipeEventData } from 'react-swipeable';
import useAspectRatioFitting from './hooks/use-aspect-ratio-fitting.tsx';
import useDeckState from './hooks/use-deck-state.tsx';
import useLocationSync from './hooks/use-location-sync.tsx';
import useMousetrap from './hooks/use-mousetrap.tsx';
import { defaultTransition } from './transitions.tsx';

export type SlideTransition = {
  enter?: CSSProperties;
  from?: CSSProperties;
  leave?: CSSProperties;
};

type DeckContextType = {
  activeView: {
    slideIndex: number;
    stepIndex: number;
  };
  advanceSlide(): void;
  cancelTransition(): void;
  commitTransition(newView?: { stepIndex: number }): void;
  initialized: boolean;
  navigationDirection: number;
  onSwiped(eventData: SwipeEventData): void;
  pendingView: {
    slideIndex: number;
    stepIndex: number;
  };
  regressSlide(): void;
  slideCount: number;
  stepBackward(): void;
  stepForward(): void;
  transition: SlideTransition;
};

export const DeckContext = createContext<DeckContextType>(null!);

const _backdropStyle: CSSProperties = {
  backgroundColor: 'black',
  height: '100vh',
  left: 0,
  overflow: 'hidden',
  position: 'fixed',
  top: 0,
  width: '100vw',
};

export default function Deck({
  aspectRatio = 16 / 9,
  backdropStyle,
  className,
  slides,
  style,
  transition = defaultTransition,
}: {
  aspectRatio?: number;
  backdropStyle?: CSSProperties;
  className?: string;
  slides: ReadonlyArray<ReactNode>;
  style?: CSSProperties;
  transition?: SlideTransition;
}) {
  const {
    activeView,
    advanceSlide,
    cancelTransition,
    commitTransition,
    initializeTo,
    initialized,
    navigationDirection,
    pendingView,
    regressSlide,
    skipTo,
    stepBackward,
    stepForward,
  } = useDeckState();

  const [backdropRef, fitAspectRatioStyle] = useAspectRatioFitting(aspectRatio);

  const onSwiped = useCallback(
    (event: SwipeEventData) => {
      if (navigator.maxTouchPoints >= 1) {
        if (event.dir === 'Left') {
          stepForward();
        } else if (event.dir === 'Right') {
          regressSlide();
        }
      }
    },
    [regressSlide, stepForward],
  );

  useMousetrap(
    {
      left: () => stepBackward(),
      right: () => stepForward(),
    },
    [stepForward, stepBackward],
  );

  const [syncLocation, onActiveStateChange] = useLocationSync({
    setState: skipTo,
  });

  useEffect(() => {
    if (!initialized) {
      return;
    }
    onActiveStateChange(activeView);
  }, [initialized, activeView, onActiveStateChange]);

  useEffect(() => {
    initializeTo(
      syncLocation({
        slideIndex: 0,
        stepIndex: 0,
      }),
    );
  }, [initializeTo, syncLocation]);

  return (
    <div
      className={className}
      ref={backdropRef}
      style={{
        ..._backdropStyle,
        ...backdropStyle,
      }}
    >
      <DeckContext.Provider
        value={{
          activeView,
          advanceSlide,
          cancelTransition,
          commitTransition,
          initialized,
          navigationDirection,
          onSwiped,
          pendingView,
          regressSlide,
          slideCount: slides.length,
          stepBackward,
          stepForward,
          transition,
        }}
      >
        <div style={{ ...fitAspectRatioStyle, ...style }}>{slides}</div>
      </DeckContext.Provider>
    </div>
  );
}
