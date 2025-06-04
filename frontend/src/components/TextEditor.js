/**
 * TextEditor Component
 *
 * A fully functional text editor with file operations, similar to notepad
 * or other text editing applications. Supports both reading existing files
 * and creating new documents with save functionality.
 *
 * Features:
 * - File loading from filesystem or fileObj
 * - New file creation with default content
 * - Save and Save As functionality
 * - Read-only mode for system files
 * - Unsaved changes tracking
 * - Local storage integration for persistence
 * - Modal dialogs for file naming
 *
 * @author Muneer
 * @component
 */

// ============================================================================
// IMPORTS
// ============================================================================

import React, { useState, useEffect } from "react";
import { FaFileAlt, FaSave, FaFolderOpen } from "react-icons/fa";

// ============================================================================
// TEXTEDITOR COMPONENT
// ============================================================================

/**
 * TextEditor Component
 *
 * @param {Object} props - Component props
 * @param {string} props.filePath - Path to file being edited
 * @param {Object} props.fileObj - File object with content (for read-only files)
 * @param {Function} props.onClose - Function to close the editor window
 * @param {string} props.windowId - Unique identifier for this editor window
 * @returns {JSX.Element} TextEditor component
 */
const TextEditor = ({ filePath, fileObj, onClose, windowId }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Load file content on component mount or when file path changes
   */
  useEffect(() => {
    const loadFileContent = async () => {
      if (fileObj && fileObj.content) {
        // If file object has content, use it (read-only mode)
        setContent(fileObj.content);
        setIsReadOnly(true);
        setFileName(filePath ? filePath.split("/").pop() : "Read-only File");
      } else if (filePath) {
        try {
          // Try to fetch the actual file from public directory
          const response = await fetch(filePath);
          if (response.ok) {
            const text = await response.text();
            setContent(text);
            setFileName(filePath.split("/").pop());
            setIsReadOnly(true); // Files from public are read-only
          } else {
            // Fallback to localStorage for user-created files
            const savedContent = localStorage.getItem(`file_${filePath}`) || "";
            setContent(
              savedContent ||
                `File not found: ${filePath}\n\nThis might be a placeholder file.`
            );
            setFileName(filePath.split("/").pop());
            setIsReadOnly(false);
          }
        } catch (error) {
          console.error("Error loading file:", error);
          setContent(`Error loading file: ${filePath}\n\n${error.message}`);
          setFileName(filePath.split("/").pop());
          setIsReadOnly(true);
        }
      } else {
        // New file - open with default content
        setContent(
          "Welcome to Portfolio Text Editor!\n\nThis is a new file. Start typing..."
        );
        setFileName("untitled.txt");
        setIsReadOnly(false);
      }
    };

    loadFileContent();
  }, [filePath, fileObj]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle content changes in the text area
   *
   * @param {Event} e - Change event from textarea
   */
  const handleContentChange = (e) => {
    if (!isReadOnly) {
      setContent(e.target.value);
      setHasUnsavedChanges(true);
    }
  };

  /**
   * Handle saving the current file
   */
  const handleSave = () => {
    if (isReadOnly) return;

    if (fileName === "untitled.txt" || !fileName) {
      setShowNameDialog(true);
      return;
    }

    // Save to localStorage (simulating local file system)
    localStorage.setItem(`file_${fileName}`, content);

    // Also save to Documents if it's a new file
    const documentsFiles = JSON.parse(
      localStorage.getItem("documentsFiles") || "{}"
    );
    documentsFiles[fileName] = {
      type: "file",
      content: content,
      created: new Date().toISOString(),
    };
    localStorage.setItem("documentsFiles", JSON.stringify(documentsFiles));

    setHasUnsavedChanges(false);
    alert("File saved successfully!");
  };

  /**
   * Handle saving file with a new name
   *
   * @param {string} newFileName - New name for the file
   */
  const handleSaveAs = (newFileName) => {
    if (!newFileName) return;

    setFileName(newFileName);
    setShowNameDialog(false);

    // Save the file
    localStorage.setItem(`file_${newFileName}`, content);

    // Add to Documents
    const documentsFiles = JSON.parse(
      localStorage.getItem("documentsFiles") || "{}"
    );
    documentsFiles[newFileName] = {
      type: "file",
      content: content,
      created: new Date().toISOString(),
    };
    localStorage.setItem("documentsFiles", JSON.stringify(documentsFiles));

    setHasUnsavedChanges(false);
    alert(`File saved as ${newFileName}!`);
  };

  /**
   * Handle creating a new file
   */
  const handleNewFile = () => {
    setContent("");
    setFileName("untitled.txt");
    setIsReadOnly(false);
    setHasUnsavedChanges(false);
  };

  /**
   * Handle keyboard shortcuts in save dialog
   *
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleDialogKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveAs(e.target.value);
    } else if (e.key === "Escape") {
      setShowNameDialog(false);
    }
  };

  /**
   * Handle save button click in dialog
   */
  const handleDialogSave = () => {
    const input = document.querySelector(".modal input");
    handleSaveAs(input.value);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="text-editor">
      {/* Editor Toolbar */}
      <div className="editor-toolbar">
        {" "}
        <button onClick={handleNewFile} title="Create new file">
          <FaFileAlt /> New
        </button>
        <button
          onClick={handleSave}
          disabled={isReadOnly}
          className={isReadOnly ? "disabled" : ""}
          title="Save current file"
        >
          <FaSave /> Save
        </button>
        <button
          onClick={() => setShowNameDialog(true)}
          disabled={isReadOnly}
          className={isReadOnly ? "disabled" : ""}
          title="Save with new name"
        >
          <FaFolderOpen /> Save As
        </button>
        {/* File Status */}
        <span className="file-path">
          {fileName}
          {hasUnsavedChanges && "*"}
          {isReadOnly && "(Read Only)"}
        </span>
      </div>

      {/* Main Editor Area */}
      <textarea
        className="editor-content"
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing..."
        readOnly={isReadOnly}
      />

      {/* Save As Dialog Modal */}
      {showNameDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Save File As</h3>
            <input
              type="text"
              placeholder="Enter filename..."
              onKeyDown={handleDialogKeyDown}
              autoFocus
            />
            <div className="modal-buttons">
              <button onClick={handleDialogSave}>Save</button>
              <button onClick={() => setShowNameDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
