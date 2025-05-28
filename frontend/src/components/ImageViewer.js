import React, { useState } from "react";

const ImageViewer = ({ filePath, fileObj }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(300, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(25, prev - 25));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
  };

  return (
    <div className="image-viewer">
      <div className="image-header">
        <h3>🖼️ {filePath ? filePath.split("/").pop() : "Image"}</h3>
        <div className="image-info">
          <span>Zoom: {zoom}%</span>
          <span>Rotation: {rotation}°</span>
        </div>
      </div>
      <div className="image-content">
        <div className="image-container">
          {!imageError ? (
            <img
              src={filePath}
              alt={filePath ? filePath.split("/").pop() : "Image"}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: "transform 0.3s ease",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              className="image-placeholder"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: "transform 0.3s ease",
              }}
            >
              <div className="placeholder-icon">🖼️</div>
              <div className="image-details">
                <h4>Image Not Found</h4>
                <p>{filePath}</p>
                <div className="image-meta">
                  <span>
                    Format: {filePath?.split(".").pop().toUpperCase()}
                  </span>
                  <span>Status: File not accessible</span>
                  <span>Path: {filePath}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="image-controls">
        <div className="control-group">
          <button onClick={handleZoomOut} disabled={zoom <= 25}>
            🔍- Zoom Out
          </button>
          <button onClick={handleZoomIn} disabled={zoom >= 300}>
            🔍+ Zoom In
          </button>
          <button onClick={handleReset}>🔄 Reset</button>
        </div>

        <div className="control-group">
          <button onClick={handleRotate}>↻ Rotate 90°</button>
          <button onClick={() => setRotation(0)}>📐 Reset Rotation</button>
        </div>

        <div className="zoom-slider">
          <span>25%</span>
          <input
            type="range"
            min="25"
            max="300"
            step="25"
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            className="slider"
          />
          <span>300%</span>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
