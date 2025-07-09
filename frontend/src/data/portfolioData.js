/**
 * Portfolio Data Configuration
 *
 * Central data store containing all portfolio information including:
 * personal bio, education, skills, experience, projects, and contact details.
 * Used throughout the portfolio application to populate terminal commands,
 * mobile installer content, and other displays.
 *
 * @author Muneer Alam
 * @module portfolioData
 */

// ============================================================================
// PORTFOLIO DATA EXPORT
// ============================================================================

export const portfolioData = {
  bio: `Self-taught Software Developer with 6+ years of experience building things people actually use.
From Discord and Telegram bots to full-stack web apps, games, and AI-powered tools - I love crafting impactful, scalable projects.
Comfortable across the stack - Python, JS, React, C++, and more.
Passionate about app development, full-stack development, computer vision, and open-source contributions, with a growing focus on AI/ML.`,

  education: `🏫 Completed High School (CBSE)
📍 Delhi, India
🎓 Pursuing B.Sc in Computer Science - IIT Madras (Batch of '29)
💻 Enrolled at Scaler School of Technology - Industry-Focused CS Program
🏆 Smart India Hackathon Participant (2023)
💡 Clash of Code - Under 50 International Rank`,

  skills: `💻 Programming Languages:
• Python, JavaScript/TypeScript, C++, HTML5, CSS3, SQL

🚀 Frameworks & Libraries:
• React.js, Next.js, TailwindCSS, Flask, Django, FastAPI, Pygame, OpenCV, Scikit-learn, NumPy, Pandas

☁️ Tools & Technologies:
• Git, GitHub, Docker, Linux (Arch Linux), Bash scripting, VSCode, Figma, AI/ML prototyping, Web scraping, Automation`,

  skillTags: [
    "Python",
    "React",
    "Next.js",
    "Linux",
    "OpenCV",
    "FastAPI",
    "Django",
    "Flask",
    "Pygame",
    "GitHub",
    "Automation",
    "Computer Vision",
  ],

  experience: `👨‍💻 Independent Developer | Self-Taught Journey
📅 6+ Years (2017 - Present)
• Built many projects across automation, AI, web apps, games, and data tools
• Active contributor to open-source projects like Ffmpeg, Abstracta and more
• Designed productivity tools, Chrome extensions, games and more
• Comfortable with Python, Linux, Git workflows, and full-stack development`,

  projects: `📚 BOOP - Book Of Organized Puzzles
• Open-source CLI tool for automated puzzle book creation
• Tech: Python, JSON, PDF libraries, SVG manipulation, OOP
• GitHub: [BOOP](https://github.com/muneer320/boop)

🎨 Abstracta - Image Recreation with Abstract Shapes
• CLI tool recreating images using geometric shapes via hill-climbing algorithms
• Tech: Python, Pillow, NumPy, OpenCV
• GitHub: [Abstracta](https://github.com/Muneer320/Abstracta2.0)

🌐 BOOP-web
• Web version of BOOP for broader accessibility
• Tech: React, TailwindCSS, Flask, FastAPI
• GitHub: [BOOP-web](https://github.com/muneer320/boop-web)

🎮 Shooter Game with Level Editor
• 2D shooter-platformer with enemy AI, upgrades, and in-game level designer
• Tech: Python, Pygame, CSV, Pickle
• GitHub: [Shooter-Game](https://github.com/Muneer320/Shooter-Game)`,

  contact: `📧 Email: [muneer.alam320@gmail.com](mailto:muneer.alam320@gmail.com)
💼 LinkedIn: [linkedin.com/in/muneer320](linkedin.com/in/muneer320)
🐙 GitHub: [github.com/Muneer320](github.com/Muneer320)
🌐 Website: [muneer320.tech](https://muneer320.tech)
📞 Phone: +91 91623 92229
🌍 Location: Delhi, India (Relocating to Bangalore)
💼 Open to Freelance, Open-source Collaborations, and Hackathons`,

  quickStats: {
    experience: "6+ Years",
    projects: "20+ Projects",
    technologies: "30+ Technologies",
    uptime: new Date().getFullYear() - 2017 + " Years",
  },
};
