/**
 * Terminal Commands Utility
 *
 * Handles execution of Linux-like system commands in the portfolio terminal.
 * Provides file system navigation, file operations, and system information commands.
 *
 * Features:
 * - File system navigation (ls, cd, pwd)
 * - File content viewing (cat)
 * - System information commands (whoami, date, uptime)
 * - Path resolution and validation
 * - Error handling for invalid commands/paths
 * - Integration with virtual file system
 *
 * @author Muneer
 * @module terminalCommands
 */

// ============================================================================
// IMPORTS
// ============================================================================

import { loadFileSystem } from "./fileSystemLoader";

// ============================================================================
// MAIN COMMAND EXECUTOR
// ============================================================================

/**
 * Execute system commands in the terminal
 * Handles various Linux-like commands including file operations and navigation
 *
 * @param {string} command - The command to execute
 * @param {string} currentPath - Current directory path
 * @param {Function} setCurrentPath - Function to update current path
 * @returns {Object} Command output result with output string
 */
export const executeSystemCommand = async (
  command,
  currentPath,
  setCurrentPath
) => {
  const args = command.trim().split(" ");
  const cmd = args[0].toLowerCase();
  let output = "";

  const fileSystem = await loadFileSystem();

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Get directory contents from the virtual file system
   * @param {string} path - Directory path to explore
   * @returns {Object|null} Directory contents or null if not found
   */
  const getDirectoryContents = (path) => {
    const pathParts = path.split("/").filter((p) => p);
    let currentDir = fileSystem["/"];

    for (let part of pathParts) {
      if (currentDir.children && currentDir.children[part]) {
        currentDir = currentDir.children[part];
      } else {
        return null;
      }
    }

    return currentDir.children || {};
  };

  /**
   * Get file content from the virtual file system
   * @param {string} path - File path to retrieve
   * @returns {Object|null} File object or null if not found
   */
  const getFileContent = (path) => {
    const pathParts = path.split("/").filter((p) => p);
    let currentItem = fileSystem["/"];

    for (let part of pathParts) {
      if (currentItem.children && currentItem.children[part]) {
        currentItem = currentItem.children[part];
      } else {
        return null;
      }
    }
    return currentItem.type === "file" ? currentItem : null;
  };

  // ============================================================================
  // COMMAND IMPLEMENTATIONS
  // ============================================================================
  switch (cmd) {
    // ------------------------------------------------------------------------
    // System Information Commands
    // ------------------------------------------------------------------------
    case "pwd":
      output = currentPath;
      break;

    case "whoami":
      output = "muneer";
      break;

    case "date":
      output = new Date().toString();
      break;

    case "uptime":
      output = "System uptime: 2 days, 14:32:15";
      break;

    // ------------------------------------------------------------------------
    // Directory Operations
    // ------------------------------------------------------------------------
    case "ls":
      const contents = getDirectoryContents(currentPath);
      if (contents) {
        const items = Object.entries(contents).map(([name, item]) =>
          item.type === "directory" ? `📁 ${name}` : `📄 ${name}`
        );
        output = items.length > 0 ? items.join("  ") : "Directory is empty";
      } else {
        output = "Directory not found";
      }
      break;

    case "cd":
      if (args[1] === "..") {
        // Go to parent directory
        const pathParts = currentPath.split("/").filter((p) => p);
        pathParts.pop();
        const newPath = pathParts.length > 0 ? "/" + pathParts.join("/") : "/";
        setCurrentPath(newPath);
        output = "";
      } else if (args[1]) {
        // Navigate to specified directory
        let newPath;
        if (args[1].startsWith("/")) {
          newPath = args[1];
        } else {
          newPath =
            currentPath === "/" ? "/" + args[1] : currentPath + "/" + args[1];
        }

        const dirContents = getDirectoryContents(newPath);
        if (dirContents !== null) {
          setCurrentPath(newPath);
          output = "";
        } else {
          output = `cd: ${args[1]}: No such file or directory`;
        }
      } else {
        // Go to home directory
        setCurrentPath("/home/muneer");
        output = "";
      }
      break;

    // ------------------------------------------------------------------------
    // File Operations
    // ------------------------------------------------------------------------
    case "cat":
      if (args[1]) {
        const filePath = args[1].startsWith("/")
          ? args[1]
          : currentPath + "/" + args[1];
        const fileObj = getFileContent(filePath);

        if (fileObj && fileObj.type === "file") {
          // Check if it's a text file
          const fileName = filePath.split("/").pop().toLowerCase();
          const textExtensions = [
            ".txt",
            ".md",
            ".js",
            ".json",
            ".html",
            ".css",
            ".xml",
            ".yml",
            ".yaml",
            ".log",
            ".cfg",
            ".conf",
            ".ini",
          ];
          const isTextFile = textExtensions.some((ext) =>
            fileName.endsWith(ext)
          );

          if (!isTextFile) {
            // Provide helpful error messages for different binary file types
            if (fileName.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
              output = `cat: ${args[1]}: Is a binary file (image). Use 'cv.png' to view CV image or open with image viewer.`;
            } else if (fileName.match(/\.(mp3|wav|ogg|flac|m4a|webm)$/)) {
              output = `cat: ${args[1]}: Is a binary file (audio). Use music player to play audio files.`;
            } else if (fileName.endsWith(".pdf")) {
              output = `cat: ${args[1]}: Is a binary file (PDF). Use 'cv.pdf' to view CV PDF or open with browser.`;
            } else {
              output = `cat: ${args[1]}: Is a binary file. cat only works with text files (.txt, .md, .js, .json, etc.)`;
            }
          } else {
            // Try to fetch the actual file content for text files
            try {
              const response = await fetch(filePath);
              if (response.ok) {
                const content = await response.text();
                output = content;
              } else {
                output = `cat: ${args[1]}: Permission denied or file not readable`;
              }
            } catch (error) {
              output = `cat: ${args[1]}: Error reading file`;
            }
          }
        } else {
          output = `cat: ${args[1]}: No such file or directory`;
        }
      } else {
        output = "cat: missing file operand";
      }
      break;

    // ------------------------------------------------------------------------
    // Default Case - Unknown Commands
    // ------------------------------------------------------------------------
    default:
      output = `Command not found: ${cmd}. Type "help" for available commands.`;
  }

  return { output };
};
