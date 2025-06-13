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
 * @author Muneer
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Core React imports
import React, { useState, useEffect } from "react";
import {
  FaMusic,
  FaVolumeUp,
  FaVolumeMute,
  FaWifi,
  FaBatteryFull,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaPlug,
  FaLinux,
  FaLock,
  FaInfoCircle,
  FaDesktop,
  FaClock,
} from "react-icons/fa";

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

  // System info panel visibility state
  const [systemInfoVisible, setSystemInfoVisible] = useState(false);
  // Real battery information state
  const [batteryInfo, setBatteryInfo] = useState({
    level: systemStatus.battery || 85, // Default fallback value
    charging: false,
    chargingTime: null,
    dischargingTime: null,
    supported: false,
  });

  // System information state
  const [systemInfo, setSystemInfo] = useState({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    onlineStatus: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
    screenResolution: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  // ============================================================================
  // EFFECTS - BATTERY API AND SYSTEM MONITORING
  // ============================================================================

  /**
   * Initialize Battery API and monitor battery status
   */
  useEffect(() => {
    const initBatteryAPI = async () => {
      // Check if Battery API is supported
      if ("getBattery" in navigator) {
        try {
          const battery = await navigator.getBattery();

          setBatteryInfo({
            level: Math.round(battery.level * 100),
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
            supported: true,
          });

          // Add event listeners for battery changes
          const updateBatteryInfo = () => {
            setBatteryInfo({
              level: Math.round(battery.level * 100),
              charging: battery.charging,
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime,
              supported: true,
            });
          };

          battery.addEventListener("chargingchange", updateBatteryInfo);
          battery.addEventListener("levelchange", updateBatteryInfo);
          battery.addEventListener("chargingtimechange", updateBatteryInfo);
          battery.addEventListener("dischargingtimechange", updateBatteryInfo);

          // Cleanup listeners
          return () => {
            battery.removeEventListener("chargingchange", updateBatteryInfo);
            battery.removeEventListener("levelchange", updateBatteryInfo);
            battery.removeEventListener(
              "chargingtimechange",
              updateBatteryInfo
            );
            battery.removeEventListener(
              "dischargingtimechange",
              updateBatteryInfo
            );
          };
        } catch (error) {
          console.log("Battery API not supported or failed:", error);
          // Fallback to simulated battery with default values
          setBatteryInfo((prev) => ({
            ...prev,
            level: systemStatus.battery || 85,
            supported: false,
          }));
        }
      } else {
        // Battery API not available, use fallback
        console.log("Battery API not available in this browser");
        setBatteryInfo((prev) => ({
          ...prev,
          level: systemStatus.battery || 85,
          supported: false,
        }));
      }
    };

    initBatteryAPI();
  }, [systemStatus.battery]);
  /**
   * Monitor online status and update system info
   */
  useEffect(() => {
    const updateOnlineStatus = () => {
      setSystemInfo((prev) => ({
        ...prev,
        onlineStatus: navigator.onLine,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      }));
    };

    const updateViewport = () => {
      setSystemInfo((prev) => ({
        ...prev,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      }));
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

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

  /**
   * Handle system info panel visibility
   */
  const handleSystemInfoEnter = () => {
    setSystemInfoVisible(true);
  };

  const handleSystemInfoLeave = () => {
    setTimeout(() => {
      const systemInfoPanel = document.querySelector(".system-info-panel");
      const systemInfoIndicator = document.querySelector(
        ".status-indicator.system-info"
      );

      if (
        !systemInfoPanel ||
        (!systemInfoPanel.matches(":hover") &&
          !systemInfoIndicator.matches(":hover"))
      ) {
        setSystemInfoVisible(false);
      }
    }, 100);
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Get appropriate battery icon based on level and charging status
   */
  const getBatteryIcon = () => {
    const level = batteryInfo.supported
      ? batteryInfo.level
      : systemStatus.battery;

    if (batteryInfo.charging) {
      return <FaPlug />;
    }

    if (level > 75) {
      return <FaBatteryFull />;
    } else if (level > 25) {
      return <FaBatteryHalf />;
    } else {
      return <FaBatteryQuarter />;
    }
  };
  /**
   * Get battery status tooltip text
   */
  const getBatteryTooltip = () => {
    const level = batteryInfo.supported
      ? batteryInfo.level
      : Math.round(systemStatus.battery);
    const status = batteryInfo.charging ? " (Charging)" : "";
    const apiStatus = batteryInfo.supported ? "" : " (Simulated)";
    return `Battery: ${level}%${status}${apiStatus}`;
  };

  /**
   * Format time remaining for battery
   */
  const formatBatteryTime = (seconds) => {
    if (!seconds || seconds === Infinity) return "Unknown";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="dock">
      <div className="dock-left">
        <div className="dock-item logo">
          <span>
            <FaLinux />
          </span>
          <div className="tooltip">Arch Linux</div>
        </div>
        <div className="dock-separator"></div>
      </div>

      <div className="dock-center">
        <span className="time">{time.toLocaleTimeString()}</span>
      </div>

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
              <span>
                {systemStatus.musicPlaying ? <FaMusic /> : <FaMusic />}
              </span>
              <div className="tooltip">
                {systemStatus.musicPlaying ? "Pause" : "Play"}
              </div>
            </div>
          )}{" "}
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
            <span>
              {systemStatus.volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
            </span>
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
            )}{" "}
          </div>{" "}
          {/* System Information Panel */}
          <div
            className="status-indicator system-info"
            onMouseEnter={handleSystemInfoEnter}
            onMouseLeave={handleSystemInfoLeave}
          >
            <span>
              <FaInfoCircle />
            </span>
            <div className="tooltip">System Information</div>
            {systemInfoVisible && (
              <div
                className="system-info-panel"
                onMouseEnter={() => setSystemInfoVisible(true)}
                onMouseLeave={handleSystemInfoLeave}
              >
                <div className="system-info-section">
                  <h4>Network Status</h4>
                  <div className="info-item">
                    <FaWifi />
                    <span>
                      {systemInfo.onlineStatus ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="system-info-section">
                  <h4>Display</h4>
                  <div className="info-item">
                    <FaDesktop />
                    <span>{systemInfo.viewport}</span>
                  </div>
                  <div className="info-item">
                    <span>Screen: {systemInfo.screenResolution}</span>
                  </div>
                </div>

                <div className="system-info-section">
                  <h4>System</h4>
                  <div className="info-item">
                    <span>Platform: {systemInfo.platform}</span>
                  </div>
                  <div className="info-item">
                    <FaClock />
                    <span>{systemInfo.timezone}</span>
                  </div>
                  <div className="info-item">
                    <span>Language: {systemInfo.language}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Enhanced Battery Level Indicator */}
          <div className="status-indicator battery">
            <span
              style={{
                color:
                  batteryInfo.supported && batteryInfo.level < 20
                    ? "#ff4444"
                    : batteryInfo.charging
                    ? "#4ade80"
                    : "white",
              }}
            >
              {getBatteryIcon()}
            </span>
            <div className="tooltip">{getBatteryTooltip()}</div>
            <div className="battery-level">
              {batteryInfo.supported
                ? batteryInfo.level
                : Math.round(systemStatus.battery)}
              %
              {batteryInfo.supported && batteryInfo.charging && (
                <span className="charging-indicator">⚡</span>
              )}
            </div>
            {batteryInfo.supported && (
              <div className="battery-details">
                {batteryInfo.charging ? (
                  <span>
                    Charging - {formatBatteryTime(batteryInfo.chargingTime)} to
                    full
                  </span>
                ) : (
                  <span>
                    {formatBatteryTime(batteryInfo.dischargingTime)} remaining
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* User Session Controls */}
        <button className="logout-btn" onClick={onLogout} title="Logout">
          <FaLock />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default Dock;
