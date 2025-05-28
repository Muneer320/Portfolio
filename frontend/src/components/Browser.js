import React, { useState } from 'react';

const Browser = ({ filePath, fileObj, onOpenWindow }) => {
  const [url, setUrl] = useState(filePath ? `file://${filePath}` : "https://github.com/muneer320");
  const [isLoading, setIsLoading] = useState(false);

  const isPdfFile = (filename) => {
    return filename && filename.toLowerCase().endsWith('.pdf');
  };

  if (fileObj && isPdfFile(filePath)) {
    return (
      <div className="browser">
        <div className="browser-bar">
          <input 
            type="text" 
            className="url-bar"
            value={url}
            readOnly
          />
        </div>
        <div className="browser-content pdf-viewer">
          <h2>📄 {filePath.split('/').pop()}</h2>
          <div className="pdf-content">
            <pre>{fileObj.content}</pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="browser">
      <div className="browser-bar">
        <button 
          className="nav-btn"
          onClick={() => window.history.back()}
          disabled
        >
          ←
        </button>
        <button 
          className="nav-btn"
          onClick={() => window.history.forward()}
          disabled
        >
          →
        </button>
        <input 
          type="text" 
          className="url-bar"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsLoading(true);
              // Simulate loading
              setTimeout(() => setIsLoading(false), 1000);
            }
          }}
        />
        <button className="refresh-btn">⟳</button>
      </div>
      
      <div className="browser-content">
        {isLoading ? (
          <div className="loading">
            <div className="loading-spinner">⟳</div>
            <p>Loading...</p>
          </div>
        ) : url === "https://github.com/muneer320" ? (
          <div className="github-page">
            <div className="github-header">
              <div className="github-avatar">
                <div className="avatar-placeholder">👨‍💻</div>
              </div>
              <div className="github-info">
                <h1>Muneer Alam</h1>
                <p className="github-username">@muneer320</p>
                <p className="github-bio">Full-stack developer passionate about creating innovative solutions</p>
                <div className="github-stats">
                  <span>📍 San Francisco, CA</span>
                  <span>📧 muneer.alam@email.com</span>
                  <span>🔗 linkedin.com/in/muneeralam</span>
                </div>
              </div>
            </div>
            
            <div className="github-nav">
              <button className="github-tab active">Repositories</button>
              <button className="github-tab">Projects</button>
              <button className="github-tab">Packages</button>
              <button className="github-tab">Stars</button>
            </div>
            
            <div className="github-repos">
              <div className="repo-item">
                <h3>🌟 portfolio-website</h3>
                <p>Interactive Linux desktop portfolio built with React</p>
                <div className="repo-meta">
                  <span>JavaScript</span>
                  <span>⭐ 42</span>
                  <span>🍴 12</span>
                </div>
              </div>
              
              <div className="repo-item">
                <h3>🛒 ecommerce-platform</h3>
                <p>Full-stack e-commerce application with modern features</p>
                <div className="repo-meta">
                  <span>TypeScript</span>
                  <span>⭐ 28</span>
                  <span>🍴 8</span>
                </div>
              </div>
              
              <div className="repo-item">
                <h3>🤖 ai-chat-assistant</h3>
                <p>Real-time chat application with AI integration</p>
                <div className="repo-meta">
                  <span>Python</span>
                  <span>⭐ 35</span>
                  <span>🍴 15</span>
                </div>
              </div>
              
              <div className="repo-item">
                <h3>📊 data-viz-dashboard</h3>
                <p>Interactive dashboard for business analytics</p>
                <div className="repo-meta">
                  <span>React</span>
                  <span>⭐ 19</span>
                  <span>🍴 6</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="default-page">
            <h2>🌟 Muneer Alam - Portfolio Browser</h2>
            <p>Welcome to my portfolio browser! This simulates a web browser experience.</p>
            
            <div className="quick-links">
              <h3>Quick Navigation:</h3>
              <button onClick={() => setUrl("https://github.com/muneer320")}>🐙 GitHub Profile</button>
              <button onClick={() => onOpenWindow('terminal')}>🖥️ Open Terminal</button>
              <button onClick={() => onOpenWindow('filemanager')}>📁 Browse Files</button>
              <button onClick={() => onOpenWindow('musicplayer')}>🎵 Music Player</button>
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