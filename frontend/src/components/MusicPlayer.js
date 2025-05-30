import React, { useState, useRef, useEffect, useCallback } from "react";
import musicManager from "../utils/musicManager";

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
  const [musicState, setMusicState] = useState(musicManager.getState());
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  // Subscribe to music manager state changes
  useEffect(() => {
    const unsubscribe = musicManager.onStateChange(setMusicState);
    return unsubscribe;
  }, []);

  // Debug logging for received props
  useEffect(() => {
    if (filePath) {
      console.log("MusicPlayer: Received filePath:", filePath);
      console.log("MusicPlayer: fileObj:", fileObj);
    }
  }, [filePath, fileObj]);
  // Handle specific file opening or use available music
  useEffect(() => {
    const handleTrackSelection = async () => {
      if (filePath && musicState.hasMusic) {
        console.log("MusicPlayer: Attempting to play file:", filePath);
        // Play the specific file that was opened
        const success = await musicManager.playTrack(filePath);
        if (!success) {
          setError(
            `Could not play the selected file: ${filePath.split("/").pop()}`
          );
        } else {
          setError(null); // Clear any previous errors
        }
      }
    };

    handleTrackSelection();
  }, [filePath, musicState.hasMusic]);

  // Update audio reference when track changes
  useEffect(() => {
    const audio = musicManager.getCurrentAudio();
    audioRef.current = audio;

    if (audio) {
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setIsLoaded(true);
        setError(null);
      };
      const handleTimeUpdate = () => {
        if (!isDragging) {
          setCurrentTime(audio.currentTime);
        }
      };

      const handleError = (e) => {
        setError(
          `Error loading audio: ${e.target.error?.message || "Unknown error"}`
        );
        setIsLoaded(false);
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("error", handleError);

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("error", handleError);
      };
    } else {
      setIsLoaded(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [musicState.currentTrack, isDragging]);

  const handleSeek = useCallback(
    (e) => {
      if (!audioRef.current || !isLoaded) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;

      musicManager.seekTo(newTime);
      setCurrentTime(newTime);
    },
    [isLoaded, duration]
  );

  const handleMouseDown = useCallback(
    (e) => {
      if (!audioRef.current || !isLoaded) return;
      setIsDragging(true);
      handleSeek(e);
    },
    [isLoaded, handleSeek]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !audioRef.current || !isLoaded) return;
      handleSeek(e);
    },
    [isDragging, isLoaded, handleSeek]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
  const handleNext = async () => {
    const success = await musicManager.playNext();
    if (!success) {
      setError("Could not play next track");
    }
  };

  const handlePrevious = async () => {
    const success = await musicManager.playPrevious();
    if (!success) {
      setError("Could not play previous track");
    }
  };

  // If no music is available, show appropriate message
  if (!musicState.hasMusic) {
    return (
      <div className="music-player">
        <div className="player-header">
          <h3>🎵 Music Player</h3>
        </div>

        <div className="no-music-message">
          <div className="no-music-icon">🎵</div>
          <h4>No Music Available</h4>
          <p>No music files were found in the system.</p>
          <p>Music files should be located in:</p>
          <code>/home/muneer/Music/</code>
        </div>
      </div>
    );
  }

  const currentTrack = musicState.currentTrack || musicState.availableMusic[0];
  return (
    <div className="music-player">
      <div className="player-header">
        <h3>🎵 Music Player</h3>
      </div>
      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          {currentTrack && <p>File: {currentTrack.path}</p>}
        </div>
      )}
      <div className="album-art">
        <div
          className={`vinyl-record ${musicState.isPlaying ? "spinning" : ""}`}
        >
          🎵
        </div>
      </div>{" "}
      <div className="track-info">
        <h4>{currentTrack?.title || "No Track Selected"}</h4>
        {musicState.isPlaying && !isLoaded && !error && <p>Loading...</p>}
        {musicState.availableMusic.length > 1 && (
          <p className="track-count">
            Track{" "}
            {musicState.availableMusic.findIndex(
              (t) => t.path === currentTrack?.path
            ) + 1 || 1}{" "}
            of {musicState.availableMusic.length}
          </p>
        )}
      </div>
      <div className="progress-section">
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>{" "}
        <div
          className="progress-bar"
          ref={progressBarRef}
          onClick={handleSeek}
          onMouseDown={handleMouseDown}
        >
          <div
            className="progress-fill"
            style={{
              width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
            }}
          />
          <div
            className="progress-thumb"
            style={{
              left: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
            }}
          />
        </div>
      </div>{" "}
      <div className="player-controls">
        <button
          className="prev-btn"
          onClick={handlePrevious}
          disabled={
            !musicState.hasMusic || musicState.availableMusic.length <= 1
          }
          title="Previous Track"
        >
          ⏮️
        </button>
        <button className="play-pause" onClick={onToggleMusic}>
          {musicState.isPlaying ? "⏸️" : "▶️"}
        </button>
        <button
          className="next-btn"
          onClick={handleNext}
          disabled={
            !musicState.hasMusic || musicState.availableMusic.length <= 1
          }
          title="Next Track"
        >
          ⏭️
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
