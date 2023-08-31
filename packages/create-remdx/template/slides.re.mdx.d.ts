import type {
  ComponentList,
  ReMDXSlide,
  Themes as ThemesType,
} from '@nkzw/remdx';

declare let slides: ReadonlyArray<ReMDXSlide>;

export let Components: ComponentList | undefined;
export let Themes: ThemesType | undefined;
export default slides;
