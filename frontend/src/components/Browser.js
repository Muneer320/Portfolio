/**
 * Browser Component
 *
 * A simulated web browser interface with PDF viewing capabilities and
 * GitHub profile simulation. Provides a realistic browsing experience
 * within the portfolio environment.
 *
 * @author Muneer Alam
 * @component
 */

import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSync,
  FaStar,
  FaCodeBranch,
  FaExternalLinkAlt,
} from "react-icons/fa";

const Browser = ({ filePath, fileObj, onOpenWindow }) => {
  const [url, setUrl] = useState(
    filePath ? `file://${filePath}` : "https://github.com/muneer320"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [gitHubData, setGitHubData] = useState(null);
  const [gitHubRepos, setGitHubRepos] = useState([]);
  const [gitHubError, setGitHubError] = useState(null);
  const [activeTab, setActiveTab] = useState("repositories");
  // ============================================================================
  // GITHUB API FUNCTIONS
  // ============================================================================

  /**
   * Fetch GitHub user profile data
   */
  const fetchGitHubProfile = async (username) => {
    try {
      setIsLoading(true);
      setGitHubError(null);

      const response = await fetch(`https://api.github.com/users/${username}`);

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const userData = await response.json();
      setGitHubData(userData);

      // Also fetch repositories
      await fetchGitHubRepos(username);
    } catch (error) {
      console.error("Error fetching GitHub profile:", error);
      setGitHubError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  /**
   * Fetch GitHub repositories
   */
  const fetchGitHubRepos = async (username) => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`
      );

      if (!response.ok) {
        throw new Error(`GitHub Repos API error: ${response.status}`);
      }

      const reposData = await response.json();
      setGitHubRepos(reposData);
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
    }
  };
  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /**
   * Get color for programming language
   * @param {string} language - Programming language name
   */
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      Python: "#3572A5",
      Java: "#b07219",
      "C++": "#f34b7d",
      C: "#555555",
      HTML: "#e34c26",
      CSS: "#563d7c",
      PHP: "#4F5D95",
      Go: "#00ADD8",
      Rust: "#dea584",
      Swift: "#ffac45",
      Kotlin: "#F18E33",
      Ruby: "#701516",
      Shell: "#89e051",
      Dockerfile: "#384d54",
      Vue: "#2c3e50",
      React: "#61dafb",
    };
    return colors[language] || "#586069";
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    // Auto-fetch GitHub data when component mounts and URL is GitHub
    if (url === "https://github.com/muneer320") {
      fetchGitHubProfile("muneer320");
    }
  }, [url]);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Check if the current file is a PDF document
   *
   * @param {string} filename - Name of the file to check
   * @returns {boolean} True if file is a PDF
   */
  const isPdfFile = (filename) => {
    return filename && filename.toLowerCase().endsWith(".pdf");
  };
  /**
   * Handle URL navigation with Enter key
   *
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleUrlNavigation = (e) => {
    if (e.key === "Enter") {
      setIsLoading(true);

      // Check if it's a GitHub URL
      if (url.includes("github.com")) {
        const username = url.split("/").pop() || "muneer320";
        fetchGitHubProfile(username);
      } else {
        // Simulate loading delay for other URLs
        setTimeout(() => setIsLoading(false), 1000);
      }
    }
  };

  /**
   * Handle refresh button click
   */
  const handleRefresh = () => {
    if (url === "https://github.com/muneer320") {
      fetchGitHubProfile("muneer320");
    } else {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  // ============================================================================
  // RENDER - PDF VIEWER
  // ============================================================================

  // Special rendering for PDF files
  if (fileObj && isPdfFile(filePath)) {
    return (
      <div className="browser">
        <div className="browser-bar">
          <input type="text" className="url-bar" value={url} readOnly />
        </div>
        <div className="browser-content pdf-viewer">
          <h2>📄 {filePath.split("/").pop()}</h2>
          <div className="pdf-content">
            <pre>{fileObj.content}</pre>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER - MAIN BROWSER
  // ============================================================================
  return (
    <div className="browser">
      <div className="browser-bar">
        {" "}
        <button
          className="nav-btn"
          onClick={() => window.history.back()}
          disabled
          title="Go back"
        >
          <FaArrowLeft />
        </button>
        <button
          className="nav-btn"
          onClick={() => window.history.forward()}
          disabled
          title="Go forward"
        >
          <FaArrowRight />
        </button>
        <input
          type="text"
          className="url-bar"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleUrlNavigation}
          placeholder="Enter URL or search..."
        />{" "}
        <button
          className="refresh-btn"
          onClick={handleRefresh}
          title="Refresh page"
        >
          <FaSync />
        </button>
      </div>{" "}
      <div className="browser-content">
        {" "}
        {isLoading ? (
          <div className="loading">
            <div className="loading-spinner">⟳</div>
            <p>Loading...</p>
          </div>
        ) : url === "https://github.com/muneer320" ? (
          <div className="github-page">
            {" "}
            {gitHubError ? (
              <div className="github-error">
                <h2>⚠️ Unable to Load GitHub Profile</h2>
                <p>Error: {gitHubError}</p>
                <p>This might be due to API rate limits or network issues.</p>
                <button
                  onClick={() => fetchGitHubProfile("muneer320")}
                  className="retry-btn"
                >
                  🔄 Try Again
                </button>
                <button
                  onClick={() =>
                    window.open("https://github.com/muneer320", "_blank")
                  }
                  className="external-link-btn"
                >
                  <FaExternalLinkAlt /> Open Real GitHub Profile
                </button>
              </div>
            ) : gitHubData ? (
              <>
                <div className="github-header">
                  <div className="github-avatar">
                    <img
                      src={gitHubData.avatar_url}
                      alt={gitHubData.name || gitHubData.login}
                      className="avatar-image"
                    />
                  </div>
                  <div className="github-info">
                    <h1>{gitHubData.name || gitHubData.login}</h1>
                    <p className="github-username">@{gitHubData.login}</p>
                    {gitHubData.bio && (
                      <p className="github-bio">{gitHubData.bio}</p>
                    )}
                    <div className="github-stats">
                      {gitHubData.location && (
                        <span>📍 {gitHubData.location}</span>
                      )}
                      {gitHubData.email && <span>📧 {gitHubData.email}</span>}
                      {gitHubData.blog && (
                        <span>
                          🔗{" "}
                          <a
                            href={gitHubData.blog}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {gitHubData.blog}
                          </a>
                        </span>
                      )}
                    </div>
                    <div className="github-metrics">
                      <span>👥 {gitHubData.followers} followers</span>
                      <span>👤 {gitHubData.following} following</span>
                      <span>📚 {gitHubData.public_repos} repositories</span>
                    </div>
                  </div>
                </div>

                <div className="github-nav">
                  <button
                    className={`github-tab ${
                      activeTab === "repositories" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("repositories")}
                  >
                    Repositories
                  </button>
                  <button
                    className={`github-tab ${
                      activeTab === "overview" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                </div>

                {activeTab === "repositories" ? (
                  <div className="github-repos">
                    <div className="repos-header">
                      <h3>📚 Repositories ({gitHubRepos.length})</h3>
                      <button
                        onClick={() =>
                          window.open(
                            `https://github.com/${gitHubData.login}?tab=repositories`,
                            "_blank"
                          )
                        }
                        className="view-all-btn"
                      >
                        View All on GitHub <FaExternalLinkAlt />
                      </button>
                    </div>

                    {gitHubRepos.length > 0 ? (
                      gitHubRepos.map((repo) => (
                        <div key={repo.id} className="repo-item">
                          <div className="repo-header">
                            <h3>
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="repo-name"
                              >
                                {repo.name}{" "}
                                <FaExternalLinkAlt className="external-icon" />
                              </a>
                            </h3>
                            {repo.private && (
                              <span className="private-badge">Private</span>
                            )}
                          </div>
                          {repo.description && (
                            <p className="repo-description">
                              {repo.description}
                            </p>
                          )}
                          <div className="repo-meta">
                            {repo.language && (
                              <span className="language">
                                <span
                                  className="language-dot"
                                  style={{
                                    backgroundColor: getLanguageColor(
                                      repo.language
                                    ),
                                  }}
                                ></span>
                                {repo.language}
                              </span>
                            )}
                            <span className="stars">
                              <FaStar /> {repo.stargazers_count}
                            </span>
                            <span className="forks">
                              <FaCodeBranch /> {repo.forks_count}
                            </span>
                            <span className="updated">
                              Updated {formatDate(repo.updated_at)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-repos">No public repositories found.</p>
                    )}
                  </div>
                ) : (
                  <div className="github-overview">
                    <div className="overview-stats">
                      <div className="stat-card">
                        <h4>📊 Profile Stats</h4>
                        <ul>
                          <li>
                            Joined GitHub: {formatDate(gitHubData.created_at)}
                          </li>
                          <li>
                            Public Repositories: {gitHubData.public_repos}
                          </li>
                          <li>Public Gists: {gitHubData.public_gists}</li>
                          <li>Followers: {gitHubData.followers}</li>
                          <li>Following: {gitHubData.following}</li>
                        </ul>
                      </div>

                      {gitHubData.company && (
                        <div className="stat-card">
                          <h4>🏢 Work</h4>
                          <p>{gitHubData.company}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="github-loading">
                <div className="loading-spinner">⟳</div>
                <p>Loading GitHub profile...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="default-page">
            <h2>🌟 Muneer Alam - Portfolio Browser</h2>
            <p>
              Welcome to my portfolio browser! This simulates a web browser
              experience.
            </p>

            <div className="quick-links">
              <h3>Quick Navigation:</h3>
              <button onClick={() => setUrl("https://github.com/muneer320")}>
                🐙 GitHub Profile
              </button>
              <button onClick={() => onOpenWindow("terminal")}>
                🖥️ Open Terminal
              </button>
              <button onClick={() => onOpenWindow("filemanager")}>
                📁 Browse Files
              </button>
              <button onClick={() => onOpenWindow("musicplayer")}>
                🎵 Music Player
              </button>
            </div>

            <div className="browser-features">
              <h3>Browser Features:</h3>
              <ul>
                <li>📄 PDF document viewer</li>
                <li>🌐 Simulated web browsing</li>
                <li>🔗 Quick access to portfolio content</li>
                <li>📱 Responsive design</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browser;
