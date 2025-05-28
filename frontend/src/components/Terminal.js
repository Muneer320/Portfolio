import React, { useState, useEffect, useRef } from 'react';
import { portfolioData } from '../data/portfolioData';
import { executeSystemCommand } from '../utils/terminalCommands';

const Terminal = ({ currentPath, setCurrentPath, onClose }) => {
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTerminalStarted, setIsTerminalStarted] = useState(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const neofetchDisplay = `                   -\`                    muneer@arch-portfolio 
                  .o+\`                   --------------------- 
                 \`ooo/                   OS: Arch Linux x86_64 
                \`+oooo:                  Host: Portfolio System 
               \`+oooooo:                 Kernel: 6.1.0-portfolio 
               -+oooooo+:                Uptime: 2 days, 14 hours, 32 mins 
             \`/:-:++oooo+:               Packages: 1247 (pacman) 
            \`/++++/+++++++:              Shell: bash 5.1.16 
           \`/++++++++++++++:             Resolution: 1920x1080 
          \`/+++ooooooooooooo/\`           DE: Hyprland 
         ./ooosssso++osssssso+\`          WM: Hyprland 
        .oossssso-\`\`\`\`/ossssss+\`         Theme: Arch-Dark 
       -osssssso.      :ssssssso.        Icons: Papirus 
      :osssssss/        osssso+++.       Terminal: portfolio-term 
     /ossssssss/        +ssssooo/-       CPU: Intel i7-12700K (12) @ 3.60GHz 
   \`/ossssso+/:-        -:/+osssso+-     GPU: NVIDIA GeForce RTX 4070 
  \`+sso+:-\`                 \`.-/+oso:    Memory: 2547MiB / 32768MiB 
 \`++:.                           \`-/+/
 .\`                                 \`/`;

  useEffect(() => {
    // Auto-run neofetch when terminal opens
    if (!isTerminalStarted) {
      executeCommand('neofetch');
      setIsTerminalStarted(true);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll terminal
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  useEffect(() => {
    // Focus input when terminal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const executeCommand = async (command) => {
    const args = command.trim().split(' ');
    const cmd = args[0].toLowerCase();
    let output = '';

    // Add command to history if not empty
    if (command.trim()) {
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
    }

    switch (cmd) {
      case 'help':
        output = `Available commands:
• Standard: ls, pwd, cd, cat, clear, neofetch
• Portfolio: bio, education, skills, experience, projects, contact
• System: whoami, date, uptime`;
        break;
      case 'neofetch':
        output = neofetchDisplay;
        break;
      case 'bio':
        output = portfolioData.bio;
        break;
      case 'education':
        output = portfolioData.education;
        break;
      case 'skills':
        output = portfolioData.skills;
        break;
      case 'experience':
        output = portfolioData.experience;
        break;
      case 'projects':
        output = portfolioData.projects;
        break;
      case 'contact':
        output = portfolioData.contact;
        break;
      case 'clear':
        setTerminalHistory([]);
        return;
      default:
        // Try system commands
        const result = await executeSystemCommand(command, currentPath, setCurrentPath);
        output = result.output;
    }

    setTerminalHistory(prev => [...prev, `muneer@arch-portfolio:${currentPath}$ ${command}`, output].filter(line => line !== undefined));
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (terminalInput.trim()) {
      executeCommand(terminalInput);
      setTerminalInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setTerminalInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setTerminalInput('');
        } else {
          setHistoryIndex(newIndex);
          setTerminalInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div className="terminal">
      <div className="terminal-output" ref={terminalRef}>
        {terminalHistory.map((line, i) => (
          <div key={i} className="terminal-line">{line}</div>
        ))}
        <div className="terminal-line">
          <form onSubmit={handleTerminalSubmit} className="terminal-input-form">
            <span className="terminal-prompt">muneer@arch-portfolio:{currentPath}$ </span>
            <input
              ref={inputRef}
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Terminal;