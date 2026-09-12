import { useEffect, useState } from "react";
import "./App.css";

type WindowType = "about" | "social";

type WindowState = {
  id: WindowType;
  type: WindowType;
  x: number;
  y: number;
  zIndex: number;
  minimized: boolean;
};

type DragState = {
  id: WindowType;
  offsetX: number;
  offsetY: number;
};

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);

  const [dragging, setDragging] = useState<DragState | null>(null);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Open a window, or bring it to the front if it's already open
  const openWindow = (type: WindowType) => {
  setOpenWindows((current) => {
    const highestZ = Math.max(
      ...current.map((window) => window.zIndex),
      0,
    );

    const existingWindow = current.find(
      (window) => window.id === type,
    );

    if (existingWindow) {
      return current.map((window) =>
        window.id === type
          ? { ...window, zIndex: highestZ + 1 }
          : window,
      );
    }

const windowWidth = 520;
const windowHeight = 300;

const offset = current.length * 32;

const x = window.innerWidth / 2 - windowWidth / 2 + offset;
const y = window.innerHeight / 2 - windowHeight / 2 + offset;

    return [
      ...current,
      {
        id: type,
        type,
        x,
        y,
        zIndex: highestZ + 1,
        minimized: false,
      },
    ];
  });
};

  // Close one window
  const closeWindow = (id: WindowType) => {
    setOpenWindows((current) =>
      current.filter((window) => window.id !== id),
    );
  };
  
  const minimizeWindow = (id: WindowType) => {
    setOpenWindows((current) =>
      current.map((window) =>
        window.id === id
          ? { ...window, minimized: true }
          : window,
      ),
    );
  };

  const restoreWindow = (id: WindowType) => {
    setOpenWindows((current) => {
      const highestZ = Math.max(
        ...current.map((window) => window.zIndex),
        0,
      );

      return current.map((window) =>
        window.id === id
          ? {
              ...window,
              minimized: false,
              zIndex: highestZ + 1,
            }
          : window,
      );
    });
  };

  // Bring a window to the front
  const bringToFront = (id: WindowType) => {
    setOpenWindows((current) => {
      const highestZ = Math.max(
        ...current.map((window) => window.zIndex),
        0,
      );

      return current.map((window) =>
        window.id === id
          ? { ...window, zIndex: highestZ + 1 }
          : window,
      );
    });
  };

  // Start dragging a window
  const startDragging = (
    event: React.MouseEvent,
    windowState: WindowState,
  ) => {
    event.preventDefault();

    bringToFront(windowState.id);

    setDragging({
      id: windowState.id,
      offsetX: event.clientX - windowState.x,
      offsetY: event.clientY - windowState.y,
    });
  };

  // Handle dragging
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

  return (
    <main className="desktop">
      {/* Desktop icons */}
      <div className="desktop-icons">
        <button
          className="desktop-icon"
          onClick={() => openWindow("about")}
        >
          <span className="desktop-icon-image">👤</span>
          <span className="desktop-icon-label">About Me</span>
        </button>

        <button
          className="desktop-icon"
          onClick={() => openWindow("social")}
        >
          <span className="desktop-icon-image">🌐</span>
          <span className="desktop-icon-label">Social</span>
        </button>
      </div>

      {/* Open windows */}
      {openWindows
        .filter((windowState) => !windowState.minimized)
        .map((windowState) => (
        <div
          key={windowState.id}
          className={`retro-window ${
            windowState.type === "social"
              ? "social-window"
              : ""
          }`}
          style={{
            left: windowState.x,
            top: windowState.y,
            zIndex: windowState.zIndex,
          }}
          onMouseDown={() => bringToFront(windowState.id)}
        >
          <div
            className="window-titlebar"
            onMouseDown={(event) =>
              startDragging(event, windowState)
            }
          >
            <span>
              {windowState.type === "about"
                ? "👤 About Me"
                : "🌐 Social"}
            </span>

            <button
              className="window-close"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
              onClick={() => closeWindow(windowState.id)}
            >
              ×
            </button>
          </div> \\\\\IM HERE NEED TO FINISHHHH

          {windowState.type === "about" && (
            <div className="window-content">
              <h1>PETAZL</h1>

              <p className="subtitle">
                Electrical & Electronic Engineering
              </p>

              <hr />

              <h2>About Me</h2>

              <p>
                Hey! I'm PETAZL, an Electrical & Electronic
                Engineering student at the University of
                Warwick.
              </p>

              <p>
                I'm interested in computer architecture,
                embedded systems, electronics, hardware design
                and building weird things with computers.
              </p>
            </div>
          )}

          {windowState.type === "social" && (
            <div className="window-content">
              <h1>Social</h1>

              <p>Find me around the internet.</p>

              <hr />

              <div className="social-links">
                <button>GitHub</button>
                <button>LinkedIn</button>
                <button>Instagram</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Taskbar */}
      <div className="taskbar">
        <button className="start-button">
           <strong>Start</strong>
        </button>

        <div className="taskbar-clock">
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </div>
      </div>
    </main>
  );
}

export default App;