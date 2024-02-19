import type { MDXComponents as _MDXComponents } from 'mdx/types.js';
import { CSSProperties } from 'react';

export type MDXComponents = _MDXComponents;

export type Themes = Record<string, CSSProperties>;

export type SlideTransition = {
  enter?: CSSProperties;
  from?: CSSProperties;
  leave?: CSSProperties;
};

export type ReMDXSlide = {
  Component: () => JSX.Element;
  data: Record<string, string>;
};

export type ReMDXModule = {
  Components?: _MDXComponents;
  Themes?: Themes;
  Transitions?: Record<string, SlideTransition>;
  default: ReadonlyArray<ReMDXSlide>;
};
