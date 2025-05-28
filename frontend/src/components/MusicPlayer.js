import React, { useState, useRef, useEffect } from "react";

const MusicPlayer = ({
  systemStatus,
  onToggleMusic,
  onVolumeChange,
  filePath,
  fileObj,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // If a specific file is passed, use it; otherwise use default tracks
  const defaultTracks = [
    {
      name: "coding-beats.mp3",
      title: "Coding Beats",
      path: "/assets/music/coding-beats.mp3",
    },
    {
      name: "focus-music.mp3",
      title: "Focus Flow",
      path: "/assets/music/focus-music.mp3",
    },
    {
      name: "ambient-sounds.webm",
      title: "Ambient Vibes",
      path: "/assets/music/ambient-sounds.webm",
    },
  ];

  const currentTrackInfo = filePath
    ? {
        name: filePath.split("/").pop(),
        title: filePath
          .split("/")
          .pop()
          .replace(/\.[^/.]+$/, ""), // Remove extension
        path: filePath,
      }
    : defaultTracks[0];

  useEffect(() => {
    if (audioRef.current && currentTrackInfo.path) {
      audioRef.current.src = currentTrackInfo.path;
      audioRef.current.load();
    }
  }, [currentTrackInfo.path]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
      setError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleError = (e) => {
      setError(
        `Error loading audio: ${e.target.error?.message || "Unknown error"}`
      );
      setIsLoaded(false);
    };

    const handleEnded = () => {
      onToggleMusic(); // Stop playing when track ends
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onToggleMusic]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (systemStatus.musicPlaying && isLoaded) {
      audio.play().catch((e) => {
        console.error("Error playing audio:", e);
        setError("Playback failed");
      });
    } else {
      audio.pause();
    }
  }, [systemStatus.musicPlaying, isLoaded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = systemStatus.volume / 100;
    }
  }, [systemStatus.volume]);

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleVolumeSliderChange = (e) => {
    const newVolume = parseInt(e.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div className="music-player">
      <audio ref={audioRef} />

      <div className="player-header">
        <h3>🎵 Music Player</h3>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          <p>File: {currentTrackInfo.path}</p>
        </div>
      )}

      <div className="album-art">
        <div
          className={`vinyl-record ${
            systemStatus.musicPlaying ? "spinning" : ""
          }`}
        >
          🎵
        </div>
      </div>

      <div className="track-info">
        <h4>{currentTrackInfo.title}</h4>
        <p>{currentTrackInfo.name}</p>
        {!isLoaded && !error && <p>Loading...</p>}
      </div>

      <div className="progress-section">
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="progress-bar" onClick={handleSeek}>
          <div
            className="progress-fill"
            style={{
              width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
            }}
          />
        </div>
      </div>

      <div className="player-controls">
        <button className="play-pause" onClick={onToggleMusic}>
          {systemStatus.musicPlaying ? "⏸️" : "▶️"}
        </button>
      </div>

      <div className="volume-control">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={systemStatus.volume}
          onChange={handleVolumeSliderChange}
          className="volume-slider"
        />
        <span>{systemStatus.volume}%</span>
      </div>
    </div>
  );
};

export default MusicPlayer;
