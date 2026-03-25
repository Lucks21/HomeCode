'use client';

import { useRef, useCallback } from 'react';

export function useLongPress(
  onLongPress: (e: React.TouchEvent | React.MouseEvent) => void,
  delay = 500,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const movedRef = useRef(false);

  const start = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      movedRef.current = false;
      timerRef.current = setTimeout(() => {
        if (!movedRef.current) {
          e.preventDefault();
          onLongPress(e);
        }
      }, delay);
    },
    [onLongPress, delay],
  );

  const move = useCallback(() => {
    movedRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const end = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onTouchStart: start,
    onTouchMove: move,
    onTouchEnd: end,
    onMouseDown: start,
    onMouseMove: move,
    onMouseUp: end,
  };
}
