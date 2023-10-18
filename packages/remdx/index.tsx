export type {
  ReMDXSlide,
  Themes,
  MDXComponents as ComponentList,
} from './types.tsx';

export { default as Deck } from './src/deck.tsx';
export { default as render } from './src/render.tsx';
export { default as Slide } from './src/slide.tsx';
export { default as slidesToComponent } from './src/slidesToComponent.tsx';
export { useMDXComponents } from '@mdx-js/react';
