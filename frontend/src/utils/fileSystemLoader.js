/**
 * File System Loader Utility
 *
 * Dynamically loads the virtual file system structure from external
 * JSON configuration and provides fallback functionality for error cases.
 * Creates a Linux-like directory structure for the portfolio environment.
 *
 * Features:
 * - Dynamic loading from directory_structure.json
 * - Error handling with fallback file system
 * - Linux-style directory hierarchy (/home, /usr, /etc, /var)
 * - Extensible structure for portfolio content
 *
 * @author Muneer
 * @module fileSystemLoader
 */

// ============================================================================
// FILE SYSTEM LOADER
// ============================================================================

/**
 * Load the complete file system structure
 *
 * Attempts to fetch the directory structure from the public directory
 * and constructs a complete Linux-like file system hierarchy.
 * Integrates with localStorage to include user-saved files.
 *
 * @returns {Promise<Object>} Complete file system object
 */
export const loadFileSystem = async () => {
  try {
    // Fetch the user directory structure from public assets
    const res = await fetch("/home/muneer/directory_structure.json");
    const muneerDir = await res.json();

    // Load user-saved files from localStorage
    const documentsFiles = JSON.parse(
      localStorage.getItem("documentsFiles") || "{}"
    );

    // Merge localStorage files with existing Documents folder
    if (muneerDir.Documents && muneerDir.Documents.children) {
      // Add saved files to the Documents folder
      Object.entries(documentsFiles).forEach(([fileName, fileData]) => {
        muneerDir.Documents.children[fileName] = {
          type: "file",
          content: fileData.content,
          created: fileData.created,
          modified: fileData.modified || fileData.created,
        };
      });
    } else if (Object.keys(documentsFiles).length > 0) {
      // Create Documents folder if it doesn't exist and we have saved files
      if (!muneerDir.Documents) {
        muneerDir.Documents = {
          type: "directory",
          children: {},
        };
      }
      Object.entries(documentsFiles).forEach(([fileName, fileData]) => {
        muneerDir.Documents.children[fileName] = {
          type: "file",
          content: fileData.content,
          created: fileData.created,
          modified: fileData.modified || fileData.created,
        };
      });
    }

    // Construct the complete file system hierarchy
    const fileSystem = {
      "/": {
        type: "directory",
        children: {
          home: {
            type: "directory",
            children: {
              muneer: {
                type: "directory",
                children: muneerDir,
              },
            },
          },
          usr: {
            type: "directory",
            children: {
              bin: { type: "directory", children: {} },
              lib: { type: "directory", children: {} },
            },
          },
          etc: { type: "directory", children: {} },
          var: { type: "directory", children: {} },
        },
      },
    };

    return fileSystem;
  } catch (error) {
    console.error("Error loading file system:", error);
    return getDefaultFileSystem();
  }
};

// ============================================================================
// FALLBACK FILE SYSTEM
// ============================================================================

/**
 * Get default file system structure as fallback
 *
 * Provides a minimal but functional file system when the main
 * directory structure cannot be loaded from external sources.
 * Integrates with localStorage to include user-saved files.
 *
 * @returns {Object} Default file system object
 */
const getDefaultFileSystem = () => {
  // Load user-saved files from localStorage
  const documentsFiles = JSON.parse(
    localStorage.getItem("documentsFiles") || "{}"
  );

  // Create default Documents folder content
  const defaultDocuments = {
    "CV.txt": {
      type: "file",
      content:
        "Muneer Alam - Software Developer\n\nExperienced full-stack developer...",
    },
    "Cover_Letter.txt": {
      type: "file",
      content: "Dear Hiring Manager...",
    },
  };

  // Merge localStorage files with default files
  const documentsChildren = { ...defaultDocuments };
  Object.entries(documentsFiles).forEach(([fileName, fileData]) => {
    documentsChildren[fileName] = {
      type: "file",
      content: fileData.content,
      created: fileData.created,
      modified: fileData.modified || fileData.created,
    };
  });

  return {
    "/": {
      type: "directory",
      children: {
        home: {
          type: "directory",
          children: {
            muneer: {
              type: "directory",
              children: {
                Documents: {
                  type: "directory",
                  children: documentsChildren,
                },
                Desktop: {
                  type: "directory",
                  children: {},
                },
              },
            },
          },
        },
      },
    },
  };
};
