import { useRef, useState } from "react";
import "./VolumeControl.css";

/** How long the cursor must hover before the slider pops up (ms). */
const POPUP_HOVER_DELAY = 1500;

type VolumeControlProps = {
  volume: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
};

function VolumeControl({
  volume,
  isMuted,
  onToggleMute,
  onVolumeChange,
}: VolumeControlProps) {
  const hoverTimeoutRef = useRef<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
      setShowPopup(true);
    }, POPUP_HOVER_DELAY);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    setShowPopup(false);
  };

  return (
    <div
      className="volume-control"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="volume-button"
        onClick={onToggleMute}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {showPopup && (
        <div className="volume-popup">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            className="volume-slider"
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  );
}

export default VolumeControl;
