import aboutMeIcon from "../assets/about-me.png";
import socialIcon from "../assets/social.png";
import windows98Cd from "../assets/windows98-cd.png";

import type { WindowType } from "../types/windows";

export type WindowConfig = {
  /** Title shown in the title bar and taskbar */
  title: string;
  /** Label under the desktop icon */
  desktopLabel: string;
  icon: string;
  /** Used to centre newly opened windows */
  width: number;
  height: number;
};

export const WINDOW_CONFIG: Record<WindowType, WindowConfig> = {
  about: {
    title: "About Me",
    desktopLabel: "About Me",
    icon: aboutMeIcon,
    width: 620,
    height: 500,
  },
  social: {
    title: "Social",
    desktopLabel: "Social",
    icon: socialIcon,
    width: 620,
    height: 300,
  },
  music: {
    title: "Music Player",
    desktopLabel: "Music",
    icon: windows98Cd,
    width: 320,
    height: 320,
  },
};

/** Order of the icons on the desktop. */
export const DESKTOP_ICON_ORDER: WindowType[] = ["about", "social", "music"];
