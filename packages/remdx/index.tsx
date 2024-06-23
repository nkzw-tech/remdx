export type {
  MDXComponents as ComponentList,
  ReMDXSlide,
  Themes,
} from './types.tsx';

export { default as Deck } from './src/deck.tsx';
export { default as render } from './src/render.tsx';
export { default as Slide } from './src/slide.tsx';
export { default as slidesToComponent } from './src/slidesToComponent.tsx';
export { defaultTransition, Transitions } from './src/transitions.tsx';
export { MDXProvider, useMDXComponents } from '@mdx-js/react';
