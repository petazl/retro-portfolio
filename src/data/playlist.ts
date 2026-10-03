import aNightAlone from "../assets/music/A Night Alone -TrackTribe.mp3";
import entranceWreath from "../assets/music/Entrance Wreath - Chika.mp3";
import localElevator from "../assets/music/Local Elevator - Kevin MacLeod.mp3";
import muscatAndWhiteDishes from "../assets/music/Muscat and White Dishes - Takahashi Takashi.mp3";
import relaxedScene from "../assets/music/Relaxed Scene - James Clarke.mp3";
import summerSkyAndHomework from "../assets/music/Summer Sky and Homework - Takahashi Takashi.mp3";
import windTrail from "../assets/music/Wind Trail - Chika.mp3";

export type Track = {
  title: string;
  artist: string;
  src: string;
};

export const playlist: Track[] = [
  { title: "A Night Alone", artist: "TrackTribe", src: aNightAlone },
  { title: "Entrance Wreath", artist: "Chika", src: entranceWreath },
  { title: "Local Elevator", artist: "Kevin MacLeod", src: localElevator },
  {
    title: "Muscat and White Dishes",
    artist: "Takahashi Takashi",
    src: muscatAndWhiteDishes,
  },
  { title: "Relaxed Scene", artist: "James Clarke", src: relaxedScene },
  {
    title: "Summer Sky and Homework",
    artist: "Takahashi Takashi",
    src: summerSkyAndHomework,
  },
  { title: "Wind Trail", artist: "Chika", src: windTrail },
];

/** Track that plays first ("Relaxed Scene"). */
export const INITIAL_TRACK_INDEX = 4;
