import { SlideTransition } from '../types.tsx';

export const defaultTransition: SlideTransition = {
  enter: {
    opacity: 1,
    transform: 'translateX(0%)',
  },
  from: {
    opacity: 0,
    transform: 'translateX(100%)',
  },
  leave: {
    opacity: 1,
    transform: 'translateX(-100%)',
  },
};

export const Transitions: Record<string, SlideTransition> = {
  default: defaultTransition,
  leaveOnly: {
    enter: {
      transform: 'translateX(0%)',
    },
    from: {},
    leave: {
      transform: 'translateX(-100%)',
    },
  },
  none: {
    enter: {},
    from: {},
    leave: {},
  },
  opacity: {
    enter: {
      opacity: 1,
    },
    from: {
      opacity: 0,
    },
    leave: {
      opacity: 1,
    },
  },
  transformRight: {
    enter: {
      transform: 'translateX(0%)',
    },
    from: {
      transform: 'translateX(100%)',
    },
    leave: {
      transform: 'translateX(-100%)',
    },
  },
};
