# Interactive Linux Desktop Portfolio

A stunning, fully functional simulation of a desktop environment inspired by `Arch Linux + Hyprland`, built with React. Explore my portfolio through a working desktop OS in your browser — windows, file system, terminal commands, music player, and more. On mobile, it becomes a **Pocket Device** — a lock screen that unlocks into my personal device.

![Portfolio Desktop Screenshot](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](#)

## 🌟 Features

### 🖥️ Complete Desktop Environment

- **Authentic Arch-Linux-style desktop** with wallpaper and taskbar
- **Window management system** with dragging, resizing, and z-index
- **Multi-window support** with proper z-index management
- **Responsive design** — desktop on large screens, Pocket Device on mobile
- **System status indicators** (battery, volume, WiFi, time)

### 📱 Pocket Device (Mobile)

- **Lock screen** with wallpaper, clock, identity, tap-to-unlock
- **Home screen** with QuickStats and app grid
- **7 apps**: Terminal, Projects, Skills, Experience, CV, Contact, About
- **Touch-optimized terminal** with command chips and styled output
- **Browser history integration** (pushState/popState back navigation)

### 📁 File System Simulation

- **Interactive file manager** with navigation and file operations
- **Realistic directory structure** (`/home/muneer/`)
- **Multiple file types**: Text, images, audio, PDFs
- **Dynamic file system loading** from JSON structure

### 💻 Functional Terminal Emulator

- **Custom terminal interface** with authentic styling
- **Portfolio commands**: `bio`, `skills`, `experience`, `projects`, `achievements`, `certifications`, `education`, `contact`
- **System commands**: `ls`, `cd`, `cat`, `pwd`, `clear`, `help`, `neofetch`
- **Command history and auto-completion**

### 🎵 Multimedia Applications

- **Music Player**: Play audio files with controls, progress bar, and volume
- **Image Viewer**: Display images with zoom and navigation
- **Text Editor**: Edit and save text files
- **PDF Viewer**: View PDF documents (certificates, resume)
- **Web Browser**: Embedded GitHub browser

### 🎨 User Experience

- **Smooth animations and transitions**
- **Backdrop filters and glass morphism effects**
- **Authentic Linux theming and icons**
- **Login screen simulation**
- **Custom right-click context menu**

## 🛠️ Technology Stack

### Frontend

- **React 19** - Modern UI library with hooks
- **CSS3** - Advanced styling with backdrop filters and animations
- **JavaScript ES6+** - Modern JavaScript features

### Development Tools

- **Create React App** - Build toolchain and development server
- **ESLint** - Code linting and formatting
- **DOMPurify** - XSS-safe markdown rendering

## 📂 Project Structure

```
Portfolio/
├── frontend/
│   ├── public/
│   │   ├── favicon.ico       # Site favicon
│   │   ├── manifest.json     # PWA manifest
│   │   ├── robots.txt        # Search engine directives
│   │   ├── sitemap.xml       # SEO sitemap
│   │   └── home/muneer/      # Simulated file system
│   │       ├── Documents/    # Resume, cover letter, certificates
│   │       ├── Projects/     # Project documentation
│   │       ├── Pictures/     # Images and avatars
│   │       └── Music/        # Audio files
│   ├── src/
│   │   ├── components/       # Desktop React components
│   │   │   ├── Desktop.js    # Main desktop environment
│   │   │   ├── Terminal.js   # Terminal emulator
│   │   │   ├── FileManager.js
│   │   │   ├── TextEditor.js
│   │   │   ├── MusicPlayer.js
│   │   │   ├── ImageViewer.js
│   │   │   └── Browser.js
│   │   ├── pocket/           # Mobile Pocket Device experience
│   │   │   ├── DeviceShell.js  # Lock → Home → App orchestration
│   │   │   ├── LockScreen.js
│   │   │   ├── HomeScreen.js
│   │   │   └── apps/           # 7 Pocket apps
│   │   ├── data/             # Portfolio content (portfolioData.js)
│   │   ├── utils/            # Terminal engine, file system loader
│   │   └── styles/           # CSS styles
│   └── package.json
└── README.md
```

## 🎯 Interactive Portfolio Commands

Open the terminal and try these commands to explore my portfolio:

```bash
bio             # Personal background and introduction
skills          # Technical skills and technologies
experience      # Professional work experience
projects        # Portfolio projects with details
achievements    # Hackathon wins and honors
certifications  # Courses and certifications
education       # Educational background
contact         # Contact information and social links
help            # List all available commands
```

### System Commands

```bash
ls              # List directory contents
cd              # Change directory
cat             # Read file contents
pwd             # Print working directory
neofetch        # System information
clear           # Clear terminal
```

## 🚀 Getting Started

```bash
cd frontend
npm install
npm start        # Development server on http://localhost:3000
```

### Production Build

```bash
npm run build    # Optimized production build
npm test         # Run test suite (33 tests)
```

## 🌐 Deployment

Deployed on **Vercel** with automatic builds on push to `main`. The site is live at [muneer320.tech](https://muneer320.tech).

## 📝 License

MIT
