import React, { useState, useEffect } from "react";
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
import Browser from "./components/Browser";
import MusicPlayer from "./components/MusicPlayer";
import ImageViewer from "./components/ImageViewer";

function App() {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [currentPath, setCurrentPath] = useState("/home/muneer");
  const [openWindows, setOpenWindows] = useState([]);
  const [time, setTime] = useState(new Date());
  const [windowZIndex, setWindowZIndex] = useState(100);
  const [dragging, setDragging] = useState(null);
  const [resizing, setResizing] = useState(null);
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
  });

  const handlePlayerStatusChange = (playerId, isPlaying) => {
    setSystemStatus((prev) => ({ ...prev, musicPlaying: isPlaying }));
  };

  const minWindowSizes = {
    terminal: { width: 800, height: 450 },
    filemanager: { width: 500, height: 350 },
    texteditor: { width: 500, height: 350 },
    browser: { width: 1000, height: 600 },
    musicplayer: { width: 450, height: 500 },
    imageviewer: { width: 500, height: 400 },
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setSystemStatus((prev) => ({
        ...prev,
        battery: Math.max(1, prev.battery - 0.001),
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024 || window.innerHeight < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);
  useEffect(() => {
    // Auto-start terminal and background music on first login
    if (currentScreen === "desktop" && !terminalAutoStarted) {
      setTimeout(() => {
        openWindow("terminal");

        // Initialize background music without opening window
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
  // Sync audio volume when system volume changes
  useEffect(() => {
    setVolume(systemStatus.volume / 100);
  }, [systemStatus.volume]);

  // Check if music directory exists
  useEffect(() => {
    loadFileSystem().then((fs) => {
      const musicDir =
        fs["/"]?.children?.home?.children?.muneer?.children?.Music;
      const has = musicDir && Object.keys(musicDir.children || {}).length > 0;
      setSystemStatus((prev) => ({ ...prev, hasMusic: has }));
    });
  }, []);

  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  const isImageFile = (filename) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp"];
    return imageExtensions.includes(getFileExtension(filename));
  };

  const isPdfFile = (filename) => {
    return getFileExtension(filename) === "pdf";
  };

  const isAudioFile = (filename) => {
    const audioExtensions = ["mp3", "wav", "ogg", "flac", "m4a", "webm"];
    return audioExtensions.includes(getFileExtension(filename));
  };
  const openWindow = (appName, filePath = null, fileObj = null) => {
    const musicPlayerId = "musicplayer";

    if (appName === musicPlayerId) {
      const existingPlayerWindow = openWindows.find(
        (w) => w.id === musicPlayerId
      );

      if (existingPlayerWindow) {
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
        const minSize = minWindowSizes[appName] || { width: 500, height: 400 };
        const newWindow = {
          id: musicPlayerId,
          title: "Music Player",
          component: appName,
          filePath: filePath || getCurrentMusicPath(),
          fileObj: fileObj,
          x: Math.random() * 200 + 100,
          y: Math.random() * 100 + 100,
          width: Math.max(minSize.width, 450),
          height: Math.max(minSize.height, 400),
          zIndex: windowZIndex,
          minWidth: minSize.width,
          minHeight: minSize.height,
        };
        setWindowZIndex((prev) => prev + 1);
        setOpenWindows((prev) => [...prev, newWindow]);
        return;
      }
    } // Handle other applications
    const windowId = appName + (filePath || "");
    const existingWindow = openWindows.find((w) => w.id === windowId);

    if (existingWindow) {
      bringToFront(existingWindow.id);
      return;
    }

    const minSize = minWindowSizes[appName] || { width: 500, height: 400 };
    const newWindow = {
      id: windowId,
      title:
        appName === "terminal"
          ? "Terminal"
          : appName === "filemanager"
          ? "File Manager"
          : appName === "texteditor"
          ? filePath
            ? filePath.split("/").pop()
            : "Text Editor"
          : appName === "imageviewer"
          ? "Image Viewer"
          : appName === "browser"
          ? "Browser"
          : "Application",
      component: appName,
      filePath: filePath,
      fileObj: fileObj,
      x: Math.random() * 200 + 100,
      y: Math.random() * 100 + 100,
      width: Math.max(minSize.width, 600),
      height: Math.max(minSize.height, 400),
      zIndex: windowZIndex,
      minWidth: minSize.width,
      minHeight: minSize.height,
    };

    setWindowZIndex((prev) => prev + 1);
    setOpenWindows((prev) => [...prev, newWindow]);
  };

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

  const closeWindow = (id) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const bringToFront = (id) => {
    setWindowZIndex((prev) => prev + 1);
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: windowZIndex } : w))
    );
  };

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

  const handleMouseUp = () => {
    setDragging(null);
    setResizing(null);
  };
  const adjustVolume = (delta) => {
    setSystemStatus((prev) => {
      const vol = Math.min(100, Math.max(0, prev.volume + delta));
      setVolume(vol / 100); // Update music manager volume (0-1 range)
      return { ...prev, volume: vol };
    });
  };

  // Toggle play/pause for the active music player
  const toggleMusic = () => {
    const active = getActivePlayer();
    if (active) togglePlayer(active);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing]);

  if (isSmallScreen) {
    return (
      <div className="small-screen-warning">
        <div className="warning-content">
          <h1>🖥️ Desktop Experience Required</h1>
          <p>
            This portfolio is designed as an interactive Linux desktop
            experience.
          </p>
          <p>
            Please view on a larger screen (minimum 1024x768) for the best
            experience.
          </p>
          <div className="contact-info">
            <h3>Quick Contact:</h3>
            <p>📧 muneer.alam320@email.com</p>
            <p>🐙 github.com/muneer320</p>
            <p>🌐 linkedin.com/in/muneer320</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === "login") {
    return (
      <div className="login-screen">
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

  return (
    <div className="desktop">
      <Dock
        time={time}
        systemStatus={systemStatus}
        onOpenWindow={openWindow}
        onLogout={() => setCurrentScreen("login")}
        toggleMusic={toggleMusic}
        adjustVolume={adjustVolume}
      />

      <div className="desktop-area">
        <Desktop onOpenWindow={openWindow} />

        {/* Windows */}
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
              </div>
            </div>

            <div className="window-content">
              {window.component === "terminal" && (
                <Terminal
                  currentPath={currentPath}
                  setCurrentPath={setCurrentPath}
                  onClose={() => closeWindow(window.id)}
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
              )}{" "}
              {window.component === "musicplayer" && (
                <MusicPlayer
                  filePath={window.filePath}
                  playerId={window.id}
                  onPlayerStatusChange={handlePlayerStatusChange}
                  systemVolume={systemStatus.volume}
                  onVolumeChange={(newVolume) => {
                    setSystemStatus((prev) => {
                      setVolume(newVolume / 100); // Update music manager volume
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
              )}
            </div>

            {/* Only show resize handle for non-music player windows */}
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
  );
}

export default App;
