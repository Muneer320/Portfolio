import React, { useState, useEffect } from "react";

const TextEditor = ({ filePath, fileObj, onClose, windowId }) => {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  useEffect(() => {
    const loadFileContent = async () => {
      if (fileObj && fileObj.content) {
        // If file object has content, use it
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

  const handleContentChange = (e) => {
    if (!isReadOnly) {
      setContent(e.target.value);
      setHasUnsavedChanges(true);
    }
  };

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

  const handleNewFile = () => {
    setContent("");
    setFileName("untitled.txt");
    setIsReadOnly(false);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="text-editor">
      <div className="editor-toolbar">
        <button onClick={handleNewFile}>📄 New</button>
        <button
          onClick={handleSave}
          disabled={isReadOnly}
          className={isReadOnly ? "disabled" : ""}
        >
          💾 Save
        </button>
        <button
          onClick={() => setShowNameDialog(true)}
          disabled={isReadOnly}
          className={isReadOnly ? "disabled" : ""}
        >
          💾 Save As
        </button>
        <span className="file-path">
          {fileName} {hasUnsavedChanges && "*"} {isReadOnly && "(Read Only)"}
        </span>
      </div>

      <textarea
        className="editor-content"
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing..."
        readOnly={isReadOnly}
      />

      {showNameDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Save File As</h3>
            <input
              type="text"
              placeholder="Enter filename..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveAs(e.target.value);
                } else if (e.key === "Escape") {
                  setShowNameDialog(false);
                }
              }}
              autoFocus
            />
            <div className="modal-buttons">
              <button
                onClick={() => {
                  const input = document.querySelector(".modal input");
                  handleSaveAs(input.value);
                }}
              >
                Save
              </button>
              <button onClick={() => setShowNameDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
