import "./Taskbar.css";

import { WINDOW_CONFIG } from "../../data/windowConfig";
import type { WindowState, WindowType } from "../../types/windows";
import Clock from "./Clock";
import VolumeControl from "./VolumeControl";

type TaskbarProps = {
  windows: WindowState[];
  onWindowClick: (id: WindowType) => void;
  volume: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
};

function Taskbar({
  windows,
  onWindowClick,
  volume,
  isMuted,
  onToggleMute,
  onVolumeChange,
}: TaskbarProps) {
  return (
    <div className="taskbar">
      <button className="start-button">
        <strong>Start</strong>
      </button>

      <div className="taskbar-windows">
        {windows.map((windowState) => {
          const { title, icon } = WINDOW_CONFIG[windowState.type];

          return (
            <button
              key={windowState.id}
              className={`taskbar-app ${
                windowState.minimized ? "" : "taskbar-window-active"
              }`}
              onClick={() => onWindowClick(windowState.id)}
            >
              <img className="taskbar-app-icon" src={icon} alt="" />

              <span>{title}</span>
            </button>
          );
        })}
      </div>

      <div className="taskbar-system-tray">
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
          onVolumeChange={onVolumeChange}
        />

        <Clock />
      </div>
    </div>
  );
}

export default Taskbar;
