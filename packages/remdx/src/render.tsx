import { createRoot, Root } from 'react-dom/client';
import { ReMDXModule } from '../types.tsx';
import slidesToComponent from './slidesToComponent.tsx';

const roots = new WeakMap<HTMLElement, Root>();

export default async function render(
  element: HTMLElement | null,
  module: Promise<ReMDXModule>,
) {
  if (!element) {
    throw new Error(`remdx: The provided DOM node could not be found.`);
  }

  if (!roots.has(element)) {
    roots.set(element, createRoot(element));
  }

  roots.get(element)?.render(await slidesToComponent(module));
}
