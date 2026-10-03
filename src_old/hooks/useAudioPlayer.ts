import { useEffect, useRef, useState } from "react";
import { INITIAL_TRACK_INDEX, playlist } from "../data/playlist";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldAutoplayRef = useRef(true);

  const [currentTrackIndex, setCurrentTrackIndex] =
    useState(INITIAL_TRACK_INDEX);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const currentTrack = playlist[currentTrackIndex];

  /* --------------------------------
     Controls
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

  /** Pause and rewind (used when the music window is closed). */
  const stop = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPlaying(false);
    setAudioTime(0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const seek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }

    setAudioTime(newTime);
  };

  /*
   * Changes to another track. Shuffle is always enabled, so the
   * supplied index is normally random. Playback itself happens in the
   * currentTrackIndex effect below, after React has updated <audio>'s src.
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

    let newIndex = Math.floor(Math.random() * playlist.length);

    // Don't immediately play the same song.
    while (newIndex === currentTrackIndex) {
      newIndex = Math.floor(Math.random() * playlist.length);
    }

    return newIndex;
  };

  const nextTrack = () => changeTrack(getRandomTrackIndex());
  const previousTrack = () => changeTrack(getRandomTrackIndex());

  /* --------------------------------
     Change audio source / autoplay
  -------------------------------- */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.load();

    const shouldPlay =
      shouldAutoplayRef.current ||
      currentTrackIndex === INITIAL_TRACK_INDEX;

    if (!shouldPlay) {
      return;
    }

    shouldAutoplayRef.current = false;

    const playNewTrack = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Unable to play new track:", error);
        setIsPlaying(false);
      }
    };

    void playNewTrack();
  }, [currentTrackIndex]);

  /* --------------------------------
     Start music on first interaction (autoplay policy)
  -------------------------------- */

  useEffect(() => {
    const startMusicOnInteraction = () => {
      const audio = audioRef.current;

      if (!audio || !audio.paused) {
        return;
      }

      void audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Browser still refused playback.
        });
    };

    window.addEventListener("pointerdown", startMusicOnInteraction, {
      once: true,
    });

    return () => {
      window.removeEventListener("pointerdown", startMusicOnInteraction);
    };
  }, []);

  /* --------------------------------
     Props to spread onto the <audio> element
  -------------------------------- */

  const audioProps = {
    ref: audioRef,
    src: currentTrack.src,
    onTimeUpdate: () => {
      if (audioRef.current) {
        setAudioTime(audioRef.current.currentTime);
      }
    },
    onLoadedMetadata: () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    },
    onPlay: () => setIsPlaying(true),
    onPause: () => setIsPlaying(false),
    // Shuffle is always enabled: pick a different random track.
    onEnded: () => changeTrack(getRandomTrackIndex()),
  };

  return {
    audioProps,
    currentTrack,
    isPlaying,
    audioTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    stop,
    toggleMute,
    changeVolume,
    seek,
    nextTrack,
    previousTrack,
  };
}
