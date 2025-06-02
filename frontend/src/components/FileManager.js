/**
 * FileManager Component
 *
 * A comprehensive file manager interface that allows users to navigate
 * the virtual file system, view directory contents, and open files.
 *
 * Features:
 * - Directory navigation with breadcrumb path
 * - File type recognition and appropriate icons
 * - Sorting (directories first, then alphabetical)
 * - File opening integration with other applications
 * - Support for various file types (images, PDFs, audio, text, etc.)
 *
 * @author Muneer
 * @component
 */

// ============================================================================
// IMPORTS
// ============================================================================

import React, { useState, useEffect } from "react";
import { loadFileSystem } from "../utils/fileSystemLoader";

// ============================================================================
// FILEMANAGER COMPONENT
// ============================================================================

/**
 * FileManager Component
 *
 * @param {Object} props - Component props
 * @param {Function} props.onOpenFile - Function to handle file opening
 * @param {string} props.initialPath - Initial directory path to display
 * @returns {JSX.Element} FileManager component
 */
const FileManager = ({ onOpenFile, initialPath = "/home/muneer" }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [currentPath, setCurrentPath] = useState(initialPath);
  const [fileSystem, setFileSystem] = useState({});
  const [loading, setLoading] = useState(true);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Load the file system on component mount
   */
  useEffect(() => {
    loadFileSystem().then((fs) => {
      setFileSystem(fs);
      setLoading(false);
    });
  }, []);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Get directory contents for a given path
   *
   * @param {string} path - Directory path to retrieve contents for
   * @returns {Object|null} Directory contents or null if not found
   */
  const getDirectoryContents = (path) => {
    const pathParts = path.split("/").filter((p) => p);
    let currentDir = fileSystem["/"];

    for (let part of pathParts) {
      if (currentDir && currentDir.children && currentDir.children[part]) {
        currentDir = currentDir.children[part];
      } else {
        return null;
      }
    }

    return currentDir?.children || {};
  };

  /**
   * Extract file extension from filename
   *
   * @param {string} filename - Name of the file
   * @returns {string} File extension in lowercase
   */
  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  /**
   * Check if file is an image based on extension
   *
   * @param {string} filename - Name of the file
   * @returns {boolean} True if file is an image
   */
  const isImageFile = (filename) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp"];
    return imageExtensions.includes(getFileExtension(filename));
  };

  /**
   * Check if file is a PDF based on extension
   *
   * @param {string} filename - Name of the file
   * @returns {boolean} True if file is a PDF
   */
  const isPdfFile = (filename) => {
    return getFileExtension(filename) === "pdf";
  };

  /**
   * Check if file is an audio file based on extension
   *
   * @param {string} filename - Name of the file
   * @returns {boolean} True if file is an audio file
   */
  const isAudioFile = (filename) => {
    const audioExtensions = ["mp3", "wav", "ogg", "flac", "m4a", "webm"];
    return audioExtensions.includes(getFileExtension(filename));
  };

  /**
   * Get appropriate icon for file or directory
   *
   * @param {string} name - Name of the file/directory
   * @param {Object} item - File/directory object with type information
   * @returns {string} Emoji icon representing the file type
   */
  const getFileIcon = (name, item) => {
    if (item.type === "directory") return "📁";
    if (isImageFile(name)) return "🖼️";
    if (isPdfFile(name)) return "📄";
    if (isAudioFile(name)) return "🎵";
    if (name.endsWith(".md")) return "📝";
    if (name.endsWith(".txt")) return "📄";
    if (name.endsWith(".json")) return "⚙️";
    return "📄";
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle clicking on file or directory items
   *
   * @param {string} name - Name of the clicked item
   * @param {Object} item - Item object with type and content information
   */
  const handleItemClick = (name, item) => {
    const newPath = currentPath === "/" ? "/" + name : currentPath + "/" + name;

    if (item.type === "directory") {
      setCurrentPath(newPath);
    } else {
      onOpenFile(newPath, item);
    }
  };

  /**
   * Handle back button navigation
   */
  const handleBackClick = () => {
    const pathParts = currentPath.split("/").filter((p) => p);
    pathParts.pop();
    const newPath = pathParts.length > 0 ? "/" + pathParts.join("/") : "/";
    setCurrentPath(newPath);
  };

  /**
   * Handle clicking on breadcrumb path segments
   *
   * @param {number} index - Index of the path segment clicked
   */
  const handlePathClick = (index) => {
    const pathParts = currentPath.split("/").filter((p) => p);
    const newPathParts = pathParts.slice(0, index + 1);
    const newPath =
      newPathParts.length > 0 ? "/" + newPathParts.join("/") : "/";
    setCurrentPath(newPath);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // Loading state
  if (loading) {
    return (
      <div className="file-manager">
        <div className="file-header">
          <span>Loading...</span>
        </div>
        <div className="file-list">
          <div className="loading">Loading file system...</div>
        </div>
      </div>
    );
  }

  // Get current directory contents and path parts
  const contents = getDirectoryContents(currentPath);
  const pathParts = currentPath.split("/").filter((p) => p);

  return (
    <div className="file-manager">
      {/* Header with navigation */}
      <div className="file-header">
        <div className="file-navigation">
          {/* Back button (only show if not at root) */}
          {currentPath !== "/" && (
            <button className="back-btn" onClick={handleBackClick}>
              ← Back
            </button>
          )}

          {/* Breadcrumb path */}
          <div className="file-path">
            <span
              className="path-segment clickable"
              onClick={() => setCurrentPath("/")}
            >
              📁
            </span>
            {pathParts.map((part, index) => (
              <span key={index}>
                <span className="path-separator">/</span>
                <span
                  className="path-segment clickable"
                  onClick={() => handlePathClick(index)}
                >
                  {part}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* File listing */}
      <div className="file-list">
        {contents && Object.keys(contents).length > 0 ? (
          Object.entries(contents)
            .sort(([a, itemA], [b, itemB]) => {
              // Sort directories first, then files alphabetically
              if (itemA.type === "directory" && itemB.type !== "directory")
                return -1;
              if (itemA.type !== "directory" && itemB.type === "directory")
                return 1;
              return a.localeCompare(b);
            })
            .map(([name, item]) => (
              <div
                key={name}
                className={`file-item ${item.type}`}
                onClick={() => handleItemClick(name, item)}
                title={item.description || name}
              >
                <span className="file-icon">{getFileIcon(name, item)}</span>
                <span className="file-name">{name}</span>
                <span className="file-type">{item.type}</span>
              </div>
            ))
        ) : (
          <div className="empty-directory">
            <p>📂 Directory is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;
