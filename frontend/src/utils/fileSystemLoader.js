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
 *
 * @returns {Promise<Object>} Complete file system object
 */
export const loadFileSystem = async () => {
  try {
    // Fetch the user directory structure from public assets
    const res = await fetch("/home/muneer/directory_structure.json");
    const muneerDir = await res.json();

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
 *
 * @returns {Object} Default file system object
 */
const getDefaultFileSystem = () => {
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
                  children: {
                    "CV.txt": {
                      type: "file",
                      content:
                        "Muneer Alam - Software Developer\n\nExperienced full-stack developer...",
                    },
                    "Cover_Letter.txt": {
                      type: "file",
                      content: "Dear Hiring Manager...",
                    },
                  },
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
