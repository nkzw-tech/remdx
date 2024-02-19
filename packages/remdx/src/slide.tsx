import {
  CSSProperties,
  ReactNode,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { animated, useSpring } from 'react-spring';
import { useSwipeable } from 'react-swipeable';
import { SlideContainer, SlideTransition } from '../types.tsx';
import { DeckContext } from './deck.tsx';
import { GOTO_FINAL_STEP } from './hooks/use-deck-state.tsx';
import { Transitions } from './transitions.tsx';

export default function Slide({
  children,
  className,
  container: Container = ({ children, style }) => (
    <div style={style}>{children}</div>
  ),
  id,
  image,
  padding = 48,
  style,
  transition: slideTransition = {},
}: {
  children: ReactNode;
  className?: string;
  container?: SlideContainer;
  id: number;
  image?: string;
  padding?: string | number;
  style?: CSSProperties;
  transition?: SlideTransition;
}): JSX.Element {
  const {
    activeView,
    advanceSlide,
    cancelTransition,
    commitTransition,
    navigationDirection,
    onSwiped,
    pendingView,
    regressSlide,
    slideCount,
    transition,
  } = useContext(DeckContext);

  const mergedTransition = useMemo(() => {
    if (slideTransition === Transitions.none) {
      return slideTransition;
    }
    const result = { ...transition };
    if ('from' in slideTransition) {
      result.from = slideTransition.from;
    }
    if ('enter' in slideTransition) {
      result.enter = slideTransition.enter;
    }
    if ('leave' in slideTransition) {
      result.leave = slideTransition.leave;
    }
    return result;
  }, [slideTransition, transition]);

  const isActive = activeView.slideIndex === id;
  const isPending = pendingView.slideIndex === id;
  const slideIndex = id;
  const [isPassed, isUpcoming] = (() => {
    if (slideCount === 1) {
      return [false, false];
    }
    if (slideCount === 2) {
      return slideIndex === activeView.slideIndex
        ? [false, false]
        : slideIndex === 0
          ? [true, false]
          : [false, true];
    }

    const isWrappingForward =
      slideIndex === slideCount - 1 && activeView.slideIndex === 0;
    const isWrappingReverse =
      slideIndex === 0 && activeView.slideIndex === slideCount - 1;
    const isWrapping = isWrappingForward || isWrappingReverse;
    const isPassed =
      (!isWrapping && slideIndex < activeView.slideIndex) || isWrappingForward;
    const isUpcoming =
      (!isWrapping && slideIndex > activeView.slideIndex) || isWrappingReverse;
    return [isPassed, isUpcoming];
  })();

  const willEnter = !isActive && isPending;
  const willExit = isActive && !isPending;
  const slideWillChange = activeView.slideIndex !== pendingView.slideIndex;
  const stepWillChange = activeView.stepIndex !== pendingView.stepIndex;
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!isActive || !stepWillChange || slideWillChange) {
      return;
    }

    if (pendingView.stepIndex < 0) {
      setAnimate(false);
      regressSlide();
    } else if (pendingView.stepIndex > 0) {
      setAnimate(true);
      advanceSlide();
    } else if (pendingView.stepIndex === GOTO_FINAL_STEP) {
      setAnimate(false);
      commitTransition({
        stepIndex: 0,
      });
    } else {
      setAnimate(navigationDirection > 0);
      commitTransition();
    }
  }, [
    advanceSlide,
    commitTransition,
    navigationDirection,
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
    if (
      pendingView.slideIndex === undefined ||
      pendingView.slideIndex > slideCount - 1
    ) {
      cancelTransition();
    } else {
      setAnimate(navigationDirection > 0);
    }
  }, [
    cancelTransition,
    pendingView,
    navigationDirection,
    willExit,
    slideCount,
  ]);

  useEffect(() => {
    if (!willEnter) {
      return;
    }

    if (pendingView.stepIndex === GOTO_FINAL_STEP) {
      setAnimate(false);
      commitTransition({
        stepIndex: 0,
      });
    } else {
      const isSingleForwardStep = navigationDirection > 0;
      setAnimate(isSingleForwardStep);
      commitTransition();
    }
  }, [
    activeView,
    commitTransition,
    navigationDirection,
    pendingView,
    willEnter,
  ]);

  const target = useMemo(() => {
    if (isPassed) {
      return [mergedTransition.leave, { display: 'none' }];
    }
    if (isActive) {
      return {
        ...mergedTransition.enter,
        display: 'unset',
      };
    }
    if (isUpcoming) {
      return {
        ...mergedTransition.from,
        display: 'none',
      };
    }
    return {
      display: 'none',
    };
  }, [isPassed, isActive, isUpcoming, mergedTransition]);

  const immediate = !animate;
  const springFrameStyle = useSpring({
    immediate,
    to: target,
  });
  const swipeHandler = useSwipeable({
    onSwiped: (eventData) => onSwiped(eventData),
  });

  return (
    <animated.div
      style={{
        background: 'transparent',
        height: '100%',
        position: 'absolute',
        width: '100%',
        ...springFrameStyle,
        ...(isActive && { display: 'unset' }),
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
    </animated.div>
  );
}
