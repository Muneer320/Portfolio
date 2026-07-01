/**
 * Terminal Component
 *
 * A fully functional terminal emulator with command execution, file system navigation,
 * and portfolio-specific commands. Features include:
 * - Command history and navigation (arrow keys)
 * - Tab completion for commands and file paths
 * - Portfolio information commands (bio, education, skills, etc.)
 * - File system operations (ls, cd, cat, pwd)
 * - Terminal customization (font size, text color)
 * - CV viewing and download functionality
 * - Multi-command execution with semicolon separation
 * - Keyboard shortcuts for common operations
 *
 * @author Muneer
 * @component
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Core React imports
import React, { useState, useEffect, useRef } from "react";

// Data and utility imports
import { portfolioData } from "../data/portfolioData";
import { executeSystemCommand } from "../utils/terminalCommands";
import { loadFileSystem } from "../utils/fileSystemLoader";

// ============================================================================
// TERMINAL COMPONENT
// ============================================================================

/**
 * Terminal Component
 *
 * @param {Object} props - Component props
 * @param {string} props.currentPath - Current directory path
 * @param {Function} props.setCurrentPath - Function to update current path
 * @param {Function} props.onClose - Function to close terminal window
 * @param {Function} props.onOpenWindow - Function to open other windows (image viewer, browser)
 * @returns {JSX.Element} Terminal component
 */
