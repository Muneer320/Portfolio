/**
 * ProjectsApp — Project showcase for Pocket Device.
 *
 * Renders a card list of portfolio projects from portfolioData.
 * Each card shows: title, tech tags, description, live/demo links.
 *
 * @author Muneer Alam
 */

import React from "react";
import { portfolioData } from "../../data/portfolioData";

export default function ProjectsApp({ showToast }) {
  const raw = portfolioData.projects || "";
  const blocks = raw.split("\n\n").filter((b) => b.trim());

  return (
    <div className="pocket-app-scroll">
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter((l) => l.trim());
        if (lines.length === 0) return null;

        const titleLine = lines[0].replace(/^[*#]+\s*/, "").trim();
        const descLines = lines.filter(
          (l) => !l.startsWith("•") && !l.startsWith("-") && !l.includes("http")
        );
        const techLine = lines.find(
          (l) => l.startsWith("•") || l.startsWith("-")
        );
        const linkLine = lines.find((l) => l.includes("http"));

        const techs = techLine
          ? techLine.replace(/^[•\-]\s*Tech:\s*/i, "").split(", ")
          : [];

        const linkMatch = linkLine?.match(/\[([^\]]+)\]\(([^)]+)\)/);

        return (
          <div key={i} className="pocket-project-card">
            <h3 className="pocket-project-title">{titleLine}</h3>

            {descLines.length > 0 && (
              <p className="pocket-project-desc">
                {descLines.slice(1).join(" ")}
              </p>
            )}

            {techs.length > 0 && (
              <div className="pocket-project-techs">
                {techs.map((tech) => (
                  <span key={tech} className="pocket-project-tag">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {linkMatch && (
              <a
                href={linkMatch[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="pocket-project-link"
                onClick={() => showToast(`Opening ${linkMatch[1]}...`)}
              >
                {linkMatch[1]} ↗
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
