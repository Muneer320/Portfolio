/**
 * CvApp — Resume/CV download for Pocket Device.
 *
 * Shows a preview card and download/view buttons.
 * Handles mobile-specific download behavior (iOS doesn't support download attr).
 *
 * @author Muneer Alam
 */

import React from "react";
import { portfolioData } from "data/portfolioData";

const PDF_PATH = "/home/muneer/Documents/CV.pdf";

export default function CvApp({ showToast }) {
  const stats = portfolioData.quickStats || {};

  const handleDownload = () => {
    // Try programmatic download
    const link = document.createElement("a");
    link.href = PDF_PATH;
    link.download = "Muneer_Alam_Resume.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloading CV...");
  };

  const handleView = () => {
    window.open(PDF_PATH, "_blank");
    showToast("Opening CV...");
  };

  return (
    <div className="pocket-app-scroll">
      <div className="pocket-cv-card">
        <div className="pocket-cv-avatar" aria-hidden="true">MA</div>
        <h2 className="pocket-cv-name">Muneer Alam</h2>
        <p className="pocket-cv-title">Software Developer</p>

        <div className="pocket-cv-stats">
          <div className="pocket-cv-stat">
            <span className="pocket-cv-stat-value">{stats.experience || "6+ Years"}</span>
            <span className="pocket-cv-stat-label">Experience</span>
          </div>
          <div className="pocket-cv-stat">
            <span className="pocket-cv-stat-value">{stats.projects || "12+"}</span>
            <span className="pocket-cv-stat-label">Projects</span>
          </div>
          <div className="pocket-cv-stat">
            <span className="pocket-cv-stat-value">{stats.technologies || "30+"}</span>
            <span className="pocket-cv-stat-label">Technologies</span>
          </div>
        </div>
      </div>

      <div className="pocket-cv-actions">
        <button
          className="pocket-cv-btn pocket-cv-btn-download"
          onClick={handleDownload}
        >
          📥 Download CV
        </button>
        <button
          className="pocket-cv-btn pocket-cv-btn-view"
          onClick={handleView}
        >
          👁 View Online
        </button>
      </div>

      <p className="pocket-cv-note">
        If the download doesn't start automatically, tap "View Online" to open
        the PDF in your browser, then save from there.
      </p>
    </div>
  );
}