const Terminal = ({ currentPath, setCurrentPath, onClose, onOpenWindow }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Terminal history and input state
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [terminalInput, setTerminalInput] = useState("");

  // Command history for arrow key navigation
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Terminal configuration state
  const [isTerminalStarted, setIsTerminalStarted] = useState(false);
  const [fontSize, setFontSize] = useState(0.85);
  const [textColor, setTextColor] = useState("white");

  // ============================================================================
  // REFS
  // ============================================================================

  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // ============================================================================
  // CONSTANTS
  // ============================================================================

  // Neofetch ASCII art and system information display
  const neofetchDisplay = `                   -'                    muneer@arch-portfolio 
                  .o+'                   --------------------- 
                 'ooo/                   OS: Arch Linux x86_64 
                '+oooo:                  Host: Portfolio System 
               '+oooooo:                 Kernel: 6.1.0-portfolio 
               -+oooooo+:                Uptime: 2 days, 14 hours, 32 mins 
             '/:-:++oooo+:               Packages: 1247 (pacman) 
            '/++++/+++++++:              Shell: bash 5.1.16 
           '/++++++++++++++:             Resolution: 1920x1080 
          '/+++ooooooooooooo/'           DE: Hyprland 
         ./ooosssso++osssssso+'          WM: Hyprland 
        .oossssso-''''/ossssss+'         Theme: Arch-Dark 
       -osssssso.      :ssssssso.        Icons: Papirus 
      :osssssss/        osssso+++.       Terminal: portfolio-term 
     /ossssssss/        +ssssooo/-       CPU: Intel i7-12700K (12) @ 3.60GHz 
   '/ossssso+/:-        -:/+osssso+-     GPU: NVIDIA GeForce RTX 4070 
  '+sso+:-'                 '.-/+oso:    Memory: 2547MiB / 32768MiB 
 '++:.                           '-/+/
 .'                                 '/'`;

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Convert rem value to 0-100 scale for user-friendly font size display
   * @param {number} rem - Font size in rem units
   * @returns {number} Scale value (0-100)
   */
  const remToScale = (rem) => Math.round(((rem - 0.6) / (1.5 - 0.6)) * 100);

  /**
   * Convert 0-100 scale to rem value for font size setting
   * @param {number} scale - Scale value (0-100)
   * @returns {number} Font size in rem units
   */
  const scaleToRem = (scale) => 0.6 + (scale / 100) * (1.5 - 0.6);

  /**
   * Add portfolio command suggestions to command output
   * @param {string} output - Original command output
   * @param {string} currentCommand - Current command to exclude from suggestions
   * @returns {string} Output with added suggestions
   */
  const addPortfolioSuggestions = (output, currentCommand) => {
    const portfolioCommands = [
      "bio",
      "education",
      "skills",
      "experience",
      "projects",
      "contact",
    ];
    const otherCommands = portfolioCommands.filter(
      (cmd) => cmd !== currentCommand
    );
    return output + `\n\nAlso try commands: ${otherCommands.join(", ")}`;
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Auto-run neofetch when terminal opens for the first time
   */
  useEffect(() => {
    if (!isTerminalStarted) {
      const neofetchCommand = {
        text: `muneer@arch-portfolio:${currentPath}$ neofetch`,
        type: "command",
      };
      const neofetchOutput = {
        text: neofetchDisplay,
        type: "neofetch",
      };
      setTerminalHistory([neofetchCommand, neofetchOutput]);
      setIsTerminalStarted(true);
    }
  }, [isTerminalStarted, currentPath, neofetchDisplay]);

  /**
   * Auto-scroll terminal to bottom when new content is added
   */
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);
  /**
   * Focus input when terminal opens
   */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  /**
   * Auto-resize textarea when input value changes programmatically
   */
  useEffect(() => {
    if (inputRef.current) {
      autoResizeTextarea(inputRef.current);
    }
  }, [terminalInput]);

  // ============================================================================
  // TAB COMPLETION FUNCTIONALITY
  // ============================================================================

  /**
   * Handle tab completion for commands and file paths
   */
  const handleTabCompletion = async () => {
    const input = terminalInput.trim();
    const parts = input.split(" ");

    if (parts.length === 1) {
      // Command completion
      const allCommands = [
        "help",
        "clear",
        "cls",
        "neofetch",
        "ls",
        "pwd",
        "cd",
        "cat",
        "whoami",
        "date",
        "uptime",
        "bio",
        "education",
        "skills",
        "experience",
        "projects",
        "contact",
        "cv",
        "cv.png",
        "cv.pdf",
        "download-cv",
        "pacman",
        "fontsize",
        "textcolor",
        "reset-terminal",
      ];

      const matches = allCommands.filter((cmd) =>
        cmd.startsWith(input.toLowerCase())
      );

      if (matches.length === 1) {
        setTerminalInput(matches[0] + " ");
      } else if (matches.length > 1) {
        const suggestion = `Available completions: ${matches.join(", ")}`;
        const commandLine = {
          text: `muneer@arch-portfolio:${currentPath}$ ${input}`,
          type: "command",
        };
        const outputLine = {
          text: suggestion,
          type: "output",
        };
        setTerminalHistory((prev) => [...prev, commandLine, outputLine]);
      }
    } else if (
      parts.length >= 2 &&
      (parts[0].toLowerCase() === "cd" ||
        parts[0].toLowerCase() === "cat" ||
        parts[0].toLowerCase() === "ls")
    ) {
      // File/directory completion
      try {
        const fileSystem = await loadFileSystem();
        const currentArg = parts[parts.length - 1];

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

        const contents = getDirectoryContents(currentPath);
        if (contents) {
          const items = Object.keys(contents);
          const matches = items.filter((item) =>
            item.toLowerCase().startsWith(currentArg.toLowerCase())
          );

          if (matches.length === 1) {
            const newInput = parts.slice(0, -1).join(" ") + " " + matches[0];
            setTerminalInput(
              newInput + (contents[matches[0]].type === "directory" ? "/" : " ")
            );
          } else if (matches.length > 1) {
            const suggestion = `Available completions: ${matches.join(", ")}`;
            const commandLine = {
              text: `muneer@arch-portfolio:${currentPath}$ ${input}`,
              type: "command",
            };
            const outputLine = {
              text: suggestion,
              type: "output",
            };
            setTerminalHistory((prev) => [...prev, commandLine, outputLine]);
          }
        }
      } catch (error) {
        console.error("Tab completion error:", error);
      }
    }
  };

  // ============================================================================
  // COMMAND EXECUTION
  // ============================================================================

  /**
   * Execute a single command and update terminal history
   * @param {string} command - Command to execute
   */
  const executeCommand = async (command) => {
    const args = command.trim().split(" ");
    const cmd = args[0].toLowerCase();
    let output = "";

    // Add command to history if not empty
    if (command.trim()) {
      setCommandHistory((prev) => [...prev, command]);
      setHistoryIndex(-1);
    }

    switch (cmd) {
      case "help":
        output = `Available commands:
• Standard: ls, pwd, cd, cat, clear, neofetch
• Portfolio: bio, education, skills, experience, projects, contact
• CV: CV (combined portfolio info), CV.png (image), CV.pdf (browser), download-cv (download PDF)
• Pacman: pacman -S cv.img, pacman -S cv.pdf
• System: whoami, date, uptime
• Terminal: fontsize, textcolor, reset-terminal

Tips:
• Use semicolon (;) to run multiple commands: "ls; pwd; whoami"
• Use fontsize increase/decrease or fontsize [0-100] to adjust text size
• Use textcolor [color] to change text color (white, green, blue, yellow, red, purple, orange, cyan)
• Use arrow keys to navigate command history
• Use Tab key for command and file/directory name completion

Keyboard shortcuts:
• Tab: Auto-complete commands and file/directory names
• Ctrl + Plus/Equal: Increase font size
• Ctrl + Minus: Decrease font size  
• Ctrl + 0: Reset font size to default`;
        break;

      case "neofetch":
        output = neofetchDisplay;
        const neofetchCommandLine = {
          text: `muneer@arch-portfolio:${currentPath}$ ${command}`,
          type: "command",
        };
        const neofetchOutputLine = {
          text: output,
          type: "neofetch",
        };
        setTerminalHistory((prev) => [
          ...prev,
          neofetchCommandLine,
          neofetchOutputLine,
        ]);
        return;

      // Portfolio information commands
      case "bio":
        output = addPortfolioSuggestions(portfolioData.bio, "bio");
        break;
      case "education":
        output = addPortfolioSuggestions(portfolioData.education, "education");
        break;
      case "skills":
        output = addPortfolioSuggestions(portfolioData.skills, "skills");
        break;
      case "experience":
        output = addPortfolioSuggestions(
          portfolioData.experience,
          "experience"
        );
        break;
      case "projects":
        output = addPortfolioSuggestions(portfolioData.projects, "projects");
        break;
      case "contact":
        output = addPortfolioSuggestions(portfolioData.contact, "contact");
        break;

      // CV commands
      case "cv":
        const cvData = `${portfolioData.bio}

${portfolioData.education}

${portfolioData.skills}

${portfolioData.experience}

${portfolioData.projects}

${portfolioData.contact}`;
        output =
          cvData +
          `\n\nAlso try: CV.png (image view), CV.pdf (browser view), download-cv (download PDF)`;
        break;

      case "cv.png":
        if (onOpenWindow) {
          try {
            const fileSystem = await loadFileSystem();
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

            const fileObj = getFileContent("/home/muneer/Documents/CV.png");
            onOpenWindow(
              "imageviewer",
              "/home/muneer/Documents/CV.png",
              fileObj
            );
            output = "Opening CV image in image viewer...";
          } catch (error) {
            output = "Error loading CV image: " + error.message;
          }
        } else {
          output =
            "Image viewer not available. Use 'cat /home/muneer/Documents/CV.png' to view file details.";
        }
        break;

      case "cv.pdf":
        if (onOpenWindow) {
          try {
            const fileSystem = await loadFileSystem();
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

            const fileObj = getFileContent("/home/muneer/Documents/CV.pdf");
            onOpenWindow("browser", "/home/muneer/Documents/CV.pdf", fileObj);
            output = "Opening CV PDF in browser...";
          } catch (error) {
            output = "Error loading CV PDF: " + error.message;
          }
        } else {
          output =
            "Browser not available. Use 'cat /home/muneer/Documents/CV.pdf' to view file details.";
        }
        break;

      case "download-cv":
        try {
          const link = document.createElement("a");
          link.href = process.env.PUBLIC_URL + "/home/muneer/Documents/CV.pdf";
          link.download = "Muneer_CV.pdf";
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          output = "CV download started...";
        } catch (error) {
          output =
            "Download failed. Please try opening CV.pdf in browser and download from there.";
        }
        break;

      // Pacman package manager commands (Arch Linux themed)
      case "pacman":
        if (args[1] === "-S" || args[1] === "-s") {
          const packageName = args[2] ? args[2].toLowerCase() : "";

          if (packageName === "cv.img" || packageName === "cv.png") {
            // Download CV image
            if (onOpenWindow) {
              try {
                const fileSystem = await loadFileSystem();
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

                const fileObj = getFileContent("/home/muneer/Documents/CV.png");
                onOpenWindow(
                  "imageviewer",
                  "/home/muneer/Documents/CV.png",
                  fileObj
                );
                output = `:: Synchronizing package databases...
:: Starting full system upgrade...
resolving dependencies...
looking for conflicting packages...

Packages (1) cv.img-1.0.0-1

Total Download Size:   2.45 MiB
Total Installed Size:  2.45 MiB

:: Proceed with installation? [Y/n] Y
:: Retrieving packages...
 cv.img-1.0.0-1-x86_64      2.45 MiB  1024 KiB/s 00:02 [##################] 100%
(1/1) checking keys in keyring                   [##################] 100%
(1/1) checking package integrity                 [##################] 100%
(1/1) loading package files                      [##################] 100%
(1/1) checking for file conflicts                [##################] 100%
(1/1) checking available disk space              [##################] 100%
:: Processing package changes...
(1/1) installing cv.img                          [##################] 100%
Opening CV image...`;
              } catch (error) {
                output = `error: failed to retrieve 'cv.img' from server
error: failed to commit transaction (download library error)
Errors occurred, no packages were upgraded.`;
              }
            } else {
              output = `error: failed to retrieve 'cv.img' from server
error: image viewer not available
Errors occurred, no packages were upgraded.`;
            }
          } else if (packageName === "cv.pdf") {
            // Download CV PDF
            try {
              const link = document.createElement("a");
              link.href =
                process.env.PUBLIC_URL + "/home/muneer/Documents/CV.pdf";
              link.download = "Muneer_CV.pdf";
              link.target = "_blank";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              output = `:: Synchronizing package databases...
:: Starting full system upgrade...
resolving dependencies...
looking for conflicting packages...

Packages (1) cv.pdf-1.0.0-1

Total Download Size:   1.23 MiB
Total Installed Size:  1.23 MiB

:: Proceed with installation? [Y/n] Y
:: Retrieving packages...
 cv.pdf-1.0.0-1-x86_64      1.23 MiB  1024 KiB/s 00:01 [##################] 100%
(1/1) checking keys in keyring                   [##################] 100%
(1/1) checking package integrity                 [##################] 100%
(1/1) loading package files                      [##################] 100%
(1/1) checking for file conflicts                [##################] 100%
(1/1) checking available disk space              [##################] 100%
:: Processing package changes...
(1/1) installing cv.pdf                          [##################] 100%
CV download started...`;
            } catch (error) {
              output = `error: failed to retrieve 'cv.pdf' from server
error: failed to commit transaction (download library error)
Errors occurred, no packages were upgraded.`;
            }
          } else if (packageName) {
            output = `error: target not found: ${packageName}
Available packages: cv.img, cv.pdf`;
          } else {
            output = `error: no targets specified (use -h for help)

Usage: pacman -S <package>
Available packages:
  cv.img  - Download CV image file
  cv.pdf  - Download CV PDF file`;
          }
        } else {
          output = `usage:  pacman <operation> [...]
operations:
    -S, --sync      synchronize packages

Try 'pacman -S cv.img' or 'pacman -S cv.pdf' to download CV files`;
        }
        break;

      // Terminal customization commands
      case "fontsize":
        if (args[1] === "increase" || args[1] === "+") {
          const newSize = Math.min(1.5, fontSize + 0.1);
          setFontSize(newSize);
          const scale = remToScale(newSize);
          output = `Font size increased to ${scale}`;
        } else if (args[1] === "decrease" || args[1] === "-") {
          const newSize = Math.max(0.6, fontSize - 0.1);
          setFontSize(newSize);
          const scale = remToScale(newSize);
          output = `Font size decreased to ${scale}`;
        } else if (args[1] && !isNaN(parseFloat(args[1]))) {
          const inputScale = Math.max(0, Math.min(100, parseFloat(args[1])));
          const newSize = scaleToRem(inputScale);
          setFontSize(newSize);
          output = `Font size set to ${inputScale}`;
        } else {
          const currentScale = remToScale(fontSize);
          output = `Usage: fontsize [increase|+|decrease|-|scale]
Current size: ${currentScale} (Range: 0-100)`;
        }
        break;

      case "textcolor":
        const colors = {
          white: "white",
          green: "#00ff41",
          blue: "#61dafb",
          yellow: "#ffff00",
          red: "#ff6b6b",
          purple: "#bd93f9",
          orange: "#ff9500",
          cyan: "#00ffff",
        };

        if (args[1] && colors[args[1].toLowerCase()]) {
          setTextColor(colors[args[1].toLowerCase()]);
          output = `Text color changed to ${args[1]}`;
        } else if (args[1] && args[1].startsWith("#") && args[1].length === 7) {
          setTextColor(args[1]);
          output = `Text color changed to ${args[1]}`;
        } else {
          output = `Usage: textcolor [white|green|blue|yellow|red|purple|orange|cyan|#hexcode]
Available colors: ${Object.keys(colors).join(", ")}
Current color: ${textColor}`;
        }
        break;

      case "reset-terminal":
        setFontSize(0.85);
        setTextColor("white");
        const defaultScale = remToScale(0.85);
        output = `Terminal settings reset to default (Font: ${defaultScale}, Color: white)`;
        break;

      // Clear commands
      case "clear":
      case "cls":
        setTerminalHistory([]);
        return;

      default:
        // Try system commands
        const result = await executeSystemCommand(
          command,
          currentPath,
          setCurrentPath
        );
        output = result.output;
    }

    // Add command and output to terminal history
    const commandLine = {
      text: `muneer@arch-portfolio:${currentPath}$ ${command}`,
      type: "command",
    };
    const outputLine = {
      text: output,
      type: "output",
    };

    setTerminalHistory((prev) => [...prev, commandLine, outputLine]);
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  /**
   * Handle terminal command submission
   * @param {Event} e - Event object (can be form submission or keyboard event)
   */
  const handleTerminalSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (terminalInput.trim()) {
      // Support multiple commands separated by semicolon
      const commands = terminalInput
        .split(";")
        .map((cmd) => cmd.trim())
        .filter((cmd) => cmd);

      // Execute commands sequentially with small delay for better UX
      for (let i = 0; i < commands.length; i++) {
        await new Promise((resolve) => {
          setTimeout(async () => {
            await executeCommand(commands[i]);
            resolve();
          }, i * 100);
        });
      }

      setTerminalInput("");
    }
  };
  /**
   * Auto-resize textarea based on content
   * @param {HTMLElement} textarea - The textarea element to resize
   */
  const autoResizeTextarea = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 130) + "px"; // Max 10 lines
    }
  };

  /**
   * Handle input changes and auto-resize
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    setTerminalInput(e.target.value);
    autoResizeTextarea(e.target);
  };
  /**
   * Handle keyboard events for shortcuts and navigation
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    // Enter key handling for form submission
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTerminalSubmit(e);
      return;
    }

    // Tab completion
    if (e.key === "Tab") {
      e.preventDefault();
      handleTabCompletion();
      return;
    }

    // Font size shortcuts
    if (e.ctrlKey) {
      if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        const newSize = Math.min(1.5, fontSize + 0.1);
        setFontSize(newSize);
        return;
      } else if (e.key === "-") {
        e.preventDefault();
        const newSize = Math.max(0.6, fontSize - 0.1);
        setFontSize(newSize);
        return;
      } else if (e.key === "0") {
        e.preventDefault();
        setFontSize(0.85);
        return;
      }
    }

    // Command history navigation
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setTerminalInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setTerminalInput("");
        } else {
          setHistoryIndex(newIndex);
          setTerminalInput(commandHistory[newIndex]);
        }
      }
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div
      className="terminal"
      style={{ fontSize: `${fontSize}rem`, color: textColor }}
    >
      <div className="terminal-output" ref={terminalRef}>
        {terminalHistory.map((entry, i) => (
          <div
            key={i}
            className={`terminal-line ${
              entry.type === "command"
                ? "command-line"
                : entry.type === "output"
                ? "output-line"
                : entry.type === "neofetch"
                ? "neofetch-output"
                : ""
            }`}
          >
            {entry.text}
          </div>
        ))}{" "}
        <div className="terminal-line current-command">
          <div className="terminal-input-form">
            <span className="terminal-prompt">
              muneer@arch-portfolio:{currentPath}${" "}
            </span>
            <textarea
              ref={inputRef}
              value={terminalInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              aria-label="Terminal command input"
              autoFocus
              rows={1}
              style={{ minHeight: "1.3em", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
