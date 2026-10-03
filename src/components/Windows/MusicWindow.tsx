import { Fragment } from "react";
import type { ChangeEvent } from "react";
import "./MusicWindow.css";

import windows98Cd from "../../assets/windows98-cd.png";
import type { Track } from "../../data/playlist";

type MusicWindowProps = {
  track: Track;
  isPlaying: boolean;
  audioTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

function formatTime(time: number) {
  if (!Number.isFinite(time)) {
    return "0:00";
  }

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** One half of the seamless scrolling title (the other half is a copy). */
function TitleSequence({
  title,
  hidden = false,
}: {
  title: string;
  hidden?: boolean;
}) {
  return (
    <span
      className="music-track-title-sequence"
      aria-hidden={hidden || undefined}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Fragment key={index}>
          {title} <b>•</b>{" "}
        </Fragment>
      ))}
    </span>
  );
}

function MusicWindow({
  track,
  isPlaying,
  audioTime,
  duration,
  onSeek,
  onTogglePlay,
  onNext,
  onPrevious,
}: MusicWindowProps) {
  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(event.target.value));
  };

  return (
    <div className="music-window-content">
      <div className="music-screen">
        <img className="music-cd" src={windows98Cd} alt="Windows 98 CD" />

        <div className="music-track-info">
          <div className="music-track-title">
            <div className="music-track-title-scroll">
              <TitleSequence title={track.title} />
              <TitleSequence title={track.title} hidden />
            </div>
          </div>

          <div className="music-track-artist">{track.artist}</div>
        </div>

        <div className="music-progress-area">
          <input
            className="music-progress"
            type="range"
            min="0"
            max={duration || 0}
            value={audioTime}
            onChange={handleSeek}
          />

          <div className="music-time">
            <span>{formatTime(audioTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="music-controls">
          <button type="button" onClick={onPrevious} title="Previous track">
            |◀
          </button>

          <button
            type="button"
            className="music-play-button"
            onClick={onTogglePlay}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "Ⅱ" : "▶"}
          </button>

          <button type="button" onClick={onNext} title="Next track">
            ▶|
          </button>
        </div>
      </div>
    </div>
  );
}

export default MusicWindow;
