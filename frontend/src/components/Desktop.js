/**
 * Desktop Component
 *
 * Renders the desktop interface with application icons and handles
 * launching applications when icons are clicked.
 *
 * @author Muneer Alam
 * @component
 */

import React from "react";
import { FaTerminal, FaFolder, FaEdit, FaGlobe, FaMusic } from "react-icons/fa";

const Desktop = ({ onOpenWindow }) => {
  const desktopIcons = [
    {
      id: "terminal",
      icon: <FaTerminal />,
      name: "Terminal",
      position: { x: 50, y: 100 },
    },
    {
      id: "filemanager",
      icon: <FaFolder />,
      name: "Files",
      position: { x: 50, y: 200 },
    },
    {
      id: "texteditor",
      icon: <FaEdit />,
      name: "Text Editor",
      position: { x: 50, y: 300 },
    },
    {
      id: "browser",
      icon: <FaGlobe />,
      name: "Browser",
      position: { x: 50, y: 400 },
    },
    {
      id: "musicplayer",
      icon: <FaMusic />,
      name: "Music",
      position: { x: 50, y: 500 },
    },
  ];

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle desktop icon click events
   *
   * @param {string} iconId - The ID of the clicked icon
   */
  const handleIconClick = (iconId) => {
    if (iconId === "musicplayer") {
      // Open music player with default music directory path (pointing to _lofi.webm)
      onOpenWindow(iconId, "/home/muneer/Music/_lofi.webm");
    } else {
      onOpenWindow(iconId);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="desktop-icons">
      {desktopIcons.map((iconItem) => (
        <div
          key={iconItem.id}
          className="desktop-icon"
          style={{
            position: "absolute",
            left: iconItem.position.x,
            top: iconItem.position.y,
          }}
          onClick={() => handleIconClick(iconItem.id)}
          role="button"
          aria-label={`Open ${iconItem.name}`}
          tabIndex={0}
        >
          <div className="icon">{iconItem.icon}</div>
          <span>{iconItem.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Desktop;
