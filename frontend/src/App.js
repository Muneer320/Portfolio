/**
 * Portfolio Desktop Environment - Main Application Component
 *
 * A complete Linux desktop simulation featuring multiple applications, window management,
 * and system functionality. This component serves as the core orchestrator for the entire
 * portfolio experience, managing application lifecycle, user interactions, and system state.
 *
 * @author Muneer Alam
 * @version 1.0.0
 */

import React, { useState, useEffect, Suspense, lazy } from "react";
import "./App.css";

import { loadFileSystem } from "./utils/fileSystemLoader";
import {
  togglePlayer,
  setVolume,
  getActivePlayer,
  getCurrentMusicPath,
  registerPlayer,
  playPlayer,
} from "./utils/musicManager";

import Dock from "./components/Dock";
import Desktop from "./components/Desktop";
import Terminal from "./components/Terminal";
import FileManager from "./components/FileManager";
import TextEditor from "./components/TextEditor";
import ImageViewer from "./components/ImageViewer";
import ContextMenu from "./components/ContextMenu";

// Lazy-loaded components for code splitting
const Browser = lazy(() => import("./components/Browser"));
const MusicPlayer = lazy(() => import("./components/MusicPlayer"));
const MobileArchInstaller = lazy(() => import("./components/MobileArchInstaller"));

