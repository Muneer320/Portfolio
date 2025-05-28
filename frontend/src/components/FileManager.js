import React, { useState, useEffect } from 'react';
import { loadFileSystem } from '../utils/fileSystemLoader';

const FileManager = ({ onOpenFile, initialPath = '/home/muneer' }) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [fileSystem, setFileSystem] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFileSystem().then(fs => {
      setFileSystem(fs);
      setLoading(false);
    });
  }, []);

  const getDirectoryContents = (path) => {
    const pathParts = path.split('/').filter(p => p);
    let currentDir = fileSystem['/'];
    
    for (let part of pathParts) {
      if (currentDir && currentDir.children && currentDir.children[part]) {
        currentDir = currentDir.children[part];
      } else {
        return null;
      }
    }
    
    return currentDir?.children || {};
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    return imageExtensions.includes(getFileExtension(filename));
  };

  const isPdfFile = (filename) => {
    return getFileExtension(filename) === 'pdf';
  };

  const isAudioFile = (filename) => {
    const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'webm'];
    return audioExtensions.includes(getFileExtension(filename));
  };

  const getFileIcon = (name, item) => {
    if (item.type === 'directory') return '📁';
    if (isImageFile(name)) return '🖼️';
    if (isPdfFile(name)) return '📄';
    if (isAudioFile(name)) return '🎵';
    if (name.endsWith('.md')) return '📝';
    if (name.endsWith('.txt')) return '📄';
    if (name.endsWith('.json')) return '⚙️';
    return '📄';
  };

  const handleItemClick = (name, item) => {
    const newPath = currentPath === '/' ? '/' + name : currentPath + '/' + name;
    
    if (item.type === 'directory') {
      setCurrentPath(newPath);
    } else {
      onOpenFile(newPath, item);
    }
  };

  const handleBackClick = () => {
    const pathParts = currentPath.split('/').filter(p => p);
    pathParts.pop();
    const newPath = pathParts.length > 0 ? '/' + pathParts.join('/') : '/';
    setCurrentPath(newPath);
  };

  const handlePathClick = (index) => {
    const pathParts = currentPath.split('/').filter(p => p);
    const newPathParts = pathParts.slice(0, index + 1);
    const newPath = newPathParts.length > 0 ? '/' + newPathParts.join('/') : '/';
    setCurrentPath(newPath);
  };

  if (loading) {
    return (
      <div className="file-manager">
        <div className="file-header">
          <span>Loading...</span>
        </div>
        <div className="file-list">
          <div className="loading">Loading file system...</div>
        </div>
      </div>
    );
  }

  const contents = getDirectoryContents(currentPath);
  const pathParts = currentPath.split('/').filter(p => p);

  return (
    <div className="file-manager">
      <div className="file-header">
        <div className="file-navigation">
          {currentPath !== '/' && (
            <button className="back-btn" onClick={handleBackClick}>
              ← Back
            </button>
          )}
          <div className="file-path">
            <span 
              className="path-segment clickable"
              onClick={() => setCurrentPath('/')}
            >
              📁
            </span>
            {pathParts.map((part, index) => (
              <span key={index}>
                <span className="path-separator">/</span>
                <span 
                  className="path-segment clickable"
                  onClick={() => handlePathClick(index)}
                >
                  {part}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="file-list">
        {contents && Object.keys(contents).length > 0 ? (
          Object.entries(contents).sort(([a, itemA], [b, itemB]) => {
            // Sort directories first, then files
            if (itemA.type === 'directory' && itemB.type !== 'directory') return -1;
            if (itemA.type !== 'directory' && itemB.type === 'directory') return 1;
            return a.localeCompare(b);
          }).map(([name, item]) => (
            <div 
              key={name}
              className={`file-item ${item.type}`}
              onClick={() => handleItemClick(name, item)}
              title={item.description || name}
            >
              <span className="file-icon">{getFileIcon(name, item)}</span>
              <span className="file-name">{name}</span>
              <span className="file-type">{item.type}</span>
            </div>
          ))
        ) : (
          <div className="empty-directory">
            <p>📂 Directory is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;