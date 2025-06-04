/**
 * MusicPlayer Component
 *
 * A fully functional audio player with vinyl record visual effects and comprehensive controls.
 * Features include:
 * - Audio playback with native HTML5 audio element
 * - Playlist management and track navigation
 * - Animated vinyl record visualization
 * - Volume control with popup interface
 * - Progress tracking and seeking
 * - Integration with global music manager
 * - Support for multiple audio formats
 * - Auto-loading tracks from file system
 *
 * @author Muneer
 * @component
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Core React imports
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";

// Utility and style imports
import { loadFileSystem } from "../utils/fileSystemLoader";
import "../styles/music-player.css";

// Music manager imports
import {
  registerPlayer,
  unregisterPlayer,
  playPlayer,
  togglePlayer,
  setCurrentMusicPath,
  setVolume,
} from "../utils/musicManager";

// ============================================================================
// MUSICPLAYER COMPONENT
// ============================================================================

/**
 * MusicPlayer Component
 *
 * @param {Object} props - Component props
 * @param {string} props.filePath - Path to the music file or directory
 * @param {string} props.playerId - Unique identifier for this player instance
 * @param {Function} props.onPlayerStatusChange - Callback for player status changes
 * @param {number} props.systemVolume - System-wide volume setting
 * @param {Function} props.onVolumeChange - Callback for volume changes
 * @returns {JSX.Element} MusicPlayer component
 */
