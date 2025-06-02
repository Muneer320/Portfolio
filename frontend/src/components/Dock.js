import React, { useState } from "react";

const Dock = ({
  time,
  systemStatus,
  onOpenWindow,
  onLogout,
  toggleMusic,
  adjustVolume,
}) => {
  const [volumeMenuVisible, setVolumeMenuVisible] = useState(false);
  const handleVolumeEnter = () => {
    setVolumeMenuVisible(true);
  };

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

  return (
    <div className="dock">
      <div className="dock-left">
        <div className="dock-item logo">
          <span>🐧</span>
          <div className="tooltip">Arch Linux</div>
        </div>
        <div className="dock-separator"></div>
      </div>
      <div className="dock-center">
        <span className="time">{time.toLocaleTimeString()}</span>
      </div>{" "}
      <div className="dock-right">
        <div className="status-indicators">
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
          {!systemStatus.hasMusic && (
            <div className="status-indicator music disabled">
              <span>🚫</span>
              <div className="tooltip">No Music Available</div>
            </div>
          )}{" "}
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
          <div className="status-indicator wifi">
            <span>{systemStatus.wifi ? "📶" : "📵"}</span>
            <div className="tooltip">
              {systemStatus.wifi ? "Connected" : "Disconnected"}
            </div>
          </div>
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
        <button className="logout-btn" onClick={onLogout} title="Logout">
          🔒
        </button>
      </div>
    </div>
  );
};

export default Dock;
