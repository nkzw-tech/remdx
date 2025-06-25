import type { useMDXComponents } from '@mdx-js/react';
import type { CSSProperties, JSX, ReactNode } from 'react';

export type MDXComponents = Parameters<typeof useMDXComponents>[0];

export type Themes = Record<string, CSSProperties>;

export type SlideTransition = Readonly<{
  enter?: CSSProperties;
  from?: CSSProperties;
  leave?: CSSProperties;
}>;

export type SlideContainer = ({
  children,
  style,
}: {
  children: JSX.Element;
  style: CSSProperties;
}) => ReactNode;

export type ReMDXSlide = Readonly<{
  Component: () => JSX.Element;
  data: Record<string, string>;
}>;

export type ReMDXModule = Readonly<{
  Components?: MDXComponents;
  Container?: SlideContainer;
  default: ReadonlyArray<ReMDXSlide>;
  Themes?: Themes;
  Transitions?: Record<string, SlideTransition>;
}>;