const MusicPlayer = ({
  filePath,
  playerId,
  onPlayerStatusChange,
  systemVolume,
  onVolumeChange,
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Track and playlist state
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Volume and UI state
  const [volume, setVolumeState] = useState(systemVolume || 75);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  // ============================================================================
  // REFS
  // ============================================================================

  const audioRef = useRef(new Audio());
  const volumeControlRef = useRef(null);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  /**
   * Play a specific track by index
   * @param {number} index - Index of the track to play
   */
  const playTrack = useCallback(
    (index) => {
      const audio = audioRef.current;

      if (
        !tracks ||
        tracks.length === 0 ||
        index < 0 ||
        index >= tracks.length ||
        !tracks[index]
      ) {
        return;
      }

      audio.pause();

      let basePath;
      if (filePath) {
        const currentFileName = filePath.split("/").pop();
        basePath = filePath.replace(currentFileName, tracks[index]);
      } else {
        basePath = `/home/muneer/Music/${tracks[index]}`;
      }
      if (!basePath) return;

      audio.src = basePath;
      setCurrentMusicPath(basePath);
      playPlayer(playerId);
    },
    [filePath, tracks, playerId]
  );

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Initialize audio player and event listeners
   */
  useEffect(() => {
    const audio = audioRef.current;
    registerPlayer(playerId, audio);

    const onPlay = () => {
      setIsPlaying(true);
      onPlayerStatusChange(playerId, true);
    };
    const onPause = () => {
      setIsPlaying(false);
      onPlayerStatusChange(playerId, false);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);

    const onEnded = () => {
      if (tracks.length === 0) return;
      if (currentIndex < tracks.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        playTrack(currentIndex);
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      unregisterPlayer(playerId);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [playerId, onPlayerStatusChange, tracks, currentIndex, playTrack]);
  /**
   * Load tracks from file system when file path changes
   */
  useEffect(() => {
    if (!filePath) {
      loadFileSystem().then((fs) => {
        const musicDir =
          fs["/"]?.children?.home?.children?.muneer?.children?.Music;
        if (musicDir && musicDir.children) {
          const audioExts = ["mp3", "wav", "ogg", "flac", "m4a", "webm"];
          const files = Object.keys(musicDir.children).filter((name) => {
            const ext = name.split(".").pop().toLowerCase();
            return (
              audioExts.includes(ext) && musicDir.children[name].type === "file"
            );
          });
          setTracks(files);
          const defaultIdx = files.indexOf("_lofi.webm");
          setCurrentIndex(
            defaultIdx >= 0 ? defaultIdx : files.length > 0 ? 0 : -1
          );
        }
      });
      return;
    }

    loadFileSystem().then((fs) => {
      const pathParts = filePath.split("/").filter((p) => p);
      const fileName = pathParts.pop();
      let dir = fs["/"];

      for (const part of pathParts) {
        if (dir && dir.children && dir.children[part]) {
          dir = dir.children[part];
        } else {
          dir = null;
          break;
        }
      }

      const audioExts = ["mp3", "wav", "ogg", "flac", "m4a", "webm"];
      const files =
        dir && dir.children
          ? Object.keys(dir.children).filter((name) => {
              const ext = name.split(".").pop().toLowerCase();
              return (
                audioExts.includes(ext) && dir.children[name].type === "file"
              );
            })
          : [];

      setTracks(files);
      const idx = files.indexOf(fileName);
      setCurrentIndex(idx >= 0 ? idx : files.length > 0 ? 0 : -1);
    });
  }, [filePath]);

  /**
   * Play track when current index changes
   */
  useEffect(() => {
    if (
      tracks.length === 0 ||
      currentIndex < 0 ||
      currentIndex >= tracks.length
    ) {
      return;
    }
    playTrack(currentIndex);
  }, [tracks, currentIndex, playTrack]);

  /**
   * Auto-start music when component mounts with a specific file path
   */
  useEffect(() => {
    if (filePath && tracks.length > 0 && currentIndex >= 0) {
      setTimeout(() => {
        playPlayer(playerId);
      }, 500);
    }
  }, [filePath, tracks, currentIndex, playerId]);

  /**
   * Sync volume with system volume
   */
  useEffect(() => {
    if (systemVolume !== undefined && systemVolume !== volume) {
      setVolumeState(systemVolume);
      setVolume(systemVolume / 100);
    }
  }, [systemVolume]);

  /**
   * Close volume control when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        volumeControlRef.current &&
        !volumeControlRef.current.contains(event.target)
      ) {
        setShowVolumeControl(false);
      }
    };

    if (showVolumeControl) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showVolumeControl]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle play/pause button click
   */
  const handlePlayPause = () => {
    togglePlayer(playerId);
  };

  /**
   * Handle next track button click
   */
  const handleNext = () => {
    if (tracks.length === 0) return;
    setCurrentIndex((i) => (i + 1) % tracks.length);
  };

  /**
   * Handle previous track button click
   */
  const handlePrev = () => {
    if (tracks.length === 0) return;
    setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length);
  };

  /**
   * Handle progress bar seeking
   * @param {Event} e - Change event from progress slider
   */
  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  /**
   * Handle volume change
   * @param {Event} e - Change event from volume slider
   */
  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume / 100);
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
  };

  /**
   * Toggle volume control popup visibility
   */
  const toggleVolumeControl = () => {
    setShowVolumeControl(!showVolumeControl);
  };
  /**
   * Get appropriate volume icon based on current volume
   * @returns {JSX.Element} Volume icon component
   */
  const getVolumeIcon = () => {
    if (volume === 0) return <FaVolumeMute />;
    return <FaVolumeUp />;
  };

  /**
   * Format time in MM:SS format
   * @param {number} time - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (time) => {
    if (isNaN(time) || time === Infinity) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="music-player">
      <div className="music-header">
        <h3>
          🎵{" "}
          {tracks[currentIndex]
            ? tracks[currentIndex].split(".").slice(0, -1).join(".") ||
              tracks[currentIndex]
            : "No Track Selected"}
        </h3>
      </div>

      <div className="vinyl-container">
        <div className={`vinyl ${isPlaying ? "spinning" : ""}`}>
          <div className="vinyl-label vinyl-note-1">🎵</div>
          <div className="vinyl-label vinyl-note-2">♪</div>
          <div className="vinyl-label vinyl-note-3">♫</div>
          <div className="vinyl-label vinyl-note-4">♩</div>
          <div className="vinyl-label vinyl-note-5">♬</div>
          <div className="vinyl-label vinyl-note-7">♭</div>
          <div className="vinyl-marker"></div>
        </div>
      </div>
      <div className="bottom-controls">
        <div className="progress-container">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
          />
          <span>{formatTime(duration)}</span>
        </div>

        <div className="controls-row">
          {" "}
          <div className="main-controls">
            <button onClick={handlePrev}>
              <FaStepBackward />
            </button>
            <button onClick={handlePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={handleNext}>
              <FaStepForward />
            </button>
          </div>
          <div className="volume-button-container" ref={volumeControlRef}>
            <button onClick={toggleVolumeControl} className="volume-button">
              {getVolumeIcon()}
            </button>
            {showVolumeControl && (
              <div className="volume-popup">
                <div className="vertical-volume-container">
                  <span className="volume-percentage">{volume}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="vertical-volume-slider"
                    orient="vertical"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
