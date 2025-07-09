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

import React, { useState, useEffect } from "react";
import { portfolioData } from "../data/portfolioData";
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

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

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
  };

  const closeApp = () => {
    setSelectedApp(null);
  };

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
