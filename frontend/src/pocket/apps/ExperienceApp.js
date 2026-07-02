/**
 * ExperienceApp — Work experience timeline for Pocket Device.
 *
 * Renders experience from portfolioData as a vertical timeline.
 *
 * @author Muneer Alam
 */

import React from "react";
import { portfolioData } from "data/portfolioData";

export default function ExperienceApp() {
  const raw = portfolioData.experience || "";

  return (
    <div className="pocket-app-scroll">
      <div className="pocket-experience-content">
        {raw.split("\n").map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={i} className="pocket-experience-gap" />;

          // Headings (bold/caps)
          if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
            return (
              <div key={i} className="pocket-experience-heading">
                {trimmed.replace(/\*\*/g, "")}
              </div>
            );
          }

          // Bullet points
          if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
            return (
              <div key={i} className="pocket-experience-bullet">
                {trimmed.replace(/^[•\-]\s*/, "")}
              </div>
            );
          }

          return (
            <div key={i} className="pocket-experience-text">
              {trimmed}
            </div>
          );
        })}
      </div>
    </div>
  );
}
