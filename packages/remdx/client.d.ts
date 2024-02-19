declare module '*.re.mdx' {
  let slides: ReadonlyArray<import('./types.jsx').ReMDXSlide>;

  export let Components: import('./types.jsx').MDXComponents | undefined;
  export let Themes: import('./types.jsx').Themes | undefined;
  export let Transitions:
    | Record<string, import('./types.jsx').SlideTransition>
    | undefined;
  export default slides;
}
