/**
 * Dock Component
 *
 * The main navigation and status bar component that appears at the top of the desktop.
 * Provides system status indicators, music controls, time display, and user actions.
 *
 * Features:
 * - Real-time clock display in the center
 * - System status indicators (music, volume, WiFi, battery)
 * - Music playback controls with play/pause functionality
 * - Interactive volume control with slider interface
 * - System status tooltips for user guidance
 * - Logout functionality for session management
 * - Responsive design with hover effects
 * - Linux-themed styling with Arch Linux branding
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Date} props.time - Current system time for display
 * @param {Object} props.systemStatus - System status information
 * @param {boolean} props.systemStatus.hasMusic - Whether music is available
 * @param {boolean} props.systemStatus.musicPlaying - Whether music is currently playing
 * @param {number} props.systemStatus.volume - Current volume level (0-100)
 * @param {boolean} props.systemStatus.wifi - WiFi connection status
 * @param {number} props.systemStatus.battery - Battery percentage (0-100)
 * @param {Function} props.onOpenWindow - Function to open application windows
 * @param {Function} props.onLogout - Function to handle user logout
 * @param {Function} props.toggleMusic - Function to toggle music playback
 * @param {Function} props.adjustVolume - Function to adjust system volume
 * @returns {JSX.Element} The rendered dock component
 * @author Muneer
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Core React imports
import React, { useState } from "react";

// ============================================================================
// DOCK COMPONENT
// ============================================================================
const Dock = ({
  time,
  systemStatus,
  onOpenWindow,
  onLogout,
  toggleMusic,
  adjustVolume,
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Volume control menu visibility state
  const [volumeMenuVisible, setVolumeMenuVisible] = useState(false);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle mouse enter event for volume control
   * Shows the volume control menu when user hovers over volume indicator
   */
  const handleVolumeEnter = () => {
    setVolumeMenuVisible(true);
  };

  /**
   * Handle mouse leave event for volume control
   * Hides the volume control menu with a small delay to allow for menu interaction
   */
  const handleVolumeLeave = () => {
    setTimeout(() => {
      const volumeControls = document.querySelector(".volume-controls");
      const volumeIndicator = document.querySelector(
        ".status-indicator.volume"
      );

      if (
        !volumeControls ||
        (!volumeControls.matches(":hover") &&
          !volumeIndicator.matches(":hover"))
      ) {
        setVolumeMenuVisible(false);
      }
    }, 100);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="dock">
      {/* ================================================================== */}
      {/* LEFT SECTION - BRANDING */}
      {/* ================================================================== */}
      <div className="dock-left">
        <div className="dock-item logo">
          <span>🐧</span>
          <div className="tooltip">Arch Linux</div>
        </div>
        <div className="dock-separator"></div>
      </div>
      {/* ================================================================== */}
      {/* CENTER SECTION - TIME DISPLAY */}
      {/* ================================================================== */}
      <div className="dock-center">
        <span className="time">{time.toLocaleTimeString()}</span>
      </div>
      {/* ================================================================== */}
      {/* RIGHT SECTION - STATUS INDICATORS AND CONTROLS */}
      {/* ================================================================== */}{" "}
      <div className="dock-right">
        <div className="status-indicators">
          {/* Music Player Controls */}
          {systemStatus.hasMusic && (
            <div
              className={`status-indicator music ${
                systemStatus.musicPlaying ? "active" : ""
              }`}
              onClick={toggleMusic}
            >
              <span>{systemStatus.musicPlaying ? "⏸️" : "▶️"}</span>
              <div className="tooltip">
                {systemStatus.musicPlaying ? "Pause" : "Play"}
              </div>
            </div>
          )}

          {/* No Music Available Indicator */}
          {!systemStatus.hasMusic && (
            <div className="status-indicator music disabled">
              <span>🚫</span>
              <div className="tooltip">No Music Available</div>
            </div>
          )}

          {/* Volume Control with Interactive Slider */}
          <div
            className="status-indicator volume"
            onMouseEnter={handleVolumeEnter}
            onMouseLeave={handleVolumeLeave}
          >
            <span>🔊</span>
            <div className="tooltip">Volume: {systemStatus.volume}%</div>
            {volumeMenuVisible && (
              <div
                className="volume-controls"
                onMouseEnter={() => setVolumeMenuVisible(true)}
                onMouseLeave={() => setVolumeMenuVisible(false)}
              >
                <button onClick={() => adjustVolume(-5)}>-</button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={systemStatus.volume}
                  onChange={(e) =>
                    adjustVolume(Number(e.target.value) - systemStatus.volume)
                  }
                  className="dock-volume-slider"
                />
                <span>{systemStatus.volume}%</span>
                <button onClick={() => adjustVolume(5)}>+</button>
              </div>
            )}
          </div>

          {/* WiFi Connection Status */}
          <div className="status-indicator wifi">
            <span>{systemStatus.wifi ? "📶" : "📵"}</span>
            <div className="tooltip">
              {systemStatus.wifi ? "Connected" : "Disconnected"}
            </div>
          </div>

          {/* Battery Level Indicator */}
          <div className="status-indicator battery">
            <span>🔋</span>
            <div className="tooltip">
              Battery: {Math.round(systemStatus.battery)}%
            </div>
            <div className="battery-level">
              {Math.round(systemStatus.battery)}%
            </div>
          </div>
        </div>

        {/* User Session Controls */}
        <button className="logout-btn" onClick={onLogout} title="Logout">
          🔒
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default Dock;
