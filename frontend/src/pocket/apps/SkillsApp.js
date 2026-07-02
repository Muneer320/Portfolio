/**
 * SkillsApp — Technical skills for Pocket Device.
 *
 * Renders categorized skill tags from portfolioData.
 *
 * @author Muneer Alam
 */

import React from "react";
import { portfolioData } from "../../data/portfolioData";

export default function SkillsApp() {
  const tags = portfolioData.skillTags || [];

  return (
    <div className="pocket-app-scroll">
      <p className="pocket-app-section-intro">
        Technologies I work with regularly:
      </p>
      <div className="pocket-skills-grid">
        {tags.map((skill) => (
          <span key={skill} className="pocket-skill-tag">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
