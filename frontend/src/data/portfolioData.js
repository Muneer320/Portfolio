/**
 * Portfolio Data Configuration
 *
 * Central data store containing all portfolio information including:
 * - Personal bio and background
 * - Education details
 * - Technical skills and competencies
 * - Professional experience
 * - Project showcase
 * - Contact information
 *
 * This data is used throughout the portfolio application to populate
 * terminal commands, mobile installer content, and other displays.
 *
 * @author Muneer Alam
 * @module portfolioData
 */

// ============================================================================
// PORTFOLIO DATA EXPORT
// ============================================================================

export const portfolioData = {
  bio: `Software Developer with 3+ years of experience in full-stack development.
Passionate about creating efficient, scalable solutions using modern technologies.
Currently specializing in React, Node.js, and cloud architecture.
Love contributing to open-source projects and exploring new tech trends.`,

  education: `🎓 Bachelor of Science in Computer Science
📍 University of Technology (2019-2023)
📊 CGPA: 3.8/4.0
🏆 Dean's List - Final Year
📝 Final Project: Distributed Task Management System`,

  skills: `💻 Programming Languages:
• JavaScript/TypeScript, Python, Java, C++
• HTML5, CSS3, SQL

🚀 Frameworks & Libraries:
• React.js, Node.js, Express.js, Next.js
• Django, Flask, Spring Boot

☁️ Tools & Technologies:
• Docker, Kubernetes, AWS, Git
• MongoDB, PostgreSQL, Redis
• Linux, Bash scripting`,

  skillTags: [
    "React",
    "Node.js",
    "Python",
    "JavaScript",
    "TypeScript",
    "Docker",
    "AWS",
    "MongoDB",
    "PostgreSQL",
    "Git",
    "Linux",
  ],

  experience: `👨‍💻 Full Stack Developer | TechCorp Solutions
📅 Jan 2023 - Present
• Developed 15+ responsive web applications using React and Node.js
• Optimized database queries resulting in 40% performance improvement
• Implemented CI/CD pipelines reducing deployment time by 60%

🔧 Software Engineer Intern | StartupHub
📅 Jun 2022 - Dec 2022
• Built REST APIs serving 1000+ daily active users
• Collaborated with cross-functional teams using Agile methodology`,

  projects: `🌟 Portfolio Website (This one!)
• Interactive Linux desktop simulation using React
• Custom terminal emulator with portfolio commands
• Technologies: React, CSS3, JavaScript

🛒 E-Commerce Platform
• Full-stack web application with payment integration
• Technologies: React, Node.js, MongoDB, Stripe API

🤖 AI Chat Assistant
• Real-time chat application with AI integration
• Technologies: React, Socket.io, OpenAI API, Express

📊 Data Visualization Dashboard
• Interactive dashboard for business analytics
• Technologies: React, D3.js, PostgreSQL, Express`,

  contact: `📧 Email: muneer.alam@email.com
📱 Phone: +1 (555) 123-4567
🌐 LinkedIn: linkedin.com/in/muneeralam
🐙 GitHub: github.com/muneeralam
🌍 Location: San Francisco, CA
💼 Available for full-time opportunities`,

  quickStats: {
    experience: "3+ Years",
    projects: "15+ Projects",
    technologies: "10+ Technologies",
    uptime: new Date().getFullYear() - 2019 + " Years",
  },
};
