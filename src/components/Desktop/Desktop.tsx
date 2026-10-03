import type { ReactNode } from "react";
import "./Desktop.css";

import desktopBackground from "../../assets/desktop-background.png";
import { DESKTOP_ICON_ORDER, WINDOW_CONFIG } from "../../data/windowConfig";
import type { WindowType } from "../../types/windows";

type DesktopProps = {
  onOpenWindow: (type: WindowType) => void;
  /** Windows, taskbar, overlays, etc. rendered on top of the desktop */
  children?: ReactNode;
};

function Desktop({ onOpenWindow, children }: DesktopProps) {
  return (
    <main
      className="desktop"
      style={{
        backgroundImage: `url(${desktopBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="desktop-icons">
        {DESKTOP_ICON_ORDER.map((type) => (
          <button
            key={type}
            className="desktop-icon"
            onClick={() => onOpenWindow(type)}
          >
            <img
              className="desktop-icon-image"
              src={WINDOW_CONFIG[type].icon}
              alt=""
            />

            <span className="desktop-icon-label">
              {WINDOW_CONFIG[type].desktopLabel}
            </span>
          </button>
        ))}
      </div>

      {children}
    </main>
  );
}

export default Desktop;
