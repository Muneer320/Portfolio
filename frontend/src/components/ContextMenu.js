/**
 * ContextMenu Component
 *
 * Custom right-click context menu that enhances the OS simulation feel.
 * Provides quick-access actions themed around the Arch Linux desktop.
 *
 * @author Muneer Alam
 * @component
 */
import React, { useState, useEffect, useRef } from "react";

const ContextMenu = ({ onOpenWindow, children }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    const handleContextMenu = (e) => {
      // Only handle right-clicks on the desktop/wallpaper, not inside windows
      const target = e.target;
      const isDesktopArea = target.closest(".desktop-area") && !target.closest(".window");
      const isWallpaper = target.closest(".desktop-icons") || target.closest(".desktop-area");

      if (isDesktopArea || isWallpaper || target.classList.contains("desktop") || target.classList.contains("desktop-area")) {
        e.preventDefault();
        e.stopPropagation();

        // Calculate position to keep menu within viewport
        const x = Math.min(e.clientX, window.innerWidth - 220);
        const y = Math.min(e.clientY, window.innerHeight - 300);

        setMenuPosition({ x, y });
        setMenuVisible(true);
      }
    };

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuVisible(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setMenuVisible(false);
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onOpenWindow]);

  const handleAction = (action) => {
    setMenuVisible(false);
    switch (action) {
      case "terminal": onOpenWindow("terminal"); break;
      case "files": onOpenWindow("filemanager"); break;
      case "editor": onOpenWindow("texteditor"); break;
      case "browser": onOpenWindow("browser"); break;
      case "music": onOpenWindow("musicplayer", "/home/muneer/Music/_lofi.webm"); break;
      default: break;
    }
  };

  return (
    <>
      {children}

      {menuVisible && (
        <div
          ref={menuRef}
          className="custom-context-menu"
          style={{
            position: "fixed",
            left: menuPosition.x,
            top: menuPosition.y,
            zIndex: 99999,
          }}
        >
          <div className="context-menu-header">Quick Actions</div>
          <div className="context-menu-item" onClick={() => handleAction("terminal")}>
            <span className="context-icon"></span>
            <span>Open Terminal</span>
          </div>
          <div className="context-menu-item" onClick={() => handleAction("files")}>
            <span className="context-icon">📁</span>
            <span>File Manager</span>
          </div>
          <div className="context-menu-item" onClick={() => handleAction("editor")}>
            <span className="context-icon">📝</span>
            <span>Text Editor</span>
          </div>
          <div className="context-menu-item" onClick={() => handleAction("browser")}>
            <span className="context-icon">🌐</span>
            <span>Browser</span>
          </div>
          <div className="context-menu-item" onClick={() => handleAction("music")}>
            <span className="context-icon">🎵</span>
            <span>Music Player</span>
          </div>
          <div className="context-menu-separator"></div>
          <div className="context-menu-item" onClick={() => setMenuVisible(false)}>
            <span className="context-icon">✕</span>
            <span>Close Menu</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ContextMenu;
