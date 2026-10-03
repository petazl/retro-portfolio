import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type ScrollbarState = {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
  trackHeight: number;
};

type ThumbDragState = {
  pointerId: number;
  scrollTop: number;
  startY: number;
};

const MIN_THUMB_HEIGHT = 28;

/**
 * Drives a custom Windows 98-style scrollbar for a scrollable element.
 * Attach `contentRef` to the scrolling element and `trackRef` to the track.
 */
export function useCustomScrollbar() {
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [metrics, setMetrics] = useState<ScrollbarState>({
    clientHeight: 0,
    scrollHeight: 0,
    scrollTop: 0,
    trackHeight: 0,
  });

  const [thumbDrag, setThumbDrag] = useState<ThumbDragState | null>(null);

  const update = useCallback(() => {
    const content = contentRef.current;
    const track = trackRef.current;

    if (!content || !track) {
      return;
    }

    setMetrics({
      clientHeight: content.clientHeight,
      scrollHeight: content.scrollHeight,
      scrollTop: content.scrollTop,
      trackHeight: track.clientHeight,
    });
  }, []);

  const scrollBy = (amount: number) => {
    contentRef.current?.scrollBy({ top: amount, behavior: "auto" });
  };

  /* Keep metrics in sync with size changes */

  useEffect(() => {
    const content = contentRef.current;
    const track = trackRef.current;

    if (!content || !track) {
      return;
    }

    update();

    const observer = new ResizeObserver(update);

    observer.observe(content);
    observer.observe(track);

    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [update]);

  /* Derived thumb geometry */

  const maxScroll = Math.max(metrics.scrollHeight - metrics.clientHeight, 0);

  const thumbHeight =
    metrics.scrollHeight > 0
      ? Math.min(
          metrics.trackHeight,
          Math.max(
            MIN_THUMB_HEIGHT,
            metrics.trackHeight * (metrics.clientHeight / metrics.scrollHeight),
          ),
        )
      : MIN_THUMB_HEIGHT;

  const maxThumbOffset = Math.max(metrics.trackHeight - thumbHeight, 0);

  const thumbOffset =
    maxScroll > 0 ? (metrics.scrollTop / maxScroll) * maxThumbOffset : 0;

  /* Thumb dragging */

  const startThumbDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.setPointerCapture(event.pointerId);

    setThumbDrag({
      pointerId: event.pointerId,
      scrollTop: metrics.scrollTop,
      startY: event.clientY,
    });
  };

  const dragThumb = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!thumbDrag || event.pointerId !== thumbDrag.pointerId) {
      return;
    }

    const content = contentRef.current;

    if (!content || maxThumbOffset === 0) {
      return;
    }

    const scrollAmount =
      ((event.clientY - thumbDrag.startY) / maxThumbOffset) * maxScroll;

    content.scrollTop = thumbDrag.scrollTop + scrollAmount;
  };

  const stopThumbDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerId === thumbDrag?.pointerId) {
      setThumbDrag(null);
    }
  };

  /* Clicking the empty track jumps the thumb there */

  const handleTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !maxScroll) {
      return;
    }

    const trackBounds = event.currentTarget.getBoundingClientRect();

    const offset = Math.max(
      0,
      Math.min(event.clientY - trackBounds.top - thumbHeight / 2, maxThumbOffset),
    );

    if (maxThumbOffset > 0) {
      contentRef.current?.scrollTo({
        top: (offset / maxThumbOffset) * maxScroll,
      });
    }
  };

  return {
    contentRef,
    trackRef,
    thumbHeight,
    thumbOffset,
    update,
    scrollBy,
    startThumbDrag,
    dragThumb,
    stopThumbDrag,
    handleTrackPointerDown,
  };
}
