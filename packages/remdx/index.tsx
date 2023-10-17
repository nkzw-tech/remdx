export type {
  ReMDXSlide,
  Themes,
  MDXComponents as ComponentList,
} from './types';

export { default as Deck } from './src/deck';
export { default as render } from './src/render';
export { default as Slide } from './src/slide';
export { default as slidesToComponent } from './src/slidesToComponent';
export { useMDXComponents } from '@mdx-js/react';
