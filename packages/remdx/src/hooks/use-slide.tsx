import { createContext, useContext } from 'react';

export type SlideState = Readonly<{
  direction: number;
  isActive: boolean;
  isEntering: boolean;
  isExiting: boolean;
  slideIndex: number;
}>;

export const SlideContext = createContext<SlideState | null>(null);

export default function useSlide(): SlideState {
  const slide = useContext(SlideContext);
  if (!slide) {
    throw new Error('remdx: useSlide() must be called inside a <Slide>.');
  }
  return slide;
}
