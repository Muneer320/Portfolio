/**
 * LockScreen — First thing a visitor sees.
 *
 * Displays: wallpaper, large clock, name, title, tagline, tap-to-unlock hint.
 * The tap-to-unlock preserves the "borrowed device" feeling without
 * requiring a swipe gesture (which conflicts with browser scroll).
 *
 * @author Muneer Alam
 */

import React, { useState, useEffect } from "react";
import StatusBar from "./StatusBar";

export default function LockScreen({ onUnlock }) {
  const [time, setTime] = useState(new Date());
  const [hintVisible, setHintVisible] = useState(false);

  // Update clock every 30s
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Animate hint in after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setHintVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const timeStr = time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const dateStr = time.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onUnlock();
    }
  };

  return (
    <div
      className="pocket-lockscreen"
      onClick={onUnlock}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Tap or press Enter to unlock and explore the portfolio"
    >
      {/* Wallpaper is applied via CSS background */}
      <div className="pocket-lockscreen-wallpaper" aria-hidden="true" />

      {/* Dim overlay for readability */}
      <div className="pocket-lockscreen-overlay" aria-hidden="true" />

      <StatusBar />

      <div className="pocket-lockscreen-content">
        <div className="pocket-lockscreen-info" aria-hidden="true">
          <span className="pocket-lockscreen-date">{dateStr}</span>
        </div>

        <h1 className="pocket-lockscreen-time" aria-hidden="true">
          {timeStr}
        </h1>

        <div className="pocket-lockscreen-identity">
          <h2 className="pocket-lockscreen-name">Muneer Alam</h2>
          <p className="pocket-lockscreen-title">Software Developer</p>
          <p className="pocket-lockscreen-tagline">
            Building systems that scale
          </p>
        </div>
      </div>

      <div
        className={`pocket-lockscreen-hint ${hintVisible ? "visible" : ""}`}
        aria-hidden="true"
      >
        <span className="pocket-locksense-hint-icon">⬆</span>
        <span>tap to unlock</span>
      </div>
    </div>
  );
}
