import { useState } from "react";
import "./App.css";

type AppWindow = "about" | "social" | null;

function App() {
  const [openWindow, setOpenWindow] = useState<AppWindow>(null);

  return (
    <main className="desktop">
      <div className="desktop-icons">
        <button
          className="desktop-icon"
          onClick={() => setOpenWindow("about")}
        >
          <span className="desktop-icon-image">👤</span>
          <span className="desktop-icon-label">About Me</span>
        </button>

        <button
          className="desktop-icon"
          onClick={() => setOpenWindow("social")}
        >
          <span className="desktop-icon-image">🌐</span>
          <span className="desktop-icon-label">Social</span>
        </button>
      </div>

      {openWindow === "about" && (
        <div className="retro-window">
          <div className="window-titlebar">
            <span>👤 About Me</span>

            <button
              className="window-close"
              onClick={() => setOpenWindow(null)}
            >
              ×
            </button>
          </div>

          <div className="window-content">
            <h1>PETAZL</h1>

            <p className="subtitle">
              Electrical & Electronic Engineering
            </p>

            <hr />

            <h2>About Me</h2>

            <p>
              Hey! I'm PETAZL, an Electrical & Electronic Engineering student
              at the University of Warwick.
            </p>

            <p>
              I'm interested in computer architecture, embedded systems,
              electronics, hardware design and building weird things with
              computers.
            </p>
          </div>
        </div>
      )}

      {openWindow === "social" && (
        <div className="retro-window social-window">
          <div className="window-titlebar">
            <span>🌐 Social</span>

            <button
              className="window-close"
              onClick={() => setOpenWindow(null)}
            >
              ×
            </button>
          </div>

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
        </div>
      )}

      <div className="taskbar">
        <button className="start-button">
          🪟 <strong>Start</strong>
        </button>

        <div className="taskbar-app">
          PETAZL COMPUTER
        </div>

        <div className="taskbar-clock">
          14:32
        </div>
      </div>
    </main>
  );
}

export default App;