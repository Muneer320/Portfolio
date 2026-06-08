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

import React, { useState, useEffect, useMemo } from "react";
import { FaFileAlt, FaSave, FaFolderOpen, FaTrash, FaEye, FaEdit } from "react-icons/fa";
import { marked } from "marked";

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
  const [saveNotification, setSaveNotification] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [tempFileName, setTempFileName] = useState("");
  const [viewMode, setViewMode] = useState("preview");

  const isMarkdown = useMemo(() => {
    return fileName.toLowerCase().endsWith(".md");
  }, [fileName]);

  const renderedMarkdown = useMemo(() => {
    if (!isMarkdown) return "";
    try {
      return marked(content, { breaks: true, gfm: true });
    } catch {
      return content;
    }
  }, [content, isMarkdown]);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  /**
   * Load file content on component mount or when file path changes
   */
  useEffect(() => {
    const loadFileContent = async () => {
      if (fileObj && fileObj.content) {
        // Check if this is a user-saved file
        const documentsFiles = JSON.parse(
          localStorage.getItem("documentsFiles") || "{}"
        );
        const fileName = filePath ? filePath.split("/").pop() : "";
        const isUserSavedFile = documentsFiles[fileName];

        if (isUserSavedFile) {
          // User-saved file - editable
          setContent(fileObj.content);
          setIsReadOnly(false);
          setFileName(fileName);
        } else {
          // Static file - read-only
          setContent(fileObj.content);
          setIsReadOnly(true);
          setFileName(filePath ? filePath.split("/").pop() : "Read-only File");
        }
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
   */ const handleSave = () => {
    if (isReadOnly) return;

    // If this is a new file without a name, prompt for name
    if (fileName === "untitled.txt" || !fileName) {
      openSaveDialog();
      return;
    }

    // Validate the current filename
    const validation = validateFileName(fileName);
    if (!validation.isValid && validation.errors.length > 0) {
      // Show validation errors but still save with corrected name
      showSaveNotification(
        `File saved with corrections: ${validation.errors.join(", ")}`
      );
    }

    const finalFileName = validation.sanitizedName;

    // Save the file
    localStorage.setItem(`file_${finalFileName}`, content);

    // Add/Update in Documents
    const documentsFiles = JSON.parse(
      localStorage.getItem("documentsFiles") || "{}"
    );
    documentsFiles[finalFileName] = {
      type: "file",
      content: content,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    localStorage.setItem("documentsFiles", JSON.stringify(documentsFiles));

    // Update filename if it was sanitized
    if (finalFileName !== fileName) {
      setFileName(finalFileName);
    }

    setHasUnsavedChanges(false);

    if (validation.isValid) {
      showSaveNotification("File saved successfully!");
    }

    // Trigger filesystem update event for FileManager refresh
    window.dispatchEvent(new Event("filesystemUpdate"));
  };
  /**
   * Handle saving file with a new name
   *
   * @param {string} newFileName - New name for the file
   */
  const handleSaveAs = (newFileName) => {
    if (!newFileName.trim()) {
      setValidationErrors(["Filename cannot be empty"]);
      return;
    }

    // Validate the filename
    const validation = validateFileName(newFileName);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      // Still proceed with sanitized name
    } else {
      setValidationErrors([]);
    }

    const finalFileName = validation.sanitizedName;

    setFileName(finalFileName);
    setShowNameDialog(false);
    setValidationErrors([]);

    // Save the file
    localStorage.setItem(`file_${finalFileName}`, content);

    // Add to Documents
    const documentsFiles = JSON.parse(
      localStorage.getItem("documentsFiles") || "{}"
    );
    documentsFiles[finalFileName] = {
      type: "file",
      content: content,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    localStorage.setItem("documentsFiles", JSON.stringify(documentsFiles));
    setHasUnsavedChanges(false);

    // Show appropriate notification
    if (validation.isValid) {
      showSaveNotification(`File saved as ${finalFileName}!`);
    } else {
      showSaveNotification(
        `File saved as ${finalFileName} with corrections: ${validation.errors.join(
          ", "
        )}`
      );
    }

    // Trigger filesystem update event for FileManager refresh
    window.dispatchEvent(new Event("filesystemUpdate"));
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
   * Show save notification and auto-hide after 3 seconds
   */
  const showSaveNotification = (message) => {
    setSaveNotification(message);
    setTimeout(() => {
      setSaveNotification("");
    }, 3000);
  };

  /**
   * Check if current file is user-saved (and therefore deletable)
   */
  const isUserSavedFile = () => {
    const documentsFiles = JSON.parse(
      localStorage.getItem("documentsFiles") || "{}"
    );
    return documentsFiles[fileName];
  };

  /**
   * Validate and sanitize filename
   * @param {string} filename - The filename to validate
   * @returns {Object} { isValid: boolean, sanitizedName: string, errors: string[] }
   */
  const validateFileName = (filename) => {
    const errors = [];
    let sanitizedName = filename.trim();

    // Check if empty
    if (!sanitizedName) {
      errors.push("Filename cannot be empty");
      return { isValid: false, sanitizedName: "untitled.txt", errors };
    }

    // Valid extensions for text editor
    const validExtensions = [
      ".txt",
      ".md",
      ".json",
      ".js",
      ".css",
      ".html",
      ".xml",
      ".log",
      ".csv",
    ];

    // Remove illegal characters (Windows + general safety)
    const illegalChars = /[<>:"/\\|?*\x00-\x1f]/g;
    if (illegalChars.test(sanitizedName)) {
      sanitizedName = sanitizedName.replace(illegalChars, "_");
      errors.push("Illegal characters replaced with underscores");
    }

    // Check filename length (Windows has 255 char limit for full path, we'll use 50 for filename)
    if (sanitizedName.length > 50) {
      sanitizedName = sanitizedName.substring(0, 50);
      errors.push("Filename truncated to 50 characters");
    }

    // Check for reserved Windows names
    const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i;
    if (reservedNames.test(sanitizedName)) {
      sanitizedName = `file_${sanitizedName}`;
      errors.push("Reserved filename modified");
    }

    // Check if it has a valid extension
    const hasValidExtension = validExtensions.some((ext) =>
      sanitizedName.toLowerCase().endsWith(ext.toLowerCase())
    );

    if (!hasValidExtension) {
      // Check if it has any extension
      const lastDotIndex = sanitizedName.lastIndexOf(".");
      if (lastDotIndex === -1 || lastDotIndex === sanitizedName.length - 1) {
        // No extension or ends with dot
        sanitizedName += ".txt";
        errors.push("Added .txt extension");
      } else {
        // Has extension but not valid for text editor
        const currentExt = sanitizedName.substring(lastDotIndex);
        sanitizedName = sanitizedName.substring(0, lastDotIndex) + ".txt";
        errors.push(`Changed ${currentExt} to .txt extension`);
      }
    }

    // Check for duplicate names
    const documentsFiles = JSON.parse(
      localStorage.getItem("documentsFiles") || "{}"
    );

    let finalName = sanitizedName;
    let counter = 1;
    while (documentsFiles[finalName] && finalName !== fileName) {
      const lastDotIndex = sanitizedName.lastIndexOf(".");
      const baseName = sanitizedName.substring(0, lastDotIndex);
      const extension = sanitizedName.substring(lastDotIndex);
      finalName = `${baseName}_${counter}${extension}`;
      counter++;
    }

    if (finalName !== sanitizedName) {
      errors.push(`Renamed to avoid duplicate: ${finalName}`);
      sanitizedName = finalName;
    }

    return {
      isValid: errors.length === 0,
      sanitizedName,
      errors,
    };
  };

  /**
   * Handle file deletion
   */
  const handleDelete = () => {
    if (!isUserSavedFile()) return;

    // Remove from localStorage
    localStorage.removeItem(`file_${fileName}`);

    // Remove from documentsFiles
    const documentsFiles = JSON.parse(
      localStorage.getItem("documentsFiles") || "{}"
    );
    delete documentsFiles[fileName];
    localStorage.setItem("documentsFiles", JSON.stringify(documentsFiles));

    // Show notification and close dialog
    showSaveNotification(`File ${fileName} deleted successfully!`);
    setShowDeleteDialog(false);

    // Trigger filesystem update
    window.dispatchEvent(new Event("filesystemUpdate"));

    // Reset to new file state
    handleNewFile();
  };
  /**
   * Handle input changes in save dialog with real-time validation
   */
  const handleDialogInputChange = (e) => {
    const value = e.target.value;
    setTempFileName(value);

    if (value.trim()) {
      const validation = validateFileName(value);
      setValidationErrors(validation.errors);
    } else {
      setValidationErrors(["Filename cannot be empty"]);
    }
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
      setValidationErrors([]);
      setTempFileName("");
    }
  };

  /**
   * Handle save button click in dialog
   */
  const handleDialogSave = () => {
    const input = document.querySelector(".modal input");
    handleSaveAs(input.value);
  };

  /**
   * Handle dialog open
   */
  const openSaveDialog = () => {
    setTempFileName(fileName === "untitled.txt" ? "" : fileName);
    setValidationErrors([]);
    setShowNameDialog(true);
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
        </button>{" "}
        <button
          onClick={openSaveDialog}
          disabled={isReadOnly}
          className={isReadOnly ? "disabled" : ""}
          title="Save with new name"
        >
          <FaFolderOpen /> Save As
        </button>
        {/* Delete button - only show for user-saved files */}
        {isUserSavedFile() && (
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="delete-btn"
            title="Delete this file"
          >
            <FaTrash /> Delete
          </button>
        )}
        {/* Markdown view toggle */}
        {isMarkdown && (
          <button
            onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
            title={viewMode === "edit" ? "Preview rendered markdown" : "Edit markdown source"}
          >
            {viewMode === "edit" ? <FaEye /> : <FaEdit />} {viewMode === "edit" ? "Preview" : "Edit"}
          </button>
        )}
        {/* File Status */}
        <span className="file-path">
          {fileName}
          {hasUnsavedChanges && "*"}
          {isReadOnly && "(Read Only)"}
        </span>
      </div>{" "}
      {/* Main Editor Area */}
      {isMarkdown && viewMode === "preview" ? (
        <div
          className="editor-content editor-markdown-preview"
          dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
        />
      ) : (
        <textarea
          className="editor-content"
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing..."
          readOnly={isReadOnly}
        />
      )}{" "}
      {saveNotification && (
        <div className="save-notification">{saveNotification}</div>
      )}
      {showNameDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Save File As</h3>
            <input
              type="text"
              placeholder="Enter filename..."
              value={tempFileName}
              onChange={handleDialogInputChange}
              onKeyDown={handleDialogKeyDown}
              autoFocus
            />

            {validationErrors.length > 0 && (
              <div className="validation-feedback">
                {validationErrors.map((error, index) => (
                  <div key={index} className="validation-error">
                    ⚠️ {error}
                  </div>
                ))}
              </div>
            )}
            <div className="modal-buttons">
              <button onClick={handleDialogSave}>Save</button>
              <button
                onClick={() => {
                  setShowNameDialog(false);
                  setValidationErrors([]);
                  setTempFileName("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete File</h3>
            <p>Are you sure you want to delete "{fileName}"?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-buttons">
              <button onClick={handleDelete} className="delete-confirm-btn">
                Delete
              </button>
              <button onClick={() => setShowDeleteDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
