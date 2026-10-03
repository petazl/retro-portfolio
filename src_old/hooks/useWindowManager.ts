import { useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import { WINDOW_CONFIG } from "../data/windowConfig";
import type { DragState, WindowState, WindowType } from "../types/windows";

const getHighestZ = (windows: WindowState[]) =>
  Math.max(...windows.map((window) => window.zIndex), 0);

export function useWindowManager() {
  const [openWindows, setOpenWindows] = useState<WindowState[]>([
    {
      id: "music",
      type: "music",
      x: window.innerWidth - 340,
      y: 10,
      previousX: window.innerWidth - 340,
      previousY: 10,
      zIndex: 1,
      minimized: false,
      maximized: false,
    },
  ]);

  const [dragging, setDragging] = useState<DragState | null>(null);

  /* --------------------------------
     Open / close / minimize / maximize
  -------------------------------- */

  const openWindow = (type: WindowType) => {
    setOpenWindows((current) => {
      const highestZ = getHighestZ(current);
      const existingWindow = current.find((window) => window.id === type);

      if (existingWindow) {
        return current.map((window) =>
          window.id === type
            ? { ...window, minimized: false, zIndex: highestZ + 1 }
            : window,
        );
      }

      const { width, height } = WINDOW_CONFIG[type];
      const offset = current.length * 32;

      const x = window.innerWidth / 2 - width / 2 + offset;
      const y = window.innerHeight / 2 - height / 2 + offset;

      return [
        ...current,
        {
          id: type,
          type,
          x,
          y,
          previousX: x,
          previousY: y,
          zIndex: highestZ + 1,
          minimized: false,
          maximized: false,
        },
      ];
    });
  };

  const closeWindow = (id: WindowType) => {
    setOpenWindows((current) => current.filter((window) => window.id !== id));
  };

  const minimizeWindow = (id: WindowType) => {
    setOpenWindows((current) =>
      current.map((window) =>
        window.id === id ? { ...window, minimized: true } : window,
      ),
    );
  };

  const restoreWindow = (id: WindowType) => {
    setOpenWindows((current) => {
      const highestZ = getHighestZ(current);

      return current.map((window) =>
        window.id === id
          ? { ...window, minimized: false, zIndex: highestZ + 1 }
          : window,
      );
    });
  };

  const toggleMaximize = (id: WindowType) => {
    setOpenWindows((current) =>
      current.map((window) => {
        if (window.id !== id) {
          return window;
        }

        if (window.maximized) {
          return {
            ...window,
            x: window.previousX,
            y: window.previousY,
            maximized: false,
          };
        }

        return {
          ...window,
          previousX: window.x,
          previousY: window.y,
          x: 0,
          y: 0,
          maximized: true,
        };
      }),
    );
  };

  const bringToFront = (id: WindowType) => {
    setOpenWindows((current) => {
      const highestZ = getHighestZ(current);

      return current.map((window) =>
        window.id === id ? { ...window, zIndex: highestZ + 1 } : window,
      );
    });
  };

  /**
   * Taskbar button behaviour:
   * minimized -> restore, focused -> minimize, otherwise -> bring to front.
   */
  const toggleFromTaskbar = (id: WindowType) => {
    const windowState = openWindows.find((window) => window.id === id);

    if (!windowState) {
      return;
    }

    if (windowState.minimized) {
      restoreWindow(id);
      return;
    }

    if (windowState.zIndex === getHighestZ(openWindows)) {
      minimizeWindow(id);
    } else {
      bringToFront(id);
    }
  };

  /* --------------------------------
     Dragging
  -------------------------------- */

  const startDragging = (event: ReactMouseEvent, windowState: WindowState) => {
    if (windowState.maximized) {
      return;
    }

    event.preventDefault();

    bringToFront(windowState.id);

    setDragging({
      id: windowState.id,
      offsetX: event.clientX - windowState.x,
      offsetY: event.clientY - windowState.y,
    });
  };

  useEffect(() => {
    if (!dragging) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      setOpenWindows((current) =>
        current.map((window) =>
          window.id === dragging.id
            ? {
                ...window,
                x: event.clientX - dragging.offsetX,
                y: event.clientY - dragging.offsetY,
              }
            : window,
        ),
      );
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return {
    openWindows,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    bringToFront,
    toggleFromTaskbar,
    startDragging,
  };
}
