# Interactive Linux Desktop Portfolio

A stunning, fully functional simulation of desktop environment inspired by `Arch Linux + Hyprland` built with React.js that showcases my portfolio in an interactive and engaging way. Experience a complete desktop OS in your browser with working applications, file system, terminal commands and more.

![Portfolio Desktop Screenshot](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](#)

## 🌟 Features

### 🖥️ Complete Desktop Environment

- **Authentic Arch-Linux-style desktop** with wallpapers and taskbar
- **Window management system** with dragging, resizing, minimizing, and maximizing
- **Multi-window support** with proper z-index management
- **Responsive design** that adapts to different screen sizes
- **System status indicators** (battery, volume, WiFi, time etc.)

### 📁 File System Simulation

- **Interactive file manager** with navigation and file operations
- **Realistic directory structure** (`/home/muneer/`)
- **Multiple file types support**: Text files, images, audio, PDFs
- **File preview and editing capabilities**
- **Dynamic file system loading** from JSON structure

### 💻 Functional Terminal Emulator

- **Custom terminal interface** with authentic styling
- **Portfolio-specific commands** for showcasing skills and experience
- **System commands**: `ls`, `cd`, `cat`, `pwd`, `clear`, `help`
- **Portfolio commands**: `bio`, `skills`, `experience`, `projects`, `contact`, `education`
- **Command history and auto-completion**

### 🎵 Multimedia Applications

- **Music Player**: Play audio files with controls, progress bar, and volume
- **Image Viewer**: Display images with zoom and navigation
- **Text Editor**: Edit and save text files with syntax highlighting
- **PDF Viewer**: View PDF documents (certificates, resume)
- **Web Browser**: Embedded browser simulation

### 🎨 User Experience

- **Smooth animations and transitions**
- **Backdrop filters and glass morphism effects**
- **Authentic Linux theming and icons**
- **Login screen simulation**
- **Auto-start terminal for immediate interaction**

## 🛠️ Technology Stack

### Frontend

- **React.js 19.1.0** - Modern UI library with hooks
- **CSS3** - Advanced styling with backdrop filters and animations
- **JavaScript ES6+** - Modern JavaScript features
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API requests

### Development Tools

- **Create React App** - Build toolchain and development server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization

### Features Implementation

- **File System Loader** - Dynamic JSON-based file system
- **Terminal Commands Engine** - Custom command processor
- **Window Management System** - Multi-window state management
- **Portfolio Data Integration** - Dynamic content loading

## 📂 Project Structure

```
Portfolio/
├── frontend/
│   ├── public/
│   │   ├── assets/          # Static assets (icons, images, music)
│   │   └── home/muneer/     # Simulated file system
│   │       ├── Documents/   # Resume, cover letter, certificates
│   │       ├── Projects/    # Project documentation
│   │       ├── Pictures/    # Images and avatars
│   │       └── Music/       # Audio files
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Desktop.js   # Main desktop environment
│   │   │   ├── Terminal.js  # Terminal emulator
│   │   │   ├── FileManager.js
│   │   │   ├── TextEditor.js
│   │   │   ├── MusicPlayer.js
│   │   │   ├── ImageViewer.js
│   │   │   └── Browser.js
│   │   ├── data/           # Portfolio content
│   │   └── utils/          # Utility functions
│   └── package.json
├── start.ps1              # PowerShell startup script
├── start.bat              # Batch startup script
└── README.md
```

## 🎯 Interactive Portfolio Commands

Open the terminal and try these commands to explore my portfolio:

```bash
bio          # Personal background and introduction
skills       # Technical skills and technologies
experience   # Professional work experience
projects     # Portfolio projects with details
education    # Educational background
contact      # Contact information and social links
help         # List all available commands
```

### System Commands

```bash
ls           # List directory contents
cd [dir]     # Change directory
cat [file]   # Display file contents
pwd          # Show current directory
clear        # Clear terminal screen
```

## 🎨 Key Components

### Desktop Environment

- **Dynamic wallpaper system** with multiple themes
- **Taskbar with system tray** showing time, battery, and status
- **Application dock** with hover effects and tooltips
- **Context menu system** for right-click interactions

### Window Manager

- **Draggable windows** with smooth animations
- **Resizable windows** with minimum size constraints
- **Focus management** with proper z-index handling
- **Window controls** (minimize, maximize, close)

### File System

- **JSON-based file structure** for easy content management
- **Dynamic file loading** from public directory
- **File type detection** and appropriate viewer selection
- **Read/write capabilities** with localStorage persistence

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** - JavaScript runtime
- **npm** - Package manager
- **Modern web browser** - Chrome, Firefox, Safari, Edge

### Installation

```bash
# Clone the repository
git clone https://www.github.com/muneer320/Portfolio.git
cd Portfolio

# Install npm and Node.js using your preferred method
# 1. Download from official website: "https://nodejs.org/" 
# 2. Package managers
sudo pacman -S nodejs npm       # For Arch Linux
sudo apt install nodejs npm     # For (Ubuntu/Debian) based Linux
brew install node npm           # For macOS
choco install nodejs npm        # For Windows


# Install dependencies
cd frontend
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

## 🏆 Features Showcase

This portfolio demonstrates proficiency in:

- **React.js ecosystem** and modern development practices
- **Advanced CSS** with animations and effects
- **JavaScript** ES6+ features and design patterns
- **State management** and component architecture
- **File system simulation** and data management
- **User interface design** and user experience
- **Responsive web development**
- **Performance optimization**

## 🌐 Connect with me:
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/muneer320)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/muneer320)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:muneer.alam320@gmail.com)
[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)](http://discordcom/users/someguy320)

---

**Built with ❤️ using React.js | An Interactive Portfolio Experience**
