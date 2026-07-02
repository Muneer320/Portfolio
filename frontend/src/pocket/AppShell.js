/**
 * AppShell — Standard wrapper for all Pocket Device apps.
 *
 * Provides: header bar with app name, close button, slide-up/down animation.
 * All content apps render inside this shell.
 *
 * @author Muneer Alam
 */

import React, { useEffect, useState } from "react";
import { APPS } from "./data/apps";

export default function AppShell({ appId, onClose, children }) {
  const [visible, setVisible] = useState(false);

  // Slide-up animation on mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const app = APPS.find((a) => a.id === appId);
  const appName = app?.name || "App";

  const handleClose = () => {
    setVisible(false);
    // Allow slide-down animation to play before unmounting
    setTimeout(onClose, 200);
  };

  return (
    <div
      className={`pocket-appshell ${visible ? "pocket-appshell-visible" : ""}`}
      role="dialog"
      aria-label={`${appName} app`}
      aria-modal="true"
    >
      <div className="pocket-appshell-header">
        <button
          className="pocket-appshell-back"
          onClick={handleClose}
          aria-label={`Close ${appName}`}
        >
          <span aria-hidden="true">&larr;</span>
          <span>Home</span>
        </button>
        <h2 className="pocket-appshell-title">{appName}</h2>
        <button
          className="pocket-appshell-close"
          onClick={handleClose}
          aria-label={`Close ${appName}`}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div className="pocket-appshell-content">{children}</div>
    </div>
  );
}
