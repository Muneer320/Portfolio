/**
 * ContactApp — Contact options for Pocket Device.
 *
 * One-tap buttons for: Email, GitHub, LinkedIn, Phone, Website.
 *
 * @author Muneer Alam
 */

import React from "react";
import { portfolioData } from "../../data/portfolioData";

export default function ContactApp({ showToast }) {
  // Extract contact info from portfolioData
  const contactText = portfolioData.contact || "";
  const email = "muneer.alam320@gmail.com";
  const github = "https://github.com/Muneer320";
  const linkedin = "https://linkedin.com/in/muneer320";
  const website = "https://muneer320.tech";
  const phone = "+919162392229";

  // Try to extract location
  const locationMatch = contactText.match(/📍\s*(.+)/);
  const location = locationMatch ? locationMatch[1].trim() : "Delhi, India";

  const handleOpen = (url, label) => {
    window.open(url, "_blank", "noopener");
    showToast(`Opening ${label}...`);
  };

  return (
    <div className="pocket-app-scroll">
      <div className="pocket-contact-card">
        <p className="pocket-contact-location">{location}</p>
        <p className="pocket-contact-subtitle">
          Open to freelance, collaborations, and opportunities
        </p>
      </div>

      <div className="pocket-contact-actions">
        <button
          className="pocket-contact-btn pocket-contact-btn-email"
          onClick={() => {
            window.location.href = `mailto:${email}?subject=Reaching%20out%20from%20your%20portfolio`;
            showToast("Opening mail...");
          }}
        >
          <span className="pocket-contact-btn-icon">✉</span>
          <span className="pocket-contact-btn-label">Email</span>
          <span className="pocket-contact-btn-detail">{email}</span>
        </button>

        <button
          className="pocket-contact-btn pocket-contact-btn-gh"
          onClick={() => handleOpen(github, "GitHub")}
        >
          <span className="pocket-contact-btn-icon">🐙</span>
          <span className="pocket-contact-btn-label">GitHub</span>
          <span className="pocket-contact-btn-detail">Muneer320</span>
        </button>

        <button
          className="pocket-contact-btn pocket-contact-btn-li"
          onClick={() => handleOpen(linkedin, "LinkedIn")}
        >
          <span className="pocket-contact-btn-icon">💼</span>
          <span className="pocket-contact-btn-label">LinkedIn</span>
          <span className="pocket-contact-btn-detail">in/muneer320</span>
        </button>

        <button
          className="pocket-contact-btn pocket-contact-btn-web"
          onClick={() => handleOpen(website, "Website")}
        >
          <span className="pocket-contact-btn-icon">🌐</span>
          <span className="pocket-contact-btn-label">Website</span>
          <span className="pocket-contact-btn-detail">muneer320.tech</span>
        </button>

        <button
          className="pocket-contact-btn pocket-contact-btn-phone"
          onClick={() => {
            window.location.href = `tel:${phone}`;
            showToast("Calling...");
          }}
        >
          <span className="pocket-contact-btn-icon">📞</span>
          <span className="pocket-contact-btn-label">Phone</span>
          <span className="pocket-contact-btn-detail">{phone}</span>
        </button>
      </div>
    </div>
  );
}
