import React, { useState, useEffect } from "react";
import "./App.css";

// Components
import Dock from "./components/Dock";
import Desktop from "./components/Desktop";
import Terminal from "./components/Terminal";
import FileManager from "./components/FileManager";
import TextEditor from "./components/TextEditor";
import Browser from "./components/Browser";
import MusicPlayer from "./components/MusicPlayer";
import ImageViewer from "./components/ImageViewer";

// Music Manager
import musicManager from "./utils/musicManager";

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
  const [musicAutoStarted, setMusicAutoStarted] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    battery: 85,
    volume: 30, // Start with lower volume
    wifi: true,
    musicPlaying: false,
    currentSong: null,
    hasMusic: false,
  });

  // Minimum window sizes
  const minWindowSizes = {
    terminal: { width: 800, height: 450 },
    filemanager: { width: 500, height: 350 },
    texteditor: { width: 500, height: 350 },
    browser: { width: 1000, height: 600 },
    musicplayer: { width: 450, height: 600 },
    imageviewer: { width: 250, height: 650 },
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      // Simulate battery drain
      setSystemStatus((prev) => ({
        ...prev,
        battery: Math.max(1, prev.battery - 0.001),
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize music manager and load available music
  useEffect(() => {
    const initializeMusic = async () => {
      await musicManager.loadAvailableMusic();

      // Subscribe to music manager state changes
      const unsubscribe = musicManager.onStateChange((musicState) => {
        setSystemStatus((prev) => ({
          ...prev,
          musicPlaying: musicState.isPlaying,
          currentSong: musicState.currentTrack?.name || null,
          hasMusic: musicState.hasMusic,
          volume: Math.round(musicState.volume * 100),
        }));
      });

      // Set initial volume in music manager
      musicManager.setVolume(0.3); // 30%

      return unsubscribe;
    };

    let unsubscribe;
    initializeMusic().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
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
    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);
  useEffect(() => {
    // Auto-start music when user logs in (only if music is available and not already auto-started)
    if (
      currentScreen === "desktop" &&
      systemStatus.hasMusic &&
      !systemStatus.musicPlaying &&
      !musicAutoStarted
    ) {
      setTimeout(() => {
        musicManager.toggle();
        setMusicAutoStarted(true);
      }, 2000);
    }

    // Auto-start terminal on first login
    if (currentScreen === "desktop" && !terminalAutoStarted) {
      setTimeout(() => {
        openWindow("terminal");
        setTerminalAutoStarted(true);
      }, 1000);
    }
  }, [
    currentScreen,
    terminalAutoStarted,
    systemStatus.hasMusic,
    musicAutoStarted,
  ]);

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
    const existingWindow = openWindows.find(
      (w) => w.id === appName + (filePath || "")
    );
    if (existingWindow) {
      bringToFront(existingWindow.id);
      return;
    }

    const minSize = minWindowSizes[appName] || { width: 500, height: 400 };

    const newWindow = {
      id: appName + (filePath || ""),
      title:
        appName === "terminal"
          ? "Terminal"
          : appName === "filemanager"
          ? "File Manager"
          : appName === "texteditor"
          ? filePath
            ? filePath.split("/").pop()
            : "Text Editor"
          : appName === "musicplayer"
          ? "Music Player"
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
      width: Math.max(minSize.width, appName === "musicplayer" ? 450 : 600),
      height: Math.max(minSize.height, appName === "musicplayer" ? 400 : 400),
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
  const toggleMusic = () => {
    musicManager.toggle();
  };

  const adjustVolume = (delta) => {
    const currentVolume = musicManager.getState().volume;
    const newVolume = Math.max(0, Math.min(1, currentVolume + delta / 100));
    musicManager.setVolume(newVolume);
  };

  const updateVolume = (newVolume) => {
    musicManager.setVolume(newVolume / 100);
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
              )}
              {window.component === "musicplayer" && (
                <MusicPlayer
                  systemStatus={systemStatus}
                  onToggleMusic={toggleMusic}
                  onVolumeChange={updateVolume}
                  filePath={window.filePath}
                  fileObj={window.fileObj}
                />
              )}

              {window.component === "imageviewer" && (
                <ImageViewer
                  filePath={window.filePath}
                  fileObj={window.fileObj}
                />
              )}
            </div>

            <div
              className="resize-handle"
              onMouseDown={(e) => handleMouseDown(e, window.id, "resize")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
