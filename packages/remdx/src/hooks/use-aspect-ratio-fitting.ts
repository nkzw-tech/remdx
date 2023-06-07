import { useCallback, useEffect, useRef, useState } from 'react';
import useResizeObserver, { ResizeHandler } from 'use-resize-observer';

export default function useAspectRatioFitting(aspectRatio: number) {
  const targetWidth = 1366;
  const targetHeight = targetWidth / aspectRatio;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState({ x: 0, y: 0 });

  const recalculate = useCallback<ResizeHandler>(
    ({ width, height }) => {
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

      let x0 = 0;
      if (useVertical) {
        x0 = 0.5 * (containerWidth - scaledWidth);
        x0 /= 1 - scaleFactor;
      }

      let y0 = 0;
      if (!useVertical) {
        y0 = 0.5 * (containerHeight - scaledHeight);
        y0 /= 1 - scaleFactor;
      }

      setScaleFactor(scaleFactor);
      setTransformOrigin({ x: x0, y: y0 });
    },
    [targetWidth, targetHeight],
  );

  useEffect(() => {
    if (!containerRef || !containerRef.current) {
      return;
    }
    const rects = containerRef.current.getClientRects();
    recalculate(rects[0]);
  }, [targetWidth, targetHeight, recalculate]);

  useResizeObserver({
    onResize: recalculate,
    ref: containerRef,
  });

  return [
    containerRef,
    {
      height: targetHeight,
      position: 'relative',
      transform: `scale(${scaleFactor})`,
      transformOrigin: `${transformOrigin.x}px ${transformOrigin.y}px`,
      width: targetWidth,
    },
  ] as const;
}
