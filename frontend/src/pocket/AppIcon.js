/**
 * AppIcon — Single app icon on the home screen grid.
 *
 * Renders: icon emoji, app name, optional badge count.
 * Handles tap to open and keyboard activation.
 *
 * @author Muneer Alam
 */

import React from "react";

export default function AppIcon({ app, onOpen }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(app.id);
    }
  };

  return (
    <div
      className="pocket-app-icon"
      onClick={() => onOpen(app.id)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open ${app.name}`}
    >
      <div className="pocket-app-icon-image" aria-hidden="true">
        {app.icon}
        {app.badge != null && (
          <span className="pocket-app-icon-badge">{app.badge}</span>
        )}
      </div>
      <span className="pocket-app-icon-label">{app.name}</span>
    </div>
  );
}
