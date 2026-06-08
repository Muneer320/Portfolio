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
  bio: `Self-taught Software Developer with 6+ years of experience building production-grade full-stack applications, AI-powered tools, and automation systems. From event management platforms serving thousands of users to intelligent storage engines, puzzle generators, and Discord bots — I build things that work at scale.
Comfortable across the stack — Python, Go, TypeScript, React, FastAPI, and more.
Passionate about backend architecture, systems design, AI/ML, and open-source contributions. Currently focused on building scalable distributed systems and developer tooling.`,

  education: `🎓 Pursuing B.Sc in Computer Science — IIT Madras (Batch of '29)
💻 Enrolled at Scaler School of Technology — Industry-Focused CS Program
🏫 Completed High School (CBSE) — Delhi, India
🏆 Smart India Hackathon Participant (2023)
💡 Clash of Code — Under 50 International Rank`,

  skills: `💻 Programming Languages:
• Python, JavaScript/TypeScript, Go, C++, HTML5, CSS3, SQL

🚀 Frameworks & Libraries:
• React.js, Next.js, FastAPI, Flask, Django, TailwindCSS, SQLAlchemy, Framer Motion

🗄️ Databases & Storage:
• PostgreSQL, MongoDB, Redis, Supabase, BadgerDB, SQLite

☁️ Tools & Technologies:
• Git, GitHub, Docker, Docker Compose, Linux (Arch Linux), Bash scripting, CI/CD, JWT, OAuth, REST APIs, WebSockets`,

  skillTags: [
    "Python",
    "React",
    "Go",
    "FastAPI",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Linux",
    "TypeScript",
    "Next.js",
    "SQLAlchemy",
  ],

  experience: `👨‍💻 Independent Software Developer | Full-Stack & Systems
📅 6+ Years (2017 — Present)
• Built and deployed production-grade event management platform powering 2000+ users (Ascent Dashboard)
• Developed intelligent multi-modal storage engine in Go with smart SQL/NoSQL routing and multi-level caching (3.6M ops/sec)
• Created client projects for ParaPixel DigiServices (e-commerce, tournament management platforms)
• Built AI-powered debate platform, financial literacy app, and rehabilitation planning system
• Active open-source contributor with 12+ public repositories and growing
• Comfortable across Python, Go, TypeScript, Linux, Docker, and full-stack development`,

  projects: `📊 Ascent Dashboard
• Central platform for 2000+ hackathon participants — event management, QR validation, gamification, real-time leaderboards, AI photo gallery
• Tech: FastAPI, React 18, PostgreSQL, Redis, Docker, JWT
• GitHub: [Ascent Dashboard](https://github.com/Muneer320/dashboard)
• Live: [ascent.scaler.com](https://ascent.scaler.com/)

🦏 RhinoBox
• Intelligent multi-modal storage engine — auto-categorizes and routes data to optimal DB (SQL vs NoSQL)
• Tech: Go, PostgreSQL, MongoDB, BadgerDB, Chi Router, Docker
• GitHub: [RhinoBox](https://github.com/Muneer320/RhinoBox)

🏑 Surjit Hockey Tournament
• Full-stack tournament management for IndianOil Servo Surjit Hockey Tournament (Grade-I)
• Tech: FastAPI, React 19, MySQL, Tailwind CSS 4, Framer Motion
• GitHub: [Surjit-Hockey](https://github.com/ParaPixel-DigiServices/surjit-hockey)
• Live: [surjit-hockey.vercel.app](https://surjit-hockey.vercel.app)

🍱 Sandhya Foods
• E-commerce platform with Razorpay payments, WhatsApp order notifications, Supabase backend
• Tech: Next.js 16, React 19, TypeScript, Supabase, Razorpay, TanStack Query
• GitHub: [Sandhya-Foods](https://github.com/ParaPixel-DigiServices/sandhya-foods)
• Live: [sandhya-foods.vercel.app](https://sandhya-foods.vercel.app)

📚 BOOP
• Automated puzzle book generator — CLI + web app for creating categorized word search books
• Tech: Python, FastAPI, React, ReportLab, Docker (11 stars, 4 forks)
• GitHub: [BOOP](https://github.com/Muneer320/BOOP)
• Live: [boop-web.vercel.app](https://boop-web.vercel.app)

💰 Finity
• Gamified financial literacy platform with AI coaching, paper trading, and personalized micro-courses
• Tech: React 18, FastAPI, OpenAI API, Gemini AI, Tailwind CSS
• GitHub: [Finity](https://github.com/Muneer320/finity)
• Live: [finity-rust.vercel.app](https://finity-rust.vercel.app)

🤖 SST Lounge Bot
• Feature-rich Discord bot for SST Batch '29 — contest tracking, auto role management, self-updating
• Tech: Python, discord.py, SQLite, clist.by API
• GitHub: [SST-Lounge-Bot](https://github.com/Muneer320/SST-Lounge-Bot)

📊 CPStats API
• REST API aggregating competitive programming ratings from LeetCode, Codeforces, CodeChef, AtCoder
• Tech: Python, FastAPI, Docker, Pydantic
• GitHub: [CPStats-API](https://github.com/Muneer320/CPStats-API)
• Live: [muneer320-cpstats-api.hf.space](https://muneer320-cpstats-api.hf.space)

🧩 LEAP
• Linked Sudoku puzzle book generator — each puzzle's solution unlocks the next
• Tech: Python, ReportLab, Pillow
• GitHub: [LEAP](https://github.com/Muneer320/LEAP)

🏥 RehabFlow AI
• AI-powered rehabilitation planning for MSK conditions using MedGemma + BLIP clinical image analysis
• Tech: Next.js 15, FastAPI, Supabase, Redis, Modal, 10+ languages
• GitHub: [RehabFlow-AI](https://github.com/AmoghRao21/RehabFlow_AI)
• Live: [rehab-flow-ai.vercel.app](https://rehab-flow-ai.vercel.app)

🎙️ Oratio
• Voice-enabled AI debate platform with AI judge using LCR scoring model (Logic, Credibility, Rhetoric)
• Tech: FastAPI, React 18, Gemini AI, WebSockets, Docker
• GitHub: [Oratio](https://github.com/Muneer320/oratio)

🎯 Vector
• AI-powered NSET exam preparation platform with mock tests, AI interviews, personalized learning
• Tech: React 19, Vite, Gemini AI, Three.js, Express.js, MongoDB
• GitHub: [Vector](https://github.com/AmoghRao21/vector)
• Live: [vector-lovat.vercel.app](https://vector-lovat.vercel.app)`,

  contact: `📧 Email: [muneer.alam320@gmail.com](mailto:muneer.alam320@gmail.com)
💼 LinkedIn: [linkedin.com/in/muneer320](https://linkedin.com/in/muneer320)
🐙 GitHub: [github.com/Muneer320](https://github.com/Muneer320)
🌐 Website: [muneer320.tech](https://muneer320.tech)
📞 Phone: +91 91623 92229
🌍 Location: Delhi, India (Relocating to Bangalore)
💼 Open to Freelance, Open-source Collaborations, and Hackathons`,

  quickStats: {
    experience: "6+ Years",
    projects: "12+ Projects",
    technologies: "30+ Technologies",
    uptime: new Date().getFullYear() - 2017 + " Years",
  },
};
