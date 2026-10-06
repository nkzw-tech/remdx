import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { SlideTransition } from '../../types.tsx';

export default function useSlideTransition(
  isActive: boolean,
  initialized: boolean,
  direction: number,
  transition: SlideTransition,
) {
  const ref = useRef<HTMLDivElement>(null);
  const playback = useRef<Animation | null>(null);
  const previous = useRef({ initialized: false, isActive });
  const [phaseState, setPhaseState] = useState<'idle' | 'entering' | 'exiting'>('idle');

  useLayoutEffect(() => {
    const changed = previous.current.isActive !== isActive;
    const shouldAnimate = previous.current.initialized && initialized && changed;
    previous.current = { initialized, isActive };

    // A step or a new transition object must not interrupt the current playback.
    if (!changed) {
      return;
    }

    const interrupted = playback.current;
    playback.current = null;
    interrupted?.cancel();

    const phase = isActive ? transition.enter : transition.leave;
    const element = ref.current;
    if (
      !shouldAnimate ||
      !phase ||
      !element ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      // Visibility must settle before the browser paints the new slide.
      // oxlint-disable-next-line react-hooks-js/set-state-in-effect
      setPhaseState('idle');
      return;
    }

    const keyframes =
      'forward' in phase.keyframes
        ? direction < 0
          ? phase.keyframes.back
          : phase.keyframes.forward
        : phase.keyframes;
    if (keyframes.length === 0) {
      // oxlint-disable-next-line react-hooks-js/set-state-in-effect
      setPhaseState('idle');
      return;
    }

    // Retain the outgoing DOM for playback before the next paint.
    // oxlint-disable-next-line react-hooks-js/set-state-in-effect
    setPhaseState(isActive ? 'entering' : 'exiting');
    const current = element.animate(Array.from(keyframes), {
      duration: 500,
      easing: 'cubic-bezier(0.18, 0.8, 0.18, 1)',
      ...phase.options,
      fill: 'both',
    });
    playback.current = current;

    const finish = () => {
      // An obsolete completion must never hide a newer departing slide.
      if (playback.current !== current) {
        return;
      }
      playback.current = null;
      current.cancel();
      setPhaseState('idle');
    };
    void current.finished.then(finish, finish);
  }, [direction, initialized, isActive, transition]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      if (reducedMotion.matches) {
        const current = playback.current;
        playback.current = null;
        current?.cancel();
        setPhaseState('idle');
      }
    };
    reducedMotion.addEventListener('change', handleChange);
    return () => reducedMotion.removeEventListener('change', handleChange);
  }, []);

  useLayoutEffect(
    () => () => {
      const current = playback.current;
      playback.current = null;
      current?.cancel();
    },
    [],
  );

  return [
    ref,
    !isActive && phaseState === 'exiting',
    isActive && phaseState === 'entering',
  ] as const;
}
