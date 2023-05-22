import type { MDXComponents, ReMDXSlide, Themes } from './types';

declare module '*.re.mdx' {
  let slides: ReadonlyArray<ReMDXSlide>;

  export let Components: MDXComponents | undefined;
  export let Themes: Themes | undefined;
  export default slides;
}
