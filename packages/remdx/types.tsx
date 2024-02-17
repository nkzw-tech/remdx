import { CSSProperties } from 'react';

/**
 * Configuration for `MDXProvider`.
 */
type MDXProps = {
  /**
   * Children (optional).
   */
  children?: ReactNode | null | undefined;
  /**
   * Additional components to use or a function that creates them (optional).
   */
  components?: Readonly<MDXComponents> | MergeComponents | null | undefined;
  /**
   * Turn off outer component context (default: `false`).
   */
  disableParentContext?: boolean | null | undefined;
};

/**
 * Provider for MDX context.
 *
 * @param {Readonly<MDXProps>} properties
 *   Properties.
 * @returns {JSX.Element}
 *   Element.
 * @satisfies {Component}
 */
function MDXProvider(properties: Readonly<MDXProps>): JSX.Element;

export type MDXComponents = MDXProps['components'];
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
  Components?: MDXComponents;
  Themes?: Themes;
  Transitions?: Record<string, SlideTransition>;
  default: ReadonlyArray<ReMDXSlide>;
};