function App() {
  // Core Application State
  const [currentScreen, setCurrentScreen] = useState("login");
  const [currentPath, setCurrentPath] = useState("/home/muneer");
  const [openWindows, setOpenWindows] = useState([]);
  const [time, setTime] = useState(new Date());
  const [windowZIndex, setWindowZIndex] = useState(100);

  // Window Management State
  const [dragging, setDragging] = useState(null);
  const [resizing, setResizing] = useState(null);
  const [cascadeOffset, setCascadeOffset] = useState(0);

  // System Status and Audio State
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [terminalAutoStarted, setTerminalAutoStarted] = useState(false);
  const [backgroundAudio, setBackgroundAudio] = useState(null);
  const [systemStatus, setSystemStatus] = useState({
    battery: 85,
    volume: 75,
    wifi: true,
    musicPlaying: false,
    currentSong: "",
    hasMusic: false,
  }); // Minimum window sizes for each application type
  const minWindowSizes = {
    terminal: { width: 800, height: 450 },
    filemanager: { width: 650, height: 400 },
    texteditor: { width: 600, height: 350 },
    browser: { width: 1000, height: 600 },
    musicplayer: { width: 450, height: 500 },
    imageviewer: { width: 500, height: 600 },
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handlePlayerStatusChange = (playerId, isPlaying) => {
    setSystemStatus((prev) => ({ ...prev, musicPlaying: isPlaying }));
  };
  // ============================================================================
  // EFFECTS - SYSTEM INITIALIZATION AND MONITORING
  // ============================================================================

  // System Timer - Update Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Responsive Design - Screen Size Detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024 || window.innerHeight < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-Start Functionality
  useEffect(() => {
    if (currentScreen === "desktop" && !terminalAutoStarted) {
      setTimeout(() => {
        openWindow("terminal");

        if (!backgroundAudio) {
          const audio = new Audio("/home/muneer/Music/_lofi.webm");
          audio.volume = systemStatus.volume / 100;
          audio.loop = false;

          registerPlayer("background-music", audio);

          audio.addEventListener("play", () => {
            setSystemStatus((prev) => ({ ...prev, musicPlaying: true }));
          });

          audio.addEventListener("pause", () => {
            setSystemStatus((prev) => ({ ...prev, musicPlaying: false }));
          });

          audio.addEventListener("ended", () => {
            setSystemStatus((prev) => ({ ...prev, musicPlaying: false }));
          });

          setBackgroundAudio(audio);

          // Start background music with delay for better UX
          setTimeout(() => {
            playPlayer("background-music");
          }, 1500);
        }

        setTerminalAutoStarted(true);
      }, 1000);
    }
  }, [
    currentScreen,
    terminalAutoStarted,
    backgroundAudio,
    systemStatus.volume,
  ]);

  /**
   * Audio Volume Synchronization
   * Keeps music manager volume in sync with system volume
   */
  useEffect(() => {
    setVolume(systemStatus.volume / 100);
  }, [systemStatus.volume]);

  /**
   * Music Directory Detection
   * Checks if music files are available in the file system
   */
  useEffect(() => {
    loadFileSystem().then((fs) => {
      const musicDir =
        fs["/"]?.children?.home?.children?.muneer?.children?.Music;
      const hasMusic =
        musicDir && Object.keys(musicDir.children || {}).length > 0;
      setSystemStatus((prev) => ({ ...prev, hasMusic }));
    });
  }, []);

  /**
   * Login Screen Focus Management
   * Automatically focus the user card when login screen loads for keyboard accessibility
   */
  useEffect(() => {
    if (currentScreen === "login") {
      // Small delay to ensure DOM is rendered
      const timer = setTimeout(() => {
        const userCard = document.querySelector(".user-card");
        if (userCard) {
          userCard.focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // ============================================================================
  // UTILITY FUNCTIONS - FILE TYPE DETECTION
  // ============================================================================

  /**
   * Extract file extension from filename
   * @param {string} filename - The filename to analyze
   * @returns {string} File extension in lowercase
   */
  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  /**
   * Check if file is an image type
   * @param {string} filename - The filename to check
   * @returns {boolean} True if file is an image
   */
  const isImageFile = (filename) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp"];
    return imageExtensions.includes(getFileExtension(filename));
  };

  /**
   * Check if file is a PDF document
   * @param {string} filename - The filename to check
   * @returns {boolean} True if file is a PDF
   */
  const isPdfFile = (filename) => {
    return getFileExtension(filename) === "pdf";
  };

  /**
   * Check if file is an audio file
   * @param {string} filename - The filename to check
   * @returns {boolean} True if file is audio
   */
  const isAudioFile = (filename) => {
    const audioExtensions = ["mp3", "wav", "ogg", "flac", "m4a", "webm"];
    return audioExtensions.includes(getFileExtension(filename));
  };

  // ============================================================================
  // WINDOW MANAGEMENT FUNCTIONS
  // ============================================================================
  /**
   * Open a new application window or bring existing one to front
   * Handles special cases like music player singleton pattern
   */
  const openWindow = (appName, filePath = null, fileObj = null) => {
    const musicPlayerId = "musicplayer";

    // Special handling for music player (singleton pattern)
    if (appName === musicPlayerId) {
      const existingPlayerWindow = openWindows.find(
        (w) => w.id === musicPlayerId
      );

      if (existingPlayerWindow) {
        // Update existing music player with new file or bring to front
        if (filePath && filePath !== existingPlayerWindow.filePath) {
          setOpenWindows((prevWindows) =>
            prevWindows.map((win) =>
              win.id === musicPlayerId
                ? {
                    ...win,
                    filePath: filePath,
                    fileObj: fileObj,
                    zIndex: windowZIndex,
                  }
                : win
            )
          );
        } else {
          bringToFront(musicPlayerId);
        }
        setWindowZIndex((prev) => prev + 1);
        return;
      } else {
        // Create new music player window
        const minSize = minWindowSizes[appName] || { width: 500, height: 400 };
        const newWindow = {
          id: musicPlayerId,
          title: "Music Player",
          component: appName,
          filePath: filePath || getCurrentMusicPath(),
          fileObj: fileObj,
          x: 60 + (cascadeOffset * 30) % 500,
          y: 80 + (cascadeOffset * 40) % 400,
          width: Math.max(minSize.width, 450),
          height: Math.max(minSize.height, 400),
          zIndex: windowZIndex,
          minWidth: minSize.width,
          minHeight: minSize.height,
        };
        setWindowZIndex((prev) => prev + 1);
        setCascadeOffset((prev) => prev + 1);
        setOpenWindows((prev) => [...prev, newWindow]);
        return;
      }
    }

    // Handle other applications - check for existing windows
    const windowId = appName + (filePath || "");
    const existingWindow = openWindows.find((w) => w.id === windowId);

    if (existingWindow) {
      bringToFront(existingWindow.id);
      return;
    }

    // Create new window for other applications
    const minSize = minWindowSizes[appName] || { width: 500, height: 400 };
    const titles = {
      terminal: "Terminal",
      filemanager: "File Manager",
      texteditor: filePath ? filePath.split("/").pop() : "Text Editor",
      imageviewer: "Image Viewer",
      browser: "Browser",
    };

    const newWindow = {
      id: windowId,
      title: titles[appName] || "Application",
      component: appName,
      filePath: filePath,
      fileObj: fileObj,
      x: 60 + (cascadeOffset * 30) % 500,
      y: 80 + (cascadeOffset * 40) % 400,
      width: Math.max(minSize.width, 500),
      height: Math.max(minSize.height, 400),
      zIndex: windowZIndex,
      minWidth: minSize.width,
      minHeight: minSize.height,
    };

    setWindowZIndex((prev) => prev + 1);
    setCascadeOffset((prev) => prev + 1);
    setOpenWindows((prev) => [...prev, newWindow]);
  };

  /**
   * Open file with appropriate application based on file type
   * @param {string} filePath - Path to the file to open
   * @param {Object} fileObj - File object with metadata
   */
  const openFile = (filePath, fileObj) => {
    const filename = filePath.split("/").pop();

    if (isImageFile(filename)) {
      openWindow("imageviewer", filePath, fileObj);
    } else if (isPdfFile(filename)) {
      openWindow("browser", filePath, fileObj);
    } else if (isAudioFile(filename)) {
      openWindow("musicplayer", filePath, fileObj);
    } else {
      openWindow("texteditor", filePath, fileObj);
    }
  };
  /**
   * Close a window by ID
   */
  const closeWindow = (id) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
  };

  /**
   * Bring window to front by updating its z-index
   */
  const bringToFront = (id) => {
    setWindowZIndex((prev) => prev + 1);
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: windowZIndex } : w))
    );
  };

  // ============================================================================
  // MOUSE EVENT HANDLERS - WINDOW INTERACTION
  // ============================================================================

  /**
   * Handle mouse down events for window dragging and resizing
   */
  const handleMouseDown = (e, windowId, action) => {
    e.preventDefault();
    bringToFront(windowId);

    if (action === "drag") {
      const window = openWindows.find((w) => w.id === windowId);
      setDragging({
        windowId,
        startX: e.clientX - window.x,
        startY: e.clientY - window.y,
      });
    } else if (action === "resize") {
      const window = openWindows.find((w) => w.id === windowId);
      setResizing({
        windowId,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: window.width,
        startHeight: window.height,
      });
    }
  };
  /**
   * Handle mouse move events for active dragging/resizing operations
   */
  const handleMouseMove = (e) => {
    if (dragging) {
      setOpenWindows((prev) =>
        prev.map((w) =>
          w.id === dragging.windowId
            ? {
                ...w,
                x: e.clientX - dragging.startX,
                y: e.clientY - dragging.startY,
              }
            : w
        )
      );
    } else if (resizing) {
      const deltaX = e.clientX - resizing.startX;
      const deltaY = e.clientY - resizing.startY;

      setOpenWindows((prev) =>
        prev.map((w) =>
          w.id === resizing.windowId
            ? {
                ...w,
                width: Math.max(
                  w.minWidth || 300,
                  resizing.startWidth + deltaX
                ),
                height: Math.max(
                  w.minHeight || 200,
                  resizing.startHeight + deltaY
                ),
              }
            : w
        )
      );
    }
  };
  /**
   * Handle mouse up events to end dragging/resizing operations
   */
  const handleMouseUp = () => {
    setDragging(null);
    setResizing(null);
  };

  // ============================================================================
  // AUDIO CONTROL FUNCTIONS
  // ============================================================================
  /**
   * Adjust system volume by a delta amount
   */
  const adjustVolume = (delta) => {
    setSystemStatus((prev) => {
      const newVolume = Math.min(100, Math.max(0, prev.volume + delta));
      setVolume(newVolume / 100);
      return { ...prev, volume: newVolume };
    });
  };

  /**
   * Toggle music playback for the active player
   */
  const toggleMusic = () => {
    const activePlayer = getActivePlayer();
    if (activePlayer) togglePlayer(activePlayer);
  };
  /**
   * Mouse Event Listener Setup
   * Handles global mouse events for window management
   */
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing]);

  // ============================================================================
  // RENDER LOGIC - RESPONSIVE AND SCREEN-BASED RENDERING
  // ============================================================================
  // Mobile/Small Screen - Arch Installer Experience
  if (isSmallScreen) {
    return (
      <Suspense fallback={
        <div className="loading-screen" style={{
          height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f23, #1a1a2e)', color: '#61dafb',
          fontFamily: 'monospace', fontSize: '1.1rem'
        }}>
          Loading portable environment...
        </div>
      }>
        <MobileArchInstaller />
      </Suspense>
    );
  }
  // Login Screen - User Authentication Interface
  if (currentScreen === "login") {
    // Handle global Enter key for login
    const handleLoginKeyPress = (e) => {
      if (e.key === "Enter") {
        setCurrentScreen("desktop");
      }
    };

    return (
      <div className="login-screen" onKeyDown={handleLoginKeyPress}>
        <div className="login-container">
          <h1 className="system-title">Arch Linux</h1>
          <div className="user-selection">
            <div
              className="user-card"
              onClick={() => setCurrentScreen("desktop")}
              onKeyDown={(e) =>
                e.key === "Enter" && setCurrentScreen("desktop")
              }
              tabIndex={0}
              autoFocus
            >
              <div className="user-avatar">
                <span>MA</span>
              </div>
              <div className="user-info">
                <h3>Muneer Alam</h3>
                <p>Software Developer</p>
              </div>
            </div>
          </div>
          <div className="login-footer">
            <p>Click user or press Enter to continue</p>
          </div>
        </div>
      </div>
    );
  }
  // ============================================================================
  // MAIN DESKTOP INTERFACE
  // ============================================================================

  return (
    <ContextMenu onOpenWindow={openWindow}>
    <div className="desktop">
      <Dock
        time={time}
        systemStatus={systemStatus}
        onOpenWindow={openWindow}
        onLogout={() => setCurrentScreen("login")}
        toggleMusic={toggleMusic}
        adjustVolume={adjustVolume}
      />{" "}
      <div className="desktop-area">
        <Desktop onOpenWindow={openWindow} />

        {openWindows.map((window) => (
          <div
            key={window.id}
            className="window"
            style={{
              left: window.x,
              top: window.y,
              width: window.width,
              height: window.height,
              zIndex: window.zIndex,
            }}
            onClick={() => bringToFront(window.id)}
          >
            <div
              className="window-header"
              onMouseDown={(e) => handleMouseDown(e, window.id, "drag")}
            >
              <span className="window-title">{window.title}</span>
              <div className="window-controls">
                <button onClick={() => closeWindow(window.id)}>×</button>
              </div>{" "}
            </div>

            <div className="window-content">
              <Suspense fallback={<div className="loading-spinner" style={{padding: '40px', textAlign: 'center', color: '#61dafb'}}>⟳</div>}>
              {window.component === "terminal" && (
                <Terminal
                  currentPath={window.path || currentPath}
                  setCurrentPath={(newPath) => {
                    // Update the specific terminal window's path
                    setOpenWindows((prev) =>
                      prev.map((w) =>
                        w.id === window.id ? { ...w, path: newPath } : w
                      )
                    );
                  }}
                  onClose={() => closeWindow(window.id)}
                  onOpenWindow={openWindow}
                />
              )}
              {window.component === "filemanager" && (
                <FileManager onOpenFile={openFile} />
              )}
              {window.component === "texteditor" && (
                <TextEditor
                  filePath={window.filePath}
                  fileObj={window.fileObj}
                  onClose={() => closeWindow(window.id)}
                  windowId={window.id}
                />
              )}
              {window.component === "browser" && (
                <Browser
                  filePath={window.filePath}
                  fileObj={window.fileObj}
                  onOpenWindow={openWindow}
                />
              )}
              {window.component === "musicplayer" && (
                <MusicPlayer
                  filePath={window.filePath}
                  playerId={window.id}
                  onPlayerStatusChange={handlePlayerStatusChange}
                  systemVolume={systemStatus.volume}
                  onVolumeChange={(newVolume) => {
                    setSystemStatus((prev) => {
                      setVolume(newVolume / 100);
                      return { ...prev, volume: newVolume };
                    });
                  }}
                />
              )}
              {window.component === "imageviewer" && (
                <ImageViewer
                  filePath={window.filePath}
                  fileObj={window.fileObj}
                />
              )}{" "}
            </Suspense>
            </div>

            {window.component !== "musicplayer" && (
              <div
                className="resize-handle"
                onMouseDown={(e) => handleMouseDown(e, window.id, "resize")}
              />
            )}
          </div>
        ))}
      </div>
    </div>
    </ContextMenu>
  );
}

// ============================================================================
// EXPORT
// ============================================================================

export default App;
