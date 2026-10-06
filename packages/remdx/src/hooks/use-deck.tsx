import { useContext, useMemo } from 'react';
import { DeckContext } from '../deck.tsx';

export type DeckControls = Readonly<{
  direction: number;
  goToSlide(slideIndex: number): void;
  nextSlide(): void;
  previousSlide(): void;
  slideCount: number;
  slideIndex: number;
}>;

export default function useDeck(): DeckControls {
  const deck = useContext(DeckContext);
  if (!deck) {
    throw new Error('remdx: useDeck() must be called inside a <Deck>.');
  }
  const { activeView, goToSlide, navigationDirection, slideCount, stepBackward, stepForward } =
    deck;
  return useMemo(
    () => ({
      direction: navigationDirection,
      goToSlide,
      nextSlide: stepForward,
      previousSlide: stepBackward,
      slideCount,
      slideIndex: activeView.slideIndex,
    }),
    [activeView.slideIndex, goToSlide, navigationDirection, slideCount, stepBackward, stepForward],
  );
}
