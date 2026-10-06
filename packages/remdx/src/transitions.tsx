import type { SlideAnimation, SlideTransition } from '../types.tsx';

const slideEnter: SlideAnimation = {
  keyframes: {
    back: [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0%)' }],
    forward: [{ transform: 'translateX(100%)' }, { transform: 'translateX(0%)' }],
  },
};

const slideLeave: SlideAnimation = {
  keyframes: {
    back: [{ transform: 'translateX(0%)' }, { transform: 'translateX(100%)' }],
    forward: [{ transform: 'translateX(0%)' }, { transform: 'translateX(-100%)' }],
  },
};

export const defaultTransition: SlideTransition = {
  enter: slideEnter,
  leave: slideLeave,
};

export const Transitions: Record<string, SlideTransition> = {
  default: defaultTransition,
  leaveOnly: { leave: slideLeave },
  none: {},
  opacity: {
    enter: { keyframes: [{ opacity: 0 }, { opacity: 1 }] },
    leave: { keyframes: [{ opacity: 1 }, { opacity: 0 }] },
  },
  transformRight: defaultTransition,
};
