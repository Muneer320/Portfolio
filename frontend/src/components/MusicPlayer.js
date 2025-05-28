import React, { useState, useRef, useEffect } from "react";
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
  const audioRef = useRef(null);

  // Subscribe to music manager state changes
  useEffect(() => {
    const unsubscribe = musicManager.onStateChange(setMusicState);
    return unsubscribe;
  }, []);

  // Handle specific file opening or use available music
  useEffect(() => {
    const handleTrackSelection = async () => {
      if (filePath && musicState.hasMusic) {
        // Play the specific file that was opened
        const success = await musicManager.playTrack(filePath);
        if (!success) {
          setError("Could not play the selected file");
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
        setCurrentTime(audio.currentTime);
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
  }, [musicState.currentTrack]);

  const handleSeek = (e) => {
    if (!audioRef.current || !isLoaded) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    musicManager.seekTo(newTime);
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

  const handleTrackSelect = async (trackPath) => {
    const success = await musicManager.playTrack(trackPath);
    if (!success) {
      setError("Could not play the selected track");
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
      </div>

      <div className="track-info">
        <h4>{currentTrack?.title || "No Track Selected"}</h4>
        <p>{currentTrack?.name || "Select a track to play"}</p>
        {musicState.isPlaying && !isLoaded && !error && <p>Loading...</p>}
      </div>

      {/* Available tracks list */}
      {musicState.availableMusic.length > 0 && (
        <div className="track-list">
          <h5>Available Tracks:</h5>
          <div className="tracks">
            {musicState.availableMusic.map((track, index) => (
              <div
                key={index}
                className={`track-item ${
                  currentTrack?.path === track.path ? "active" : ""
                }`}
                onClick={() => handleTrackSelect(track.path)}
              >
                <span className="track-icon">🎵</span>
                <span className="track-name">{track.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
          {musicState.isPlaying ? "⏸️" : "▶️"}
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
