import { CSSProperties, ReactNode, Suspense, useContext, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { SlideContainer, SlideTransition } from '../types.tsx';
import { DeckContext } from './deck.tsx';
import { GOTO_FINAL_STEP } from './hooks/use-deck-state.tsx';
import useSlideTransition from './hooks/use-slide-transition.tsx';

const FallbackContainer = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={style}>{children}</div>
);

export default function Slide({
  children,
  className,
  container: Container = FallbackContainer,
  id,
  image,
  padding = 48,
  style,
  transition: slideTransition,
}: {
  children: ReactNode;
  className?: string;
  container?: SlideContainer;
  id: number;
  image?: string;
  padding?: string | number;
  style?: CSSProperties;
  transition?: SlideTransition;
}) {
  const {
    activeView,
    advanceSlide,
    cancelTransition,
    commitTransition,
    initialized,
    navigationDirection,
    onSwiped,
    pendingView,
    regressSlide,
    slideCount,
    transition,
  } = useContext(DeckContext);

  const resolvedTransition = slideTransition ?? transition;
  const isActive = activeView.slideIndex === id;
  const [animationRef, isExiting] = useSlideTransition(
    isActive,
    initialized,
    navigationDirection,
    resolvedTransition,
  );
  const isPending = pendingView.slideIndex === id;

  const willEnter = !isActive && isPending;
  const willExit = isActive && !isPending;
  const slideWillChange = activeView.slideIndex !== pendingView.slideIndex;
  const stepWillChange = activeView.stepIndex !== pendingView.stepIndex;

  useEffect(() => {
    if (!isActive || !stepWillChange || slideWillChange) {
      return;
    }

    if (pendingView.stepIndex < 0) {
      regressSlide();
    } else if (pendingView.stepIndex > 0) {
      advanceSlide();
    } else if (pendingView.stepIndex === GOTO_FINAL_STEP) {
      commitTransition({
        stepIndex: 0,
      });
    } else {
      commitTransition();
    }
  }, [
    advanceSlide,
    commitTransition,
    isActive,
    pendingView,
    regressSlide,
    slideWillChange,
    stepWillChange,
  ]);

  useEffect(() => {
    if (!willExit) {
      return;
    }
    if (pendingView.slideIndex === undefined || pendingView.slideIndex > slideCount - 1) {
      cancelTransition();
    }
  }, [cancelTransition, pendingView, willExit, slideCount]);

  useEffect(() => {
    if (!willEnter) {
      return;
    }

    if (pendingView.stepIndex === GOTO_FINAL_STEP) {
      commitTransition({
        stepIndex: 0,
      });
    } else {
      commitTransition();
    }
  }, [commitTransition, pendingView, willEnter]);

  const swipeHandler = useSwipeable({
    onSwiped: (eventData) => onSwiped(eventData),
  });

  return (
    <div
      aria-hidden={!isActive}
      inert={!isActive}
      ref={animationRef}
      style={{
        background: 'transparent',
        display: isActive || isExiting ? 'block' : 'none',
        height: '100%',
        pointerEvents: isActive ? undefined : 'none',
        position: 'absolute',
        width: '100%',
        zIndex: isActive ? (resolvedTransition.enter ? 2 : 0) : isExiting ? 1 : 0,
      }}
    >
      <div
        className={className}
        style={{
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          zIndex: '0',
          ...style,
          ...(image ? { backgroundImage: `url('${image}')` } : null),
        }}
        {...swipeHandler}
      >
        <Container
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding,
          }}
        >
          <Suspense>{children}</Suspense>
        </Container>
      </div>
    </div>
  );
}
