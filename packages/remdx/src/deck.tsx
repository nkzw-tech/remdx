import { createContext, CSSProperties, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { SwipeEventData } from 'react-swipeable';
import { SlideTransition } from '../types.tsx';
import useAspectRatioFitting from './hooks/use-aspect-ratio-fitting.tsx';
import useDeckState from './hooks/use-deck-state.tsx';
import useLocationSync from './hooks/use-location-sync.tsx';
import usePresentationControls from './hooks/use-presentation-controls.tsx';
import { defaultTransition } from './transitions.tsx';

type DeckContextType = {
  activeView: {
    slideIndex: number;
    stepIndex: number;
  };
  advanceSlide(): void;
  cancelTransition(): void;
  commitTransition(newView?: { stepIndex: number }): void;
  goToSlide(slideIndex: number): void;
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
    initialized,
    initializeTo,
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

  const goToSlide = useCallback(
    (slideIndex: number) => {
      if (!Number.isSafeInteger(slideIndex)) {
        throw new TypeError('remdx: goToSlide() expects a safe integer slide index.');
      }
      skipTo({
        slideIndex: Math.max(0, Math.min(slideIndex, slides.length - 1)),
        stepIndex: 0,
      });
    },
    [skipTo, slides.length],
  );

  usePresentationControls(
    useMemo(
      () => ({
        firstSlide: () => goToSlide(0),
        lastSlide: () => goToSlide(slides.length - 1),
        nextSlide: stepForward,
        previousSlide: stepBackward,
      }),
      [goToSlide, slides.length, stepForward, stepBackward],
    ),
  );

  const [syncLocation, onActiveStateChange] = useLocationSync({
    // Slides currently have no built-in reveal steps. Normalize old step links
    // before committing them so navigation always starts from a valid state.
    maxStepIndex: 0,
    setState: skipTo,
    slideCount: slides.length,
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

  const value = useMemo(
    () => ({
      activeView,
      advanceSlide,
      cancelTransition,
      commitTransition,
      goToSlide,
      initialized,
      navigationDirection,
      onSwiped,
      pendingView,
      regressSlide,
      slideCount: slides.length,
      stepBackward,
      stepForward,
      transition,
    }),
    [
      activeView,
      advanceSlide,
      cancelTransition,
      commitTransition,
      goToSlide,
      initialized,
      navigationDirection,
      onSwiped,
      pendingView,
      regressSlide,
      slides.length,
      stepBackward,
      stepForward,
      transition,
    ],
  );

  return (
    <div
      className={className}
      ref={backdropRef}
      style={{
        ..._backdropStyle,
        ...backdropStyle,
      }}
    >
      <DeckContext.Provider value={value}>
        <div style={{ ...fitAspectRatioStyle, ...style }}>{slides}</div>
      </DeckContext.Provider>
    </div>
  );
}
