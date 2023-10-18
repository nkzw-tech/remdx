import { MDXProvider } from '@mdx-js/react';
import { CSSProperties } from 'react';
import { SlideTransition } from './src/deck.tsx';

type MDXProps = typeof MDXProvider extends React.FC<infer Props>
  ? Props
  : never;

export type MDXComponents = MDXProps['components'];
export type Themes = Record<string, CSSProperties>;

export type ReMDXSlide = {
  Component: () => JSX.Element;
  data: Record<string, string>;
};

export type ReMDXModule = {
  Components?: MDXComponents;
  Themes?: Themes;
  Transitions?: Record<string, SlideTransition>;
  default: ReadonlyArray<ReMDXSlide>;
};
