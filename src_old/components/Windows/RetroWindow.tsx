import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import "./RetroWindow.css";

import type { WindowState } from "../../types/windows";

type RetroWindowProps = {
  windowState: WindowState;
  title: string;
  canMaximize?: boolean;
  onFocus: () => void;
  onDragStart: (event: ReactMouseEvent) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  children: ReactNode;
};

function RetroWindow({
  windowState,
  title,
  canMaximize = false,
  onFocus,
  onDragStart,
  onMinimize,
  onMaximize,
  onClose,
  children,
}: RetroWindowProps) {
  const stopPropagation = (event: ReactMouseEvent) => event.stopPropagation();

  return (
    <div
      className={`retro-window ${
        windowState.maximized ? "retro-window-maximized" : ""
      }`}
      style={{
        left: windowState.maximized ? 0 : windowState.x,
        top: windowState.maximized ? 0 : windowState.y,
        zIndex: windowState.zIndex,
      }}
      onMouseDown={onFocus}
    >
      <div className="window-titlebar" onMouseDown={onDragStart}>
        <span>{title}</span>

        <div className="window-controls">
          <button
            className="window-minimize"
            onMouseDown={stopPropagation}
            onClick={onMinimize}
          >
            _
          </button>

          {canMaximize && (
            <button
              className="window-maximize"
              onMouseDown={stopPropagation}
              onClick={onMaximize}
            >
              □
            </button>
          )}

          <button
            className="window-close"
            onMouseDown={stopPropagation}
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}

export default RetroWindow;
