import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { type ObservedSize, useResizeObserver } from 'use-resize-observer';

export default function useAspectRatioFitting(aspectRatio: number) {
  const targetWidth = 1366;
  const targetHeight = targetWidth / aspectRatio;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const recalculate = useCallback(
    ({ height, width }: ObservedSize) => {
      const containerWidth = Number(width) || 0.01;
      const containerHeight = Number(height) || 0.01;

      const containerRatio = containerWidth / containerHeight;
      const targetRatio = targetWidth / targetHeight;
      const useVertical = containerRatio > targetRatio;

      const scaleFactor = useVertical
        ? containerHeight / targetHeight
        : containerWidth / targetWidth;

      const scaledWidth = targetWidth * scaleFactor;
      const scaledHeight = targetHeight * scaleFactor;

      setScaleFactor(scaleFactor);
      setOffset({
        x: 0.5 * (containerWidth - scaledWidth),
        y: 0.5 * (containerHeight - scaledHeight),
      });
    },
    [targetWidth, targetHeight],
  );

  useLayoutEffect(() => {
    if (!containerRef || !containerRef.current) {
      return;
    }
    const rect = containerRef.current.getClientRects()[0];
    if (rect) {
      recalculate(rect);
    }
  }, [targetWidth, targetHeight, recalculate]);

  useResizeObserver({
    onResize: recalculate,
    ref: containerRef,
  });

  return [
    containerRef,
    {
      height: targetHeight,
      overflow: 'hidden',
      position: 'relative',
      transform: `translate(${offset.x}px, ${offset.y}px) scale(${scaleFactor})`,
      transformOrigin: '0 0',
      width: targetWidth,
    },
  ] as const;
}
