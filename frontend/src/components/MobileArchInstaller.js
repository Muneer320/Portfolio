/**
 * Mobile Arch Installer Component
 *
 * A mobile-optimized Arch Linux installation simulation that provides
 * an engaging portfolio experience for smaller screens. Features an
 * authentic installation process, boot sequence, and desktop environment.
 *
 * @component
 * @author Muneer Alam
 */

import React, { useState, useEffect, useRef } from "react";
import { portfolioData } from "../data/portfolioData";
import { executeSystemCommand } from "../utils/terminalCommands";
import { loadFileSystem } from "../utils/fileSystemLoader";
import "../styles/mobile-arch-installer.css";
import {
  FaTerminal,
  FaFolder,
  FaUser,
  FaLaptopCode,
  FaBriefcase,
  FaEnvelope,
  FaDesktop,
  FaServer,
  FaCog,
  FaRocket,
  FaTimes,
  FaChevronRight,
  FaCheckCircle,
  FaHome,
  FaChartBar,
  FaClock,
  FaMobile,
  FaFileAlt,
  FaDownload,
  FaEye,
} from "react-icons/fa";
import { GrArchlinux } from "react-icons/gr";

const MobileArchInstaller = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [currentPhase, setCurrentPhase] = useState("welcome");
  const [installStep, setInstallStep] = useState(0);
  const [bootStep, setBootStep] = useState(0);
  const [showBootLog, setShowBootLog] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Terminal-specific state
  const [currentPath, setCurrentPath] = useState("/home/muneer");
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [terminalInput, setTerminalInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTerminalStarted, setIsTerminalStarted] = useState(false);

  // ============================================================================
  // REFS
  // ============================================================================

  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Auto-resize textarea based on content (like desktop terminal)
   * @param {HTMLTextAreaElement} textarea - The textarea element to resize
   */
  const autoResizeTextarea = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 130) + "px";
    }
  };

  /**
   * Parse markdown links and convert them to React elements
   * @param {string} text - Text containing markdown links
   * @returns {JSX.Element[]} Array of text and link elements
   */
  const parseMarkdownLinks = (text) => {
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = markdownLinkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add the link
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="markdown-link"
        >
          {match[1]}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last link
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  // ============================================================================
  // CONFIGURATION DATA
  // ============================================================================

  const installSteps = [
    {
      title: "Partitioning Disk",
      description: "Organizing portfolio sections...",
      techDescription: "Creating partitions: /skills, /projects, /about",
      duration: 2000,
      content: "skills",
    },
    {
      title: "Installing Base System",
      description: "Loading core information...",
      techDescription: "Installing base packages: linux, systemd, bash",
      duration: 2500,
      content: "bio",
    },
    {
      title: "Installing Packages",
      description: "Adding specialized tools...",
      techDescription: "Installing: react nodejs python docker git",
      duration: 3000,
      content: "experience",
    },
    {
      title: "Configuring System",
      description: "Personalizing experience...",
      techDescription: "Copying dotfiles, enabling services",
      duration: 2000,
      content: "projects",
    },
  ];

  const bootMessages = [
    "[ 0.001] Initializing Muneer's Portfolio System...",
    "[ 0.234] Loading professional modules... OK",
    "[ 0.445] Mounting /projects filesystem... OK",
    "[ 0.678] Starting skill services... OK",
    "[ 0.891] Detecting display resolution... MOBILE",
    "[ 1.234] Desktop environment requires larger screen",
    "[ 1.445] Loading mobile-optimized interface... OK",
    "[ 1.678] System ready. Welcome to Muneer's Portfolio!",
  ];

  const desktopApps = [
    {
      id: "terminal",
      name: "Terminal",
      icon: <FaTerminal />,
      description: "Command-line interface",
      content: "Interactive terminal with portfolio commands",
    },
    {
      id: "filemanager",
      name: "Projects",
      icon: <FaFolder />,
      description: "Browse projects",
      content: portfolioData.projects,
    },
    {
      id: "about",
      name: "About",
      icon: <FaUser />,
      description: "Personal information",
      content: portfolioData.bio,
    },
    {
      id: "skills",
      name: "Skills",
      icon: <FaLaptopCode />,
      description: "Technical abilities",
      content: portfolioData.skills,
    },
    {
      id: "experience",
      name: "Experience",
      icon: <FaBriefcase />,
      description: "Work history",
      content: portfolioData.experience,
    },
    {
      id: "contact",
      name: "Contact",
      icon: <FaEnvelope />,
      description: "Get in touch",
      content: portfolioData.contact,
    },
    {
      id: "resume",
      name: "Resume/CV",
      icon: <FaFileAlt />,
      description: "View & download CV",
      content: "cv",
    },
  ];

  // ============================================================================
  // EFFECTS AND HANDLERS
  // ============================================================================

  // Auto-start installation after welcome screen
  useEffect(() => {
    if (currentPhase === "welcome") {
      const timer = setTimeout(() => {
        setCurrentPhase("installing");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentPhase]);

  // Handle installation step progression
  useEffect(() => {
    if (currentPhase === "installing") {
      const timer = setTimeout(() => {
        if (installStep < installSteps.length - 1) {
          setInstallStep(installStep + 1);
        } else {
          setCurrentPhase("booting");
          setShowBootLog(true);
        }
      }, installSteps[installStep].duration);
      return () => clearTimeout(timer);
    }
  }, [currentPhase, installStep]);

  // Handle boot sequence progression
  useEffect(() => {
    if (showBootLog && bootStep < bootMessages.length) {
      const timer = setTimeout(() => {
        setBootStep(bootStep + 1);
        if (bootStep === bootMessages.length - 1) {
          setTimeout(() => setShowDesktop(true), 1000);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showBootLog, bootStep]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const openApp = (app) => {
    setSelectedApp(app);
    if (app.id === "terminal") {
      setIsTerminalStarted(true);
      // Auto-run neofetch when terminal opens
      setTimeout(() => {
        executeCommand("neofetch");
      }, 500);
    }
  };

  const closeApp = () => {
    setSelectedApp(null);
  };

  // ============================================================================
  // TERMINAL FUNCTIONALITY
  // ============================================================================

  /**
   * Execute a single command and update terminal history
   * @param {string} command - Command to execute
   */
  const executeCommand = async (command) => {
    if (!command.trim()) return;

    // Support multiple commands separated by semicolon
    const commands = command.split(";").map(cmd => cmd.trim()).filter(cmd => cmd);

    // Execute commands sequentially
    for (let i = 0; i < commands.length; i++) {
      await new Promise(resolve => {
        setTimeout(async () => {
          await executeInternalCommand(commands[i]);
          resolve();
        }, i * 100);
      });
    }
  };

  /**
   * Execute a single internal command
   * @param {string} command - Command to execute
   */
  const executeInternalCommand = async (command) => {
    if (!command.trim()) return;

    // Add to command history for arrow key navigation
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    let output = "";

    // Handle portfolio-specific commands
    if (command.trim() === "bio") {
      output = portfolioData.bio;
    } else if (command.trim() === "skills") {
      output = portfolioData.skills;
    } else if (command.trim() === "experience") {
      output = portfolioData.experience;
    } else if (command.trim() === "projects") {
      output = portfolioData.projects;
    } else if (command.trim() === "education") {
      output = portfolioData.education;
    } else if (command.trim() === "contact") {
      output = portfolioData.contact;
    } else if (command.trim() === "cv") {
      const cvData = `${portfolioData.bio}

${portfolioData.education}

${portfolioData.skills}

${portfolioData.experience}

${portfolioData.projects}

${portfolioData.contact}`;
      output = cvData + `\n\nAlso try: cv.png (image view), cv.pdf (browser view), download-cv (download PDF)`;
    } else if (command.trim() === "cv.pdf") {
      output = "Opening CV PDF in browser...";
      // Open CV PDF in a new tab
      setTimeout(() => {
        window.open('/home/muneer/Documents/CV.pdf', '_blank');
      }, 500);
    } else if (command.trim() === "download-cv") {
      try {
        const link = document.createElement('a');
        link.href = '/home/muneer/Documents/CV.pdf';
        link.download = 'Muneer_Alam_Resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        output = "CV download started...";
      } catch (error) {
        output = "Download failed. Please try opening CV.pdf in browser and download from there.";
      }
    } else if (command.trim().startsWith("pacman")) {
      const args = command.trim().split(" ");
      if (args[1] === "-S" || args[1] === "-s") {
        const packageName = args[2] ? args[2].toLowerCase() : "";

        if (packageName === "cv.img" || packageName === "cv.png") {
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
          // Try to open CV image
          setTimeout(() => {
            window.open('/home/muneer/Documents/CV.png', '_blank');
          }, 1000);
        } else if (packageName === "cv.pdf") {
          try {
            const link = document.createElement('a');
            link.href = '/home/muneer/Documents/CV.pdf';
            link.download = 'Muneer_Alam_Resume.pdf';
            link.target = '_blank';
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
    } else if (command.trim() === "help") {
      output = `Available commands:

System commands:
  ls          - List directory contents
  cd [dir]    - Change directory
  cat [file]  - Display file contents
  pwd         - Show current directory
  clear       - Clear terminal screen
  whoami      - Show current user
  date        - Show current date
  uptime      - Show system uptime

Portfolio commands:
  bio         - Personal background
  skills      - Technical skills
  experience  - Work experience
  projects    - Portfolio projects
  education   - Educational background
  contact     - Contact information
  neofetch    - Display system information

CV commands:
  cv          - Combined portfolio information
  cv.png      - View CV image (if image viewer available)
  cv.pdf      - View CV PDF (if browser available)
  download-cv - Download CV PDF file

Pacman (Package Manager):
  pacman -S cv.img  - Download CV image
  pacman -S cv.pdf  - Download CV PDF

Tips:
• Use semicolon (;) to run multiple commands
• Use arrow keys to navigate command history
• Use Tab for command completion (if available)`;
    } else if (command.trim() === "neofetch") {
      output = `                   -'                    muneer@arch-portfolio 
                  .o+'                   --------------------- 
                 'ooo/                   OS: Arch Linux x86_64 
                '+oooo:                  Host: Portfolio System 
               '+oooooo:                 Kernel: 6.1.0-portfolio 
               -+oooooo+:                Uptime: 2 days, 14 hours, 32 mins 
             '/:-:++oooo+:               Packages: 1247 (pacman) 
            '/++++/+++++++:              Shell: bash 5.1.16 
           '/++++++++++++++:             Resolution: ${window.innerWidth}x${window.innerHeight} 
          '/+++ooooooooooooo/'           DE: Mobile Interface 
         ./ooosssso++osssssso+'          WM: Mobile Window Manager 
        .oossssso-''''/ossssss+'         Theme: Arch-Dark 
       -osssssso.      :ssssssso.        Icons: Papirus 
      :osssssss/        osssso+++.       Terminal: mobile-portfolio-term 
     /ossssssss/        +ssssooo/-       CPU: Device CPU 
   '/ossssso+/:-        -:/+osssso+-     GPU: Device GPU 
  '+sso+:-'                 '.-/+oso:    Memory: Available RAM 
 '++:.                           '-/+/
 .'                                 '/'`;

      // Special handling for neofetch like desktop - add both command and output
      const neofetchCommandLine = {
        content: `muneer@arch-portfolio:${currentPath}$ ${command}`,
        type: "command",
      };
      const neofetchOutputLine = {
        content: output,
        type: "neofetch",
      };
      setTerminalHistory(prev => [...prev, neofetchCommandLine, neofetchOutputLine]);
      return;
    } else if (command.trim() === "clear") {
      setTerminalHistory([]);
      return;
    } else if (command.trim() === "whoami") {
      output = "muneer";
    } else if (command.trim() === "date") {
      output = new Date().toString();
    } else if (command.trim() === "uptime") {
      output = "System uptime: 2 days, 14:32:15";
    } else if (command.trim() === "pwd") {
      output = currentPath;
    } else {
      // Execute system command
      const result = await executeSystemCommand(command, currentPath, setCurrentPath);
      output = result.output;
    }

    // Add command and output to terminal history (like desktop)
    const commandLine = {
      content: `muneer@arch-portfolio:${currentPath}$ ${command}`,
      type: "command",
    };
    const outputLine = {
      content: output,
      type: "output",
    };

    setTerminalHistory(prev => [...prev, commandLine, outputLine]);

    // Clear input
    setTerminalInput("");
  };

  /**
   * Handle keyboard input in terminal
   */
  const handleTerminalKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand(terminalInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setTerminalInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
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
    if (selectedApp?.id === "terminal" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedApp]);

  /**
   * Auto-resize textarea when input value changes programmatically
   */
  useEffect(() => {
    if (inputRef.current) {
      autoResizeTextarea(inputRef.current);
    }
  }, [terminalInput]);

  // ============================================================================
  // RENDER METHODS
  // ============================================================================

  const renderCVContent = () => (
    <div className="cv-content">
      <div className="cv-preview">
        <div className="cv-info">
          <h4>📄 Muneer Alam - Resume/CV</h4>
          <p>Professional resume highlighting my experience, skills, and achievements in software development.</p>

          <div className="cv-details">
            <div className="cv-detail-item">
              <strong>Format:</strong> PDF Document
            </div>
            <div className="cv-detail-item">
              <strong>Last Updated:</strong> December 2024
            </div>
            <div className="cv-detail-item">
              <strong>File Size:</strong> ~2MB
            </div>
          </div>
        </div>

        <div className="cv-actions">
          <button
            className="cv-action-btn view-btn"
            onClick={() => window.open('/home/muneer/Documents/CV.pdf', '_blank')}
          >
            <FaEye /> View CV
          </button>
          <button
            className="cv-action-btn download-btn"
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/home/muneer/Documents/CV.pdf';
              link.download = 'Muneer_Alam_Resume.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <FaDownload /> Download CV
          </button>
        </div>

        <div className="cv-note">
          <p><em>💡 You can also find my CV in markdown format in the About section, and various formats via the file explorer in the full Desktop version.</em></p>
        </div>
      </div>
    </div>
  );

  const renderTerminal = () => (
    <div className="mobile-terminal-fullscreen">
      <div className="terminal-header">
        <div className="terminal-title">
          <FaTerminal /> Terminal - muneer@arch-portfolio
        </div>
        <button className="terminal-close" onClick={closeApp}>
          <FaTimes />
        </button>
      </div>

      <div className="terminal-content">
        <div className="terminal-output" ref={terminalRef}>
          <div className="terminal-welcome">
            <p>Welcome to Muneer's Portfolio Terminal!</p>
            <p>Type 'help' for available commands.</p>
            <p></p>
          </div>

          {terminalHistory.map((item, index) => (
            <div key={index} className={`terminal-line ${item.type === "command"
                ? "command-line"
                : item.type === "output"
                  ? "output-line"
                  : item.type === "neofetch"
                    ? "neofetch-output"
                    : ""
              }`}>
              {item.content}
            </div>
          ))}

          <div className="terminal-line current-command">
            <div className="terminal-input-form">
              <span className="terminal-prompt">muneer@arch-portfolio:{currentPath}$ </span>
              <textarea
                ref={inputRef}
                value={terminalInput}
                onChange={(e) => {
                  setTerminalInput(e.target.value);
                  autoResizeTextarea(e.target);
                }}
                onKeyDown={handleTerminalKeyDown}
                className="terminal-input"
                autoFocus
                rows={1}
                style={{ minHeight: "1.3em", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWelcome = () => (
    <div className="arch-welcome">
      <div className="arch-header">
        <div className="arch-logo">
          <div className="arch-icon">
            <GrArchlinux />
          </div>
          <h1>Arch Linux</h1>
          <div className="arch-version">Portfolio Edition v2.0</div>
        </div>
        <p className="arch-subtitle">
          Welcome to <span className="highlight-name">Muneer</span>'s{" "}
          Professional System
        </p>
      </div>

      <div className="boot-info">
        <div className="system-specs">
          <h3>
            <FaDesktop /> System Information:
          </h3>
          <div className="spec-grid">
            <div className="spec-item">
              <span className="spec-label">Architecture: </span>
              <span className="spec-value">x86_64 (Portfolio)</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Kernel: </span>
              <span className="spec-value">muneer-portfolio-2_0</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Display: </span>
              <span className="spec-value">Mobile Optimized</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Full Desktop: </span>
              <span className="spec-value">Available on larger screens</span>
            </div>
          </div>
        </div>

        <div className="installation-notice">
          <h3>
            <FaServer /> Installation Process:
          </h3>
          <p>
            This system contains Muneer's professional portfolio in Arch Linux
            style. The installation will begin automatically.
          </p>
          <p className="desktop-notice">
            <strong>Note:</strong> For the complete interactive Linux desktop
            experience, please visit this portfolio on a larger display
            (1024x768 or higher).
          </p>
        </div>
      </div>

      <div className="auto-start-indicator">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Starting installation automatically...</p>
      </div>
    </div>
  );

  const renderInstalling = () => (
    <div className="arch-installing">
      <div className="install-header">
        <h2>📦 Installing Portfolio System</h2>
        <div className="install-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((installStep + 1) / installSteps.length) * 100}%`,
              }}
            ></div>
          </div>
          <span className="progress-text">
            {installStep + 1} of {installSteps.length}
          </span>
        </div>
      </div>

      <div className="install-step">
        <div className="step-header">
          <div className="step-icon">
            <FaCog />
          </div>
          <div className="step-info">
            <h3>{installSteps[installStep].title}</h3>
            <p className="step-description">
              {installSteps[installStep].description}
            </p>
            <p className="step-tech">
              {installSteps[installStep].techDescription}
            </p>
          </div>
        </div>{" "}
        <div className="step-content">
          <div className="content-preview">
            {installSteps[installStep].content === "skills" && (
              <div className="skills-preview">
                <h4>
                  <FaLaptopCode /> Loading...
                </h4>
                <div className="skill-tags">
                  {portfolioData.skillTags?.slice(0, 4).map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  )) || (
                      <>
                        <span className="skill-tag">React</span>
                        <span className="skill-tag">Node.js</span>
                        <span className="skill-tag">Python</span>
                        <span className="skill-tag">Docker</span>
                      </>
                    )}
                </div>{" "}
              </div>
            )}

            {installSteps[installStep].content === "bio" && (
              <div className="bio-preview">
                <h4>
                  <FaUser /> Loading...
                </h4>
                <p>{portfolioData.bio.substring(0, 100)}...</p>{" "}
              </div>
            )}

            {installSteps[installStep].content === "experience" && (
              <div className="experience-preview">
                <h4>
                  <FaBriefcase /> Loading...
                </h4>
                <p>Processing work history and achievements...</p>
              </div>
            )}
            {installSteps[installStep].content === "projects" && (
              <div className="projects-preview">
                <h4>
                  <FaRocket /> Loading...
                </h4>
                <p>Configuring project repositories...</p>
              </div>
            )}
          </div>
        </div>
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Processing...</span>
        </div>
      </div>
    </div>
  );

  const renderBoot = () => (
    <div className="arch-boot">
      <div className="boot-header">
        <h2>
          <FaRocket /> Booting Portfolio System
        </h2>
      </div>

      <div className="boot-log">
        {bootMessages.slice(0, bootStep + 1).map((message, index) => (
          <div key={index} className="boot-message">
            {message}
          </div>
        ))}
        {bootStep < bootMessages.length && <div className="boot-cursor">_</div>}
      </div>

      {showDesktop && (
        <div className="boot-complete">
          <div className="complete-message">
            <h3>
              <FaCheckCircle /> Installation Complete!
            </h3>
            <p>Portfolio system ready for use</p>
            <button
              className="enter-desktop"
              onClick={() => setCurrentPhase("desktop")}
            >
              Enter Desktop Environment
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderDesktop = () => (
    <div className="arch-desktop">
      <div className="desktop-header">
        <div className="desktop-title">
          <span className="desktop-icon">
            <FaHome />
          </span>
          <h2>Muneer's Portfolio Desktop</h2>
        </div>
        <div className="desktop-status">
          <span className="status-item">
            <FaMobile /> Mobile Session
          </span>
          <span className="status-separator">|</span>
          <span className="status-item">
            <FaDesktop /> Full GUI on Desktop
          </span>
        </div>
      </div>
      <div className="desktop-apps">
        {desktopApps.map((app) => (
          <div
            key={app.id}
            className="desktop-app"
            onClick={() => openApp(app)}
          >
            <div className="app-icon">{app.icon}</div>
            <div className="app-info">
              <h3 className="app-name">{app.name}</h3>
              <p className="app-description">{app.description}</p>
            </div>
            <div className="app-arrow">
              <FaChevronRight />
            </div>
          </div>
        ))}
      </div>{" "}
      <div className="desktop-footer">
        <div className="system-info">
          <span>
            <FaChartBar /> System: Portfolio v2.0
          </span>
          <span>
            <FaClock /> Uptime:{" "}
            {portfolioData.quickStats?.uptime ||
              new Date().getFullYear() - 2021}{" "}
            experience
          </span>
        </div>
      </div>
      {selectedApp && (
        <>
          {selectedApp.id === "terminal" ? (
            // Render terminal fullscreen without modal wrapper
            renderTerminal()
          ) : (
            // Render other apps in modal
            <div className="app-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-title">
                    <span className="modal-icon">{selectedApp.icon}</span>
                    <h3>{selectedApp.name}</h3>
                  </div>
                  <button className="close-button" onClick={closeApp}>
                    <FaTimes />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="app-content">
                    {selectedApp.content === "cv" ? (
                      renderCVContent()
                    ) : (
                      selectedApp.content.split('\n').map((line, index) => (
                        <div key={index} className="content-line">
                          {parseMarkdownLinks(line)}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="mobile-arch-installer">
      {currentPhase === "welcome" && renderWelcome()}
      {currentPhase === "installing" && renderInstalling()}
      {currentPhase === "booting" && renderBoot()}
      {currentPhase === "desktop" && renderDesktop()}
    </div>
  );
};

export default MobileArchInstaller;
