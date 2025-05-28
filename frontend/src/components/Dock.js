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

  const handleVolumeLeave = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (y > rect.bottom + 10) {
      // Don't hide immediately, let volume controls handle it
      setTimeout(() => {
        if (!document.querySelector(".volume-controls:hover")) {
          setVolumeMenuVisible(false);
        }
      }, 100);
    } else {
      setVolumeMenuVisible(false);
    }
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
      </div>

      <div className="dock-right">
        {" "}
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
          )}

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
                <button onClick={() => adjustVolume(-10)}>-</button>
                <span>{systemStatus.volume}%</span>
                <button onClick={() => adjustVolume(10)}>+</button>
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
          ⏻
        </button>
      </div>
    </div>
  );
};

export default Dock;
