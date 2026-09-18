import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

import aboutMeIcon from "./assets/about-me.png";
import socialIcon from "./assets/social.png";
import desktopBackground from "./assets/desktop-background.png";
import windows98Cd from "./assets/windows98-cd.png";

import aNightAlone from "./assets/music/A Night Alone -TrackTribe.mp3";
import entranceWreath from "./assets/music/Entrance Wreath - Chika.mp3";
import localElevator from "./assets/music/Local Elevator - Kevin MacLeod.mp3";
import muscatAndWhiteDishes from "./assets/music/Muscat and White Dishes - Takahashi Takashi.mp3";
import relaxedScene from "./assets/music/Relaxed Scene - James Clarke.mp3";
import summerSkyAndHomework from "./assets/music/Summer Sky and Homework - Takahashi Takashi.mp3";
import windTrail from "./assets/music/Wind Trail - Chika.mp3";

type WindowType = "about" | "social" | "music";

type WindowState = {
  id: WindowType;
  type: WindowType;
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
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

type Track = {
  title: string;
  artist: string;
  src: string;
};

const playlist: Track[] = [
  {
    title: "A Night Alone",
    artist: "TrackTribe",
    src: aNightAlone,
  },
  {
    title: "Entrance Wreath",
    artist: "Chika",
    src: entranceWreath,
  },
  {
    title: "Local Elevator",
    artist: "Kevin MacLeod",
    src: localElevator,
  },
  {
    title: "Muscat and White Dishes",
    artist: "Takahashi Takashi",
    src: muscatAndWhiteDishes,
  },
  {
    title: "Relaxed Scene",
    artist: "James Clarke",
    src: relaxedScene,
  },
  {
    title: "Summer Sky and Homework",
    artist: "Takahashi Takashi",
    src: summerSkyAndHomework,
  },
  {
    title: "Wind Trail",
    artist: "Chika",
    src: windTrail,
  },
];

function formatTime(time: number) {
  if (!Number.isFinite(time)) {
    return "0:00";
  }

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function App() {
  /* --------------------------------
     Audio
  -------------------------------- */

  const audioRef = useRef<HTMLAudioElement>(null);

  // Used to tell the track-change effect whether the new track
  // should automatically start playing.
  const shouldAutoplayRef = useRef(false);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = playlist[currentTrackIndex];

  /* --------------------------------
     Clock
  -------------------------------- */

  const [clockTime, setClockTime] = useState(new Date());

  /* --------------------------------
     Windows
  -------------------------------- */

  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);

  const [dragging, setDragging] = useState<DragState | null>(null);

  /* --------------------------------
     About Me scrollbar
  -------------------------------- */

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
    aboutContentRef.current?.scrollBy({
      top: amount,
      behavior: "auto",
    });
  };

  /* --------------------------------
     Audio controls
  -------------------------------- */

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Unable to play audio:", error);
    }
  };

  /*
   * Changes to another track.
   *
   * Shuffle is always enabled, so the supplied index is normally
   * generated randomly. The actual playback happens in the
   * currentTrackIndex effect below, after React has updated the
   * <audio> element's src.
   */
  const changeTrack = (index: number) => {
    shouldAutoplayRef.current = true;

    setCurrentTrackIndex(index);
    setAudioTime(0);
    setDuration(0);
  };

  const getRandomTrackIndex = () => {
    if (playlist.length <= 1) {
      return currentTrackIndex;
    }

    let newIndex = Math.floor(
      Math.random() * playlist.length,
    );

    // Don't immediately play the same song.
    while (newIndex === currentTrackIndex) {
      newIndex = Math.floor(
        Math.random() * playlist.length,
      );
    }

    return newIndex;
  };

  const nextTrack = () => {
    changeTrack(getRandomTrackIndex());
  };

  const previousTrack = () => {
    changeTrack(getRandomTrackIndex());
  };

  const seek = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newTime = Number(event.target.value);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }

    setAudioTime(newTime);
  };

  /* --------------------------------
     Change audio source / autoplay
  -------------------------------- */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.load();

    if (!shouldAutoplayRef.current) {
      return;
    }

    shouldAutoplayRef.current = false;

    const playNewTrack = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error(
          "Unable to play new track:",
          error,
        );
        setIsPlaying(false);
      }
    };

    void playNewTrack();
  }, [currentTrackIndex]);

  /* --------------------------------
     Live clock
  -------------------------------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setClockTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* --------------------------------
     Open / close / minimize windows
  -------------------------------- */

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

      const windowWidth = type === "music" ? 320 : 620;
      const windowHeight =
        type === "about"
          ? 500
          : type === "music"
            ? 320
            : 300;

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

  /* --------------------------------
     Bring window to front
  -------------------------------- */

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

  /* --------------------------------
     Window dragging
  -------------------------------- */

  const startDragging = (
    event: React.MouseEvent,
    windowState: WindowState,
  ) => {
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
                x:
                  event.clientX -
                  dragging.offsetX,
                y:
                  event.clientY -
                  dragging.offsetY,
              }
            : window,
        ),
      );
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove,
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp,
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove,
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp,
      );
    };
  }, [dragging]);

  /* --------------------------------
     About scrollbar
  -------------------------------- */

  useEffect(() => {
    const content = aboutContentRef.current;
    const track = aboutScrollbarTrackRef.current;

    if (!content || !track) {
      return;
    }

    updateAboutScrollbar();

    const observer = new ResizeObserver(
      updateAboutScrollbar,
    );

    observer.observe(content);
    observer.observe(track);

    window.addEventListener(
      "resize",
      updateAboutScrollbar,
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        updateAboutScrollbar,
      );
    };
  }, [openWindows, updateAboutScrollbar]);

  const aboutMaxScroll = Math.max(
    aboutScrollbar.scrollHeight -
      aboutScrollbar.clientHeight,
    0,
  );

  const aboutThumbHeight =
    aboutScrollbar.scrollHeight > 0
      ? Math.min(
          aboutScrollbar.trackHeight,
          Math.max(
            28,
            aboutScrollbar.trackHeight *
              (aboutScrollbar.clientHeight /
                aboutScrollbar.scrollHeight),
          ),
        )
      : 28;

  const aboutMaxThumbOffset = Math.max(
    aboutScrollbar.trackHeight -
      aboutThumbHeight,
    0,
  );

  const aboutThumbOffset =
    aboutMaxScroll > 0
      ? (aboutScrollbar.scrollTop /
          aboutMaxScroll) *
        aboutMaxThumbOffset
      : 0;

  const startAboutThumbDrag = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    setAboutThumbDrag({
      pointerId: event.pointerId,
      scrollTop: aboutScrollbar.scrollTop,
      startY: event.clientY,
    });
  };

  const dragAboutThumb = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (
      !aboutThumbDrag ||
      event.pointerId !==
        aboutThumbDrag.pointerId
    ) {
      return;
    }

    const content = aboutContentRef.current;

    if (!content || aboutMaxThumbOffset === 0) {
      return;
    }

    const scrollAmount =
      ((event.clientY -
        aboutThumbDrag.startY) /
        aboutMaxThumbOffset) *
      aboutMaxScroll;

    content.scrollTop =
      aboutThumbDrag.scrollTop +
      scrollAmount;
  };

  const stopAboutThumbDrag = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (
      event.pointerId ===
      aboutThumbDrag?.pointerId
    ) {
      setAboutThumbDrag(null);
    }
  };

  /* --------------------------------
     Window title
  -------------------------------- */

  const getWindowTitle = (type: WindowType) => {
    switch (type) {
      case "about":
        return "About Me";

      case "social":
        return "Social";

      case "music":
        return "Music Player";
    }
  };

  /* --------------------------------
     Render
  -------------------------------- */

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
      {/* Audio */}

      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setAudioTime(
              audioRef.current.currentTime,
            );
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(
              audioRef.current.duration,
            );
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          // Shuffle is always enabled.
          // Pick a different random track.
          const nextIndex =
            getRandomTrackIndex();

          shouldAutoplayRef.current = true;

          setCurrentTrackIndex(nextIndex);
          setAudioTime(0);
          setDuration(0);
        }}
      />

      {/* Desktop icons */}

      <div className="desktop-icons">
        <button
          className="desktop-icon"
          onClick={() => openWindow("about")}
        >
          <img
            className="desktop-icon-image"
            src={aboutMeIcon}
            alt=""
          />

          <span className="desktop-icon-label">
            About Me
          </span>
        </button>

        <button
          className="desktop-icon"
          onClick={() => openWindow("social")}
        >
          <img
            className="desktop-icon-image"
            src={socialIcon}
            alt=""
          />

          <span className="desktop-icon-label">
            Social
          </span>
        </button>

        <button
          className="desktop-icon"
          onClick={() => openWindow("music")}
        >
          <span className="desktop-icon-image">
            🎵
          </span>

          <span className="desktop-icon-label">
            Music
          </span>
        </button>
      </div>

      {/* Open windows */}

      {openWindows
        .filter(
          (windowState) =>
            !windowState.minimized,
        )
        .map((windowState) => (
          <div
            key={windowState.id}
            className={`retro-window ${
              windowState.maximized
                ? "retro-window-maximized"
                : ""
            }`}
            style={{
              left: windowState.maximized
                ? 0
                : windowState.x,
              top: windowState.maximized
                ? 0
                : windowState.y,
              zIndex: windowState.zIndex,
            }}
            onMouseDown={() =>
              bringToFront(windowState.id)
            }
          >
            {/* Window titlebar */}

            <div
              className="window-titlebar"
              onMouseDown={(event) =>
                startDragging(
                  event,
                  windowState,
                )
              }
            >
              <span>
                {getWindowTitle(
                  windowState.type,
                )}
              </span>

              <div className="window-controls">
                <button
                  className="window-minimize"
                  onMouseDown={(event) =>
                    event.stopPropagation()
                  }
                  onClick={() =>
                    minimizeWindow(
                      windowState.id,
                    )
                  }
                >
                  _
                </button>

                <button
                  className="window-maximize"
                  onMouseDown={(event) =>
                    event.stopPropagation()
                  }
                  onClick={() =>
                    toggleMaximize(
                      windowState.id,
                    )
                  }
                >
                  □
                </button>

                <button
                  className="window-close"
                  onMouseDown={(event) =>
                    event.stopPropagation()
                  }
                  onClick={() =>
                    closeWindow(
                      windowState.id,
                    )
                  }
                >
                  ×
                </button>
              </div>
            </div>

            {/* --------------------------------
                 About Me
            -------------------------------- */}

            {windowState.type === "about" && (
              <div className="about-window-body">
                <div
                  ref={aboutContentRef}
                  className="about-window-content"
                  onScroll={
                    updateAboutScrollbar
                  }
                >
                  <h1>Richmond</h1>

                  <p className="about-role">
                    Electrical & Electronic
                    Engineering Student
                  </p>

                  <p>
                    University of Warwick
                  </p>

                  <hr />

                  <section className="about-section">
                    <h2>Profile</h2>

                    <p>
                      I'm an Electrical &
                      Electronic Engineering
                      student at the University of
                      Warwick with a strong
                      interest in computer
                      architecture, embedded
                      systems and digital
                      hardware.
                    </p>

                    <p>
                      I enjoy working on projects
                      that sit between hardware and
                      software, particularly where I
                      can design, build and test
                      systems from the ground up.
                    </p>

                    <p>
                      Outside of university, I'm
                      involved in engineering teams,
                      technical societies and
                      personal projects that let me
                      explore hardware beyond the
                      curriculum.
                    </p>
                  </section>

                  <section className="about-section">
                    <h2>Education</h2>

                    <div className="about-entry">
                      <h3>
                        University of Warwick
                      </h3>

                      <p className="about-meta">
                        MEng Electrical & Electronic
                        Engineering
                      </p>

                      <p>
                        Currently studying
                        Electrical & Electronic
                        Engineering, with
                        coursework spanning
                        semiconductor devices,
                        signal processing, systems
                        and software engineering,
                        and electrical & electronic
                        design.
                      </p>
                    </div>
                  </section>

                  <section className="about-section">
                    <h2>Projects</h2>

                    <div className="about-entry">
                      <h3>Tetra32</h3>

                      <p>
                        A long-term personal
                        computer architecture
                        project centred around a
                        custom 32-bit instruction
                        set architecture. The
                        project explores CPU design,
                        programming languages, RTL,
                        verification, FPGA
                        implementation and
                        eventually ASIC design.
                      </p>
                    </div>

                    <div className="about-entry">
                      <h3>Warwick Moto</h3>

                      <p>
                        Control Systems and
                        Modelling Lead Engineer
                        working on an electric race
                        motorcycle. My work covers
                        inverter and VCU systems,
                        motor testing, dyno
                        analysis, modelling, data
                        acquisition and vehicle
                        electronics.
                      </p>
                    </div>

                    <div className="about-entry">
                      <h3>Redactify</h3>

                      <p>
                        A Python-based document and
                        image redaction application
                        combining a graphical
                        interface with AI-assisted
                        functionality.
                      </p>
                    </div>
                  </section>

                  <section className="about-section">
                    <h2>
                      Academic Interests
                    </h2>

                    <div className="about-tags">
                      <span>
                        Computer Architecture
                      </span>

                      <span>ASIC Design</span>

                      <span>
                        Embedded Systems
                      </span>

                      <span>FPGA</span>

                      <span>SoC Design</span>

                      <span>VLSI</span>

                      <span>
                        RTL & Verification
                      </span>

                      <span>
                        Silicon Photonics
                      </span>

                      <span>
                        Digital Systems
                      </span>

                      <span>
                        Power Electronics
                      </span>
                    </div>
                  </section>

                  <section className="about-section">
                    <h2>
                      Teams & Activities
                    </h2>

                    <div className="about-entry">
                      <h3>Warwick Moto</h3>

                      <p>
                        Control Systems and
                        Modelling Lead Engineer.
                      </p>
                    </div>

                    <div className="about-entry">
                      <h3>
                        University of Warwick
                        Electronics Society
                      </h3>

                      <p>
                        Founder / organiser,
                        working to build a community
                        around electronics, embedded
                        systems and practical
                        engineering projects.
                      </p>
                    </div>
                  </section>

                  <section className="about-section">
                    <h2>
                      Hobbies & Interests
                    </h2>

                    <p>
                      Outside engineering, I enjoy
                      motorcycles, fitness,
                      volleyball, arcade and rhythm
                      games, and exploring computer
                      hardware and technology.
                    </p>

                    <p>
                      I also enjoy building small
                      projects simply because they're
                      interesting — particularly
                      things involving electronics,
                      programming or unusual
                      hardware.
                    </p>
                  </section>

                  <section className="about-section">
                    <h2>
                      Currently Learning
                    </h2>

                    <p>
                      C++, computer architecture,
                      RTL design, SystemVerilog,
                      FPGA development and
                      hardware/software co-design.
                    </p>
                  </section>

                  <hr />

                  <p className="about-footer">
                    Thanks for stopping by.
                  </p>
                </div>

                {/* Custom scrollbar */}

                <div
                  className="about-scrollbar"
                  aria-label="About Me scrollbar"
                >
                  <button
                    type="button"
                    className="about-scrollbar-button about-scrollbar-button-up"
                    aria-label="Scroll up"
                    onMouseDown={(event) =>
                      event.stopPropagation()
                    }
                    onClick={() =>
                      scrollAboutBy(-48)
                    }
                  >
                    <span aria-hidden="true" />
                  </button>

                  <div
                    ref={
                      aboutScrollbarTrackRef
                    }
                    className="about-scrollbar-track"
                    onMouseDown={(event) =>
                      event.stopPropagation()
                    }
                    onPointerDown={(event) => {
                      if (
                        event.target !==
                          event.currentTarget ||
                        !aboutMaxScroll
                      ) {
                        return;
                      }

                      const trackBounds =
                        event.currentTarget.getBoundingClientRect();

                      const offset = Math.max(
                        0,
                        Math.min(
                          event.clientY -
                            trackBounds.top -
                            aboutThumbHeight / 2,
                          aboutMaxThumbOffset,
                        ),
                      );

                      if (
                        aboutMaxThumbOffset > 0
                      ) {
                        aboutContentRef.current?.scrollTo(
                          {
                            top:
                              (offset /
                                aboutMaxThumbOffset) *
                              aboutMaxScroll,
                          },
                        );
                      }
                    }}
                  >
                    <button
                      type="button"
                      className="about-scrollbar-thumb"
                      aria-label="Drag to scroll"
                      style={{
                        height:
                          aboutThumbHeight,
                        transform: `translateY(${aboutThumbOffset}px)`,
                      }}
                      onPointerDown={
                        startAboutThumbDrag
                      }
                      onPointerMove={
                        dragAboutThumb
                      }
                      onPointerUp={
                        stopAboutThumbDrag
                      }
                      onPointerCancel={
                        stopAboutThumbDrag
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="about-scrollbar-button about-scrollbar-button-down"
                    aria-label="Scroll down"
                    onMouseDown={(event) =>
                      event.stopPropagation()
                    }
                    onClick={() =>
                      scrollAboutBy(48)
                    }
                  >
                    <span aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {/* --------------------------------
                 Social
            -------------------------------- */}

            {windowState.type === "social" && (
              <div className="window-content">
                <h1>Social</h1>

                <p>
                  Find me around the internet.
                </p>

                <hr />

                <div className="social-links">
                  <a
                    href="https://github.com/petazl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>

                  <a
                    href="https://www.linkedin.com/in/richmond-kyawzay-9772b8288/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>

                  <a
                    href="https://www.instagram.com/petazled/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            )}

            {/* --------------------------------
                 Music
            -------------------------------- */}

            {windowState.type === "music" && (
              <div className="music-window-content">
                <div className="music-screen">
                  <img
                    className="music-cd"
                    src={windows98Cd}
                    alt="Windows 98 CD"
                  />

                  <div className="music-track-info">
                    <div className="music-track-title">
                      <div className="music-track-title-scroll">
                        <span>{currentTrack.title}</span>
                        <span className="music-track-separator" aria-hidden="true">
                          •
                        </span>

                        <span aria-hidden="true">{currentTrack.title}</span>
                        <span className="music-track-separator" aria-hidden="true">
                          •
                        </span>

                        <span aria-hidden="true">{currentTrack.title}</span>
                        <span className="music-track-separator" aria-hidden="true">
                          •
                        </span>
                      </div>
                    </div>

                    <div className="music-track-artist">
                      {currentTrack.artist}
                    </div>
                  </div>

                  <div className="music-progress-area">
                    <input
                      className="music-progress"
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={audioTime}
                      onChange={seek}
                    />

                    <div className="music-time">
                      <span>
                        {formatTime(audioTime)}
                      </span>

                      <span>
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>

                  <div className="music-controls">
                    <button
                      type="button"
                      onClick={previousTrack}
                      title="Previous track"
                    >
                      |◀
                    </button>

                    <button
                      type="button"
                      className="music-play-button"
                      onClick={togglePlay}
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? "Ⅱ" : "▶"}
                    </button>

                    <button
                      type="button"
                      onClick={nextTrack}
                      title="Next track"
                    >
                      ▶|
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      
      {/* --------------------------------
           Taskbar
      -------------------------------- */}

      <div className="taskbar">
        <button className="start-button">
          <strong>Start</strong>
        </button>

        <div className="taskbar-windows">
          {openWindows.map(
            (windowState) => (
              <button
                key={windowState.id}
                className={`taskbar-app ${
                  windowState.minimized
                    ? ""
                    : "taskbar-window-active"
                }`}
                onClick={() => {
                  if (
                    windowState.minimized
                  ) {
                    restoreWindow(
                      windowState.id,
                    );

                    return;
                  }

                  const highestZ =
                    Math.max(
                      ...openWindows.map(
                        (window) =>
                          window.zIndex,
                      ),
                      0,
                    );

                  if (
                    windowState.zIndex ===
                    highestZ
                  ) {
                    minimizeWindow(
                      windowState.id,
                    );
                  } else {
                    bringToFront(
                      windowState.id,
                    );
                  }
                }}
              >
                {windowState.type ===
                "music" ? (
                  <span className="taskbar-app-icon">
                    🎵
                  </span>
                ) : (
                  <img
                    className="taskbar-app-icon"
                    src={
                      windowState.type ===
                      "about"
                        ? aboutMeIcon
                        : socialIcon
                    }
                    alt=""
                  />
                )}

                <span>
                  {getWindowTitle(
                    windowState.type,
                  )}
                </span>
              </button>
            ),
          )}
        </div>

        <div className="taskbar-clock">
          {clockTime.toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            },
          )}
        </div>
      </div>
    </main>
  );
}

export default App;