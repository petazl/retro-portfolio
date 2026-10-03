import "./App.css";

import CRT from "./components/CRT/CRT";
import Desktop from "./components/Desktop/Desktop";
import Taskbar from "./components/Taskbar/Taskbar";
import AboutWindow from "./components/Windows/AboutWindow";
import MusicWindow from "./components/Windows/MusicWindow";
import RetroWindow from "./components/Windows/RetroWindow";
import SocialWindow from "./components/Windows/SocialWindow";
import { WINDOW_CONFIG } from "./data/windowConfig";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useWindowManager } from "./hooks/useWindowManager";
import type { WindowType } from "./types/windows";

function App() {
  const audio = useAudioPlayer();
  const windows = useWindowManager();

  const handleClose = (id: WindowType) => {
    // Closing the music player stops the music.
    if (id === "music") {
      audio.stop();
    }

    windows.closeWindow(id);
  };

  const renderWindowContent = (type: WindowType) => {
    switch (type) {
      case "about":
        return <AboutWindow />;

      case "social":
        return <SocialWindow />;

      case "music":
        return (
          <MusicWindow
            track={audio.currentTrack}
            isPlaying={audio.isPlaying}
            audioTime={audio.audioTime}
            duration={audio.duration}
            onSeek={audio.seek}
            onTogglePlay={audio.togglePlay}
            onNext={audio.nextTrack}
            onPrevious={audio.previousTrack}
          />
        );
    }
  };

  return (
    <Desktop onOpenWindow={windows.openWindow}>
      <audio {...audio.audioProps} />

      <CRT />

      {windows.openWindows
        .filter((windowState) => !windowState.minimized)
        .map((windowState) => (
          <RetroWindow
            key={windowState.id}
            windowState={windowState}
            title={WINDOW_CONFIG[windowState.type].title}
            canMaximize={windowState.type === "about"}
            onFocus={() => windows.bringToFront(windowState.id)}
            onDragStart={(event) => windows.startDragging(event, windowState)}
            onMinimize={() => windows.minimizeWindow(windowState.id)}
            onMaximize={() => windows.toggleMaximize(windowState.id)}
            onClose={() => handleClose(windowState.id)}
          >
            {renderWindowContent(windowState.type)}
          </RetroWindow>
        ))}

      <Taskbar
        windows={windows.openWindows}
        onWindowClick={windows.toggleFromTaskbar}
        volume={audio.volume}
        isMuted={audio.isMuted}
        onToggleMute={audio.toggleMute}
        onVolumeChange={audio.changeVolume}
      />
    </Desktop>
  );
}

export default App;
