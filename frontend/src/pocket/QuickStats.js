/**
 * QuickStats — Glanceable stats card on the home screen.
 *
 * Shows: experience years, project count, technology count.
 * Data-driven from portfolioData.
 *
 * @author Muneer Alam
 */

import React from "react";
import { portfolioData } from "../../data/portfolioData";

const stats = portfolioData.quickStats || {
  experience: "6+ Years",
  projects: "12+ Projects",
  technologies: "30+ Technologies",
};

export default function QuickStats() {
  const items = [
    { label: "Experience", value: stats.experience },
    { label: "Projects", value: stats.projects },
    { label: "Technologies", value: stats.technologies },
  ];

  return (
    <div className="pocket-quickstats" aria-label="Portfolio stats">
      <div className="pocket-quickstats-avatar" aria-hidden="true">
        <span className="pocket-quickstats-initials">MA</span>
      </div>
      <div className="pocket-quickstats-info">
        <span className="pocket-quickstats-name">Muneer Alam</span>
        <div className="pocket-quickstats-badges">
          {items.map((item) => (
            <span key={item.label} className="pocket-quickstats-badge">
              {item.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
