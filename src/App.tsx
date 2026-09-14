import { useCallback, useEffect, useRef, useState } from "react";
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

type ScrollbarState = {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
  trackHeight: number;
};

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);

  const [dragging, setDragging] = useState<DragState | null>(null);

  const aboutContentRef = useRef<HTMLDivElement>(null);
  const aboutScrollbarTrackRef = useRef<HTMLDivElement>(null);
  const [aboutScrollbar, setAboutScrollbar] =
    useState<ScrollbarState>({
      clientHeight: 0,
      scrollHeight: 0,
      scrollTop: 0,
      trackHeight: 0,
    });
  const [aboutThumbDrag, setAboutThumbDrag] = useState<{
    pointerId: number;
    scrollTop: number;
    startY: number;
  } | null>(null);

  const updateAboutScrollbar = useCallback(() => {
    const content = aboutContentRef.current;
    const track = aboutScrollbarTrackRef.current;

    if (!content || !track) {
      return;
    }

    setAboutScrollbar({
      clientHeight: content.clientHeight,
      scrollHeight: content.scrollHeight,
      scrollTop: content.scrollTop,
      trackHeight: track.clientHeight,
    });
  }, []);

  const scrollAboutBy = (amount: number) => {
    aboutContentRef.current?.scrollBy({ top: amount });
  };

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Open a window, or bring it to the front if already open
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
            ? {
                ...window,
                minimized: false,
                zIndex: highestZ + 1,
              }
            : window,
        );
      }

      const windowWidth = 620;
      const windowHeight = 300;

      const offset = current.length * 32;

      const x =
        window.innerWidth / 2 -
        windowWidth / 2 +
        offset;

      const y =
        window.innerHeight / 2 -
        windowHeight / 2 +
        offset;

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

  // Close a window
  const closeWindow = (id: WindowType) => {
    setOpenWindows((current) =>
      current.filter((window) => window.id !== id),
    );
  };

  // Minimize a window
  const minimizeWindow = (id: WindowType) => {
    setOpenWindows((current) =>
      current.map((window) =>
        window.id === id
          ? { ...window, minimized: true }
          : window,
      ),
    );
  };

  // Restore a minimized window
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
          ? {
              ...window,
              zIndex: highestZ + 1,
            }
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

  useEffect(() => {
    const content = aboutContentRef.current;
    const track = aboutScrollbarTrackRef.current;

    if (!content || !track) {
      return;
    }

    updateAboutScrollbar();

    const observer = new ResizeObserver(updateAboutScrollbar);
    observer.observe(content);
    observer.observe(track);
    window.addEventListener("resize", updateAboutScrollbar);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateAboutScrollbar);
    };
  }, [openWindows, updateAboutScrollbar]);

  const aboutMaxScroll = Math.max(
    aboutScrollbar.scrollHeight - aboutScrollbar.clientHeight,
    0,
  );
  const aboutThumbHeight = Math.min(
    aboutScrollbar.trackHeight,
    Math.max(
      28,
      aboutScrollbar.trackHeight *
        (aboutScrollbar.clientHeight / aboutScrollbar.scrollHeight || 1),
    ),
  );
  const aboutMaxThumbOffset = Math.max(
    aboutScrollbar.trackHeight - aboutThumbHeight,
    0,
  );
  const aboutThumbOffset =
    aboutMaxScroll > 0
      ? (aboutScrollbar.scrollTop / aboutMaxScroll) *
        aboutMaxThumbOffset
      : 0;

  const startAboutThumbDrag = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);

    setAboutThumbDrag({
      pointerId: event.pointerId,
      scrollTop: aboutScrollbar.scrollTop,
      startY: event.clientY,
    });
  };

  const dragAboutThumb = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (!aboutThumbDrag || event.pointerId !== aboutThumbDrag.pointerId) {
      return;
    }

    const content = aboutContentRef.current;

    if (!content || aboutMaxThumbOffset === 0) {
      return;
    }

    const scrollAmount =
      ((event.clientY - aboutThumbDrag.startY) / aboutMaxThumbOffset) *
      aboutMaxScroll;

    content.scrollTop = aboutThumbDrag.scrollTop + scrollAmount;
  };

  const stopAboutThumbDrag = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (event.pointerId === aboutThumbDrag?.pointerId) {
      setAboutThumbDrag(null);
    }
  };

  return (
    <main className="desktop">
      {/* Desktop icons */}

      <div className="desktop-icons">
        <button
          className="desktop-icon"
          onClick={() => openWindow("about")}
        >
          <span className="desktop-icon-image">👤</span>
          <span className="desktop-icon-label">
            About Me
          </span>
        </button>

        <button
          className="desktop-icon"
          onClick={() => openWindow("social")}
        >
          <span className="desktop-icon-image">🌐</span>
          <span className="desktop-icon-label">
            Social
          </span>
        </button>
      </div>

      {/* Open windows */}

      {openWindows
        .filter((windowState) => !windowState.minimized)
        .map((windowState) => (
          <div
            key={windowState.id}
            className="retro-window"
            style={{
              left: windowState.x,
              top: windowState.y,
              zIndex: windowState.zIndex,
            }}
            onMouseDown={() =>
              bringToFront(windowState.id)
            }
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

              <div className="window-controls">
                <button
                  className="window-minimize"
                  onMouseDown={(event) =>
                    event.stopPropagation()
                  }
                  onClick={() =>
                    minimizeWindow(windowState.id)
                  }
                >
                  _
                </button>

                <button
                  className="window-close"
                  onMouseDown={(event) =>
                    event.stopPropagation()
                  }
                  onClick={() =>
                    closeWindow(windowState.id)
                  }
                >
                  ×
                </button>
              </div>
            </div>

            {/* About Me */}

            {windowState.type === "about" && (
              <div className="about-window-body">
                <div
                  ref={aboutContentRef}
                  className="about-window-content"
                  onScroll={updateAboutScrollbar}
                >
                  <h1>Richmond</h1>

                <p className="about-role">
                  Electrical & Electronic Engineering Student
                </p>

                <p>
                  University of Warwick
                </p>

                <hr />

                <section className="about-section">
                  <h2>Profile</h2>

                  <p>
                    I'm an Electrical & Electronic Engineering
                    student at the University of Warwick with a
                    strong interest in computer architecture,
                    embedded systems and digital hardware.
                  </p>

                  <p>
                    I enjoy working on projects that sit between
                    hardware and software, particularly where I
                    can design, build and test systems from the
                    ground up.
                  </p>

                  <p>
                    Outside of university, I'm involved in
                    engineering teams, technical societies and
                    personal projects that let me explore
                    hardware beyond the curriculum.
                  </p>
                </section>

                <section className="about-section">
                  <h2>Education</h2>

                  <div className="about-entry">
                    <h3>University of Warwick</h3>

                    <p className="about-meta">
                      MEng Electrical & Electronic Engineering
                    </p>

                    <p>
                      Currently studying Electrical & Electronic
                      Engineering, with coursework spanning
                      semiconductor devices, signal processing,
                      systems and software engineering, and
                      electrical & electronic design.
                    </p>
                  </div>
                </section>

                <section className="about-section">
                  <h2>Projects</h2>

                  <div className="about-entry">
                    <h3>Tetra32</h3>

                    <p>
                      A long-term personal computer architecture
                      project centred around a custom 32-bit
                      instruction set architecture. The project
                      explores CPU design, programming languages,
                      RTL, verification, FPGA implementation and
                      eventually ASIC design.
                    </p>
                  </div>

                  <div className="about-entry">
                    <h3>Warwick Moto</h3>

                    <p>
                      Control Systems and Modelling Lead Engineer
                      working on an electric race motorcycle. My
                      work covers inverter and VCU systems, motor
                      testing, dyno analysis, modelling, data
                      acquisition and vehicle electronics.
                    </p>
                  </div>

                  <div className="about-entry">
                    <h3>Redactify</h3>

                    <p>
                      A Python-based document and image redaction
                      application combining a graphical interface
                      with AI-assisted functionality.
                    </p>
                  </div>
                </section>

                <section className="about-section">
                  <h2>Academic Interests</h2>

                  <div className="about-tags">
                    <span>Computer Architecture</span>
                    <span>ASIC Design</span>
                    <span>Embedded Systems</span>
                    <span>FPGA</span>
                    <span>SoC Design</span>
                    <span>VLSI</span>
                    <span>RTL & Verification</span>
                    <span>Silicon Photonics</span>
                    <span>Digital Systems</span>
                    <span>Power Electronics</span>
                  </div>
                </section>

                <section className="about-section">
                  <h2>Teams & Activities</h2>

                  <div className="about-entry">
                    <h3>Warwick Moto</h3>

                    <p>
                      Control Systems and Modelling Lead Engineer.
                    </p>
                  </div>

                  <div className="about-entry">
                    <h3>
                      University of Warwick Electronics Society
                    </h3>

                    <p>
                      Founder / organiser, working to build a
                      community around electronics, embedded
                      systems and practical engineering projects.
                    </p>
                  </div>
                </section>

                <section className="about-section">
                  <h2>Hobbies & Interests</h2>

                  <p>
                    Outside engineering, I enjoy motorcycles,
                    fitness, volleyball, arcade and rhythm games,
                    and exploring computer hardware and
                    technology.
                  </p>

                  <p>
                    I also enjoy building small projects simply
                    because they're interesting — particularly
                    things involving electronics, programming or
                    unusual hardware.
                  </p>
                </section>

                <section className="about-section">
                  <h2>Currently Learning</h2>

                  <p>
                    C++, computer architecture, RTL design,
                    SystemVerilog, FPGA development and
                    hardware/software co-design.
                  </p>
                </section>

                <hr />

                  <p className="about-footer">
                    Thanks for stopping by.
                  </p>
                </div>

                <div className="about-scrollbar" aria-label="About Me scrollbar">
                  <button
                    type="button"
                    className="about-scrollbar-button about-scrollbar-button-up"
                    aria-label="Scroll up"
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={() => scrollAboutBy(-48)}
                  >
                    <span aria-hidden="true" />
                  </button>

                  <div
                    ref={aboutScrollbarTrackRef}
                    className="about-scrollbar-track"
                    onMouseDown={(event) => event.stopPropagation()}
                    onPointerDown={(event) => {
                      if (event.target !== event.currentTarget || !aboutMaxScroll) {
                        return;
                      }

                      const trackBounds = event.currentTarget.getBoundingClientRect();
                      const offset = Math.max(
                        0,
                        Math.min(
                          event.clientY - trackBounds.top - aboutThumbHeight / 2,
                          aboutMaxThumbOffset,
                        ),
                      );

                      aboutContentRef.current?.scrollTo({
                        top: (offset / aboutMaxThumbOffset) * aboutMaxScroll,
                      });
                    }}
                  >
                    <button
                      type="button"
                      className="about-scrollbar-thumb"
                      aria-label="Drag to scroll"
                      style={{
                        height: aboutThumbHeight,
                        transform: `translateY(${aboutThumbOffset}px)`,
                      }}
                      onPointerDown={startAboutThumbDrag}
                      onPointerMove={dragAboutThumb}
                      onPointerUp={stopAboutThumbDrag}
                      onPointerCancel={stopAboutThumbDrag}
                    />
                  </div>

                  <button
                    type="button"
                    className="about-scrollbar-button about-scrollbar-button-down"
                    aria-label="Scroll down"
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={() => scrollAboutBy(48)}
                  >
                    <span aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {/* Social */}

            {windowState.type === "social" && (
              <div className="window-content">
                <h1>Social</h1>

                <p>
                  Find me around the internet.
                </p>

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
          🪟 <strong>Start</strong>
        </button>

        <div className="taskbar-windows">
          {openWindows.map((windowState) => (
            <button
              key={windowState.id}
              className={`taskbar-app ${
                windowState.minimized
                  ? ""
                  : "taskbar-window-active"
              }`}
              onClick={() => {
                if (windowState.minimized) {
                  restoreWindow(windowState.id);
                } else {
                  bringToFront(windowState.id);
                }
              }}
            >
              {windowState.type === "about"
                ? "👤 About Me"
                : "🌐 Social"}
            </button>
          ))}
        </div>

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
