/**
 * AboutApp — Personal bio and fun facts for Pocket Device.
 *
 * Renders a longer bio, photo area, and fun facts about Muneer.
 *
 * @author Muneer Alam
 */

import React from "react";
import { portfolioData } from "data/portfolioData";

export default function AboutApp() {
  const bio = portfolioData.bio || "";
  const tags = portfolioData.skillTags || [];

  return (
    <div className="pocket-app-scroll">
      <div className="pocket-about-card">
        <div className="pocket-about-avatar" aria-hidden="true">
          <span className="pocket-about-initials">MA</span>
        </div>
        <h2 className="pocket-about-name">Muneer Alam</h2>
        <p className="pocket-about-role">Software Developer</p>
      </div>

      <div className="pocket-about-section">
        <h3 className="pocket-about-section-title">About</h3>
        <p className="pocket-about-bio">{bio}</p>
      </div>

      <div className="pocket-about-section">
        <h3 className="pocket-about-section-title">Focus Areas</h3>
        <div className="pocket-about-tags">
          {tags.slice(0, 8).map((tag) => (
            <span key={tag} className="pocket-about-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pocket-about-section">
        <h3 className="pocket-about-section-title">Quick Facts</h3>
        <ul className="pocket-about-facts">
          <li>🎓 BITS Pilani &amp; Scaler School of Technology · Class of '29 · GPA 9.29</li>
          <li>🏆 Smart Delhi Hackathon Winner · Blocktrain 3rd Place</li>
          <li>🐧 Arch Linux + Hyprland daily driver</li>
          <li>🚀 Co-founder @ ParaPixel DigiServices</li>
          <li>👥 Admin for 800+ member SST student community</li>
          <li>🎮 Top 50 globally in Codingame Clash of Code</li>
        </ul>
      </div>
    </div>
  );
}
