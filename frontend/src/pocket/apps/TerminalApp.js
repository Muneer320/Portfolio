/**
 * TerminalApp — Touch-optimized terminal for Pocket Device.
 *
 * Reuses the terminalCommands.js engine from the shared utils.
 * Features: command chips, text input, styled output, command history.
 *
 * @author Muneer Alam
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { executeSystemCommand } from "utils/terminalCommands";
import { portfolioData } from "data/portfolioData";

// Portfolio commands that have chips
const PORTFOLIO_COMMANDS = [
  { cmd: "bio", label: "Bio" },
  { cmd: "skills", label: "Skills" },
  { cmd: "projects", label: "Projects" },
  { cmd: "experience", label: "Experience" },
  { cmd: "contact", label: "Contact" },
  { cmd: "cv", label: "CV" },
  { cmd: "neofetch", label: "Neofetch" },
  { cmd: "help", label: "Help" },
];

// Commands that display styled output (cards, not raw text)
const STYLED_COMMANDS = ["bio", "skills", "projects", "experience", "contact"];

// Portable portfolio command handler (doesn't need filesystem)
function executePortfolioCommand(command) {
  const cmd = command.trim().toLowerCase();
  const data = portfolioData;

  switch (cmd) {
    case "bio":
      return { output: data.bio, styled: true };
    case "education":
      return { output: data.education, styled: true };
    case "skills":
      return { output: data.skills, styled: true, type: "skills" };
    case "experience":
      return { output: data.experience, styled: true };
    case "projects":
      return { output: data.projects, styled: true, type: "projects" };
    case "contact":
      return { output: data.contact, styled: true, type: "contact" };
    case "cv":
      return {
        output: `${data.bio}\n\n${data.education}\n\n${data.skills}\n\n${data.experience}\n\n${data.projects}\n\n${data.contact}\n\n---\nDownload CV: /home/muneer/Documents/CV.pdf`,
        styled: false,
      };
    case "neofetch":
      return {
        output: `muneer@arch-portfolio\n--------------------\nOS: Arch Linux x86_64\nHost: Portfolio System\nKernel: 6.1.0-portfolio\nUptime: 2 days, 14 hours\nPackages: 1247 (pacman)\nShell: bash 5.1.16\nDE: Plasma Mobile\nWM: KWin\nTheme: Arch-Dark\nTerminal: pocket-term`,
        styled: false,
      };
    case "whoami":
      return { output: "muneer", styled: false };
    case "date":
      return { output: new Date().toString(), styled: false };
    case "uptime":
      return { output: "System uptime: 2 days, 14:32:15", styled: false };
    case "pwd":
      return {
        output: "/home/muneer",
        styled: false,
      };
    case "help":
      return {
        output: `Available commands:
bio         Personal background
skills      Technical skills
experience  Work experience
projects    Portfolio projects
education   Educational background
contact     Contact information
cv          Combined portfolio info + download
neofetch    System information
whoami      Current user
date        Current date
uptime      System uptime
pwd         Current directory
help        This help message
clear       Clear terminal`,
        styled: false,
      };
    case "clear":
      return { output: "__CLEAR__", styled: false };
    default:
      return null; // Let executeSystemCommand handle it
  }
}

export default function TerminalApp({ showToast }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [currentPath] = useState("/home/muneer");
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const executeCmd = useCallback(
    async (commandText) => {
      const trimmed = commandText.trim();
      if (!trimmed) return;

      // Add to command history
      setCmdHistory((prev) => [...prev, trimmed]);
      setCmdIndex(-1);

      // Add command line to display
      const promptLine = `muneer@arch-portfolio:~$ ${trimmed}`;
      const newHistory = [
        ...history,
        { type: "command", text: promptLine },
      ];

      // Try portfolio commands first
      const result = executePortfolioCommand(trimmed);

      if (result && result.output === "__CLEAR__") {
        setHistory([]);
        setInput("");
        return;
      }

      if (result) {
        newHistory.push({
          type: result.styled ? "styled" : "output",
          text: result.output,
          outputType: result.type,
        });
      } else {
        // Fallback to system commands (no filesystem needed)
        try {
          const sysResult = await executeSystemCommand(
            trimmed,
            currentPath,
            () => {}
          );
          newHistory.push({ type: "output", text: sysResult.output });
        } catch {
          newHistory.push({
            type: "output",
            text: `Command not found: ${trimmed.split(" ")[0]}. Type "help" for available commands.`,
          });
        }
      }

      setHistory(newHistory);
      setInput("");
    },
    [history, currentPath]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCmd(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeCmd(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIndex =
          cmdIndex === -1
            ? cmdHistory.length - 1
            : Math.max(0, cmdIndex - 1);
        setCmdIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdIndex !== -1) {
        const newIndex = cmdIndex + 1;
        if (newIndex >= cmdHistory.length) {
          setCmdIndex(-1);
          setInput("");
        } else {
          setCmdIndex(newIndex);
          setInput(cmdHistory[newIndex]);
        }
      }
    }
  };

  // Render output based on type
  const renderOutput = (entry) => {
    if (entry.type === "command") {
      return <div className="pocket-terminal-prompt-line">{entry.text}</div>;
    }

    if (entry.type === "styled") {
      // For styled output, render as formatted content
      const lines = entry.text.split("\n").filter((l) => l.trim());

      if (entry.outputType === "skills") {
        // Render skills as tags
        const skillItems = portfolioData.skillTags || [];
        return (
          <div className="pocket-terminal-styled-output">
            <div className="pocket-terminal-skill-tags">
              {skillItems.map((skill) => (
                <span key={skill} className="pocket-terminal-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      }

      if (entry.outputType === "projects") {
        // Render projects section
        return (
          <div className="pocket-terminal-styled-output pocket-terminal-projects">
            {lines.map((line, i) => {
              // Bold/heading lines
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <div key={i} className="pocket-terminal-project-title">
                    {line.replace(/\*\*/g, "")}
                  </div>
                );
              }
              // Bullet points
              if (line.startsWith("•") || line.startsWith("-")) {
                return (
                  <div key={i} className="pocket-terminal-project-detail">
                    {line}
                  </div>
                );
              }
              // Links
              const urlMatch = line.match(
                /\[([^\]]+)\]\(([^)]+)\)/
              );
              if (urlMatch) {
                return (
                  <div key={i} className="pocket-terminal-project-link">
                    <a
                      href={urlMatch[2]}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(`Opening ${urlMatch[1]}...`);
                      }}
                    >
                      {urlMatch[1]}
                    </a>
                  </div>
                );
              }
              // Empty line
              if (!line.trim()) {
                return <div key={i} className="pocket-terminal-spacer" />;
              }
              return (
                <div key={i} className="pocket-terminal-project-text">
                  {line}
                </div>
              );
            })}
          </div>
        );
      }

      if (entry.outputType === "contact") {
        // Render contact as action buttons
        const email = "muneer.alam320@gmail.com";
        const github = "https://github.com/Muneer320";
        const linkedin = "https://linkedin.com/in/muneer320";
        return (
          <div className="pocket-terminal-styled-output">
            <div className="pocket-terminal-contact-links">
              <button
                className="pocket-terminal-contact-btn"
                onClick={() => {
                  window.location.href = `mailto:${email}`;
                  showToast("Opening mail...");
                }}
              >
                ✉ Email
              </button>
              <button
                className="pocket-terminal-contact-btn"
                onClick={() => {
                  window.open(github, "_blank");
                  showToast("Opening GitHub...");
                }}
              >
                🐙 GitHub
              </button>
              <button
                className="pocket-terminal-contact-btn"
                onClick={() => {
                  window.open(linkedin, "_blank");
                  showToast("Opening LinkedIn...");
                }}
              >
                💼 LinkedIn
              </button>
            </div>
          </div>
        );
      }

      // Default styled output (bio, experience)
      return (
        <div className="pocket-terminal-styled-output">
          {lines.map((line, i) => (
            <div key={i} className="pocket-terminal-styled-line">
              {line}
            </div>
          ))}
        </div>
      );
    }

    // Plain output
    return (
      <div className="pocket-terminal-output-text">{entry.text}</div>
    );
  };

  return (
    <div className="pocket-terminal">
      <div className="pocket-terminal-output" ref={outputRef}>
        {/* Welcome message */}
        <div className="pocket-terminal-welcome">
          Welcome to Pocket Terminal. Type a command or tap a chip below.
        </div>

        {history.map((entry, i) => (
          <div key={i} className="pocket-terminal-entry">
            {renderOutput(entry)}
          </div>
        ))}
      </div>

      {/* Command chips */}
      <div className="pocket-terminal-chips">
        {PORTFOLIO_COMMANDS.map(({ cmd, label }) => (
          <button
            key={cmd}
            className="pocket-terminal-chip"
            onClick={() => executeCmd(cmd)}
            aria-label={`Run ${cmd} command`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <form className="pocket-terminal-input-area" onSubmit={handleSubmit}>
        <span className="pocket-terminal-prompt" aria-hidden="true">
          $
        </span>
        <input
          ref={inputRef}
          type="text"
          className="pocket-terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          aria-label="Terminal command input"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
        />
        <button
          type="submit"
          className="pocket-terminal-submit"
          aria-label="Execute command"
        >
          ↵
        </button>
      </form>
    </div>
  );
}
