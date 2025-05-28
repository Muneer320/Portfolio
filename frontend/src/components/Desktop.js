import React from 'react';

const Desktop = ({ onOpenWindow }) => {
  const desktopIcons = [
    { id: 'terminal', icon: '💻', name: 'Terminal', position: { x: 50, y: 100 } },
    { id: 'filemanager', icon: '📁', name: 'Files', position: { x: 50, y: 200 } },
    { id: 'texteditor', icon: '📝', name: 'Text Editor', position: { x: 50, y: 300 } },
    { id: 'browser', icon: '🌐', name: 'Browser', position: { x: 50, y: 400 } },
    { id: 'musicplayer', icon: '🎵', name: 'Music', position: { x: 50, y: 500 } }
  ];

  return (
    <div className="desktop-icons">
      {desktopIcons.map(iconItem => (
        <div
          key={iconItem.id}
          className="desktop-icon"
          style={{
            position: 'absolute',
            left: iconItem.position.x,
            top: iconItem.position.y
          }}
          onClick={() => onOpenWindow(iconItem.id)}
        >
          <div className="icon">{iconItem.icon}</div>
          <span>{iconItem.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Desktop;