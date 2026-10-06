import { useEffect } from 'react';

type Controls = Readonly<{
  firstSlide(): void;
  lastSlide(): void;
  nextSlide(): void;
  previousSlide(): void;
}>;

const interactiveSelector = [
  'input',
  'textarea',
  'select',
  'button',
  'a[href]',
  'summary',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]',
  '[role="textbox"]',
  '[role="button"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[role="combobox"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="link"]',
  '[role="searchbox"]',
  '[role="listbox"]',
  '[role="menu"]',
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="tab"]',
  '[role="tree"]',
  '[role="treeitem"]',
  '[role="grid"]',
  '[role="gridcell"]',
].join(',');

export default function usePresentationControls({
  firstSlide,
  lastSlide,
  nextSlide,
  previousSlide,
}: Controls) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (event.shiftKey && event.key !== ' ')
      ) {
        return;
      }

      const isInteractive = event.composedPath().some((target) => {
        const element = target as Element;
        return typeof element.closest === 'function' && element.closest(interactiveSelector);
      });
      if (isInteractive) {
        return;
      }

      let navigate: (() => void) | undefined;
      switch (event.key) {
        case 'ArrowRight':
        case 'PageDown':
          navigate = nextSlide;
          break;
        case ' ':
          navigate = event.shiftKey ? previousSlide : nextSlide;
          break;
        case 'ArrowLeft':
        case 'PageUp':
          navigate = previousSlide;
          break;
        case 'Home':
          navigate = firstSlide;
          break;
        case 'End':
          navigate = lastSlide;
          break;
      }
      if (navigate) {
        event.preventDefault();
        navigate();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [firstSlide, lastSlide, nextSlide, previousSlide]);
}
