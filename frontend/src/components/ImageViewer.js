/**
 * ImageViewer Component
 *
 * A comprehensive image viewing application with zoom, rotation, and
 * error handling capabilities. Provides a professional image viewing
 * experience similar to desktop image viewers.
 *
 * Features:
 * - Image zoom (25% to 300%) with controls and slider
 * - 90-degree rotation with reset functionality
 * - Error handling with placeholder display
 * - Image loading states and feedback
 * - Smooth transitions and animations
 * - File information display
 *
 * @author Muneer
 * @component
 */

// ============================================================================
// IMPORTS
// ============================================================================

import React, { useState } from "react";

// ============================================================================
// IMAGEVIEWER COMPONENT
// ============================================================================

/**
 * ImageViewer Component
 *
 * @param {Object} props - Component props
 * @param {string} props.filePath - Path to the image file
 * @param {Object} props.fileObj - File object with image data (optional)
 * @returns {JSX.Element} ImageViewer component
 */
const ImageViewer = ({ filePath, fileObj }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // ============================================================================
  // CONSTANTS
  // ============================================================================

  const MIN_ZOOM = 25;
  const MAX_ZOOM = 300;
  const ZOOM_STEP = 25;
  const ROTATION_STEP = 90;

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle successful image loading
   */
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  /**
   * Handle image loading errors
   */
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  /**
   * Increase zoom level by step amount
   */
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  };

  /**
   * Decrease zoom level by step amount
   */
  const handleZoomOut = () => {
    setZoom((prev) => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
  };

  /**
   * Rotate image by 90 degrees clockwise
   */
  const handleRotate = () => {
    setRotation((prev) => (prev + ROTATION_STEP) % 360);
  };

  /**
   * Reset all transformations to default values
   */
  const handleReset = () => {
    setZoom(100);
    setRotation(0);
  };

  /**
   * Handle zoom slider changes
   *
   * @param {Event} e - Change event from range input
   */
  const handleZoomSlider = (e) => {
    setZoom(parseInt(e.target.value));
  };

  /**
   * Reset only rotation to 0 degrees
   */
  const handleResetRotation = () => {
    setRotation(0);
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Get image file name from path
   *
   * @returns {string} Image file name
   */
  const getImageName = () => {
    return filePath ? filePath.split("/").pop() : "Image";
  };

  /**
   * Get image file extension
   *
   * @returns {string} File extension in uppercase
   */
  const getImageFormat = () => {
    return filePath?.split(".").pop().toUpperCase() || "UNKNOWN";
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="image-viewer">
      {/* Image Header with Info */}
      <div className="image-header">
        <h3>🖼️ {getImageName()}</h3>
        <div className="image-info">
          <span>Zoom: {zoom}%</span>
          <span>Rotation: {rotation}°</span>
        </div>
      </div>

      {/* Main Image Content Area */}
      <div className="image-content">
        <div className="image-container">
          {!imageError ? (
            <img
              src={filePath}
              alt={getImageName()}
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
            // Error Placeholder
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
                  <span>Format: {getImageFormat()}</span>
                  <span>Status: File not accessible</span>
                  <span>Path: {filePath}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Controls */}
      <div className="image-controls">
        {/* Zoom Controls */}
        <div className="control-group">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
            title="Zoom out"
          >
            🔍- Zoom Out
          </button>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
            title="Zoom in"
          >
            🔍+ Zoom In
          </button>
          <button onClick={handleReset} title="Reset all transformations">
            🔄 Reset
          </button>
        </div>

        {/* Rotation Controls */}
        <div className="control-group">
          <button onClick={handleRotate} title="Rotate 90 degrees clockwise">
            ↻ Rotate 90°
          </button>
          <button
            onClick={handleResetRotation}
            title="Reset rotation to 0 degrees"
          >
            📐 Reset Rotation
          </button>
        </div>

        {/* Zoom Slider */}
        <div className="zoom-slider">
          <span>{MIN_ZOOM}%</span>
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={ZOOM_STEP}
            value={zoom}
            onChange={handleZoomSlider}
            className="slider"
            title={`Zoom: ${zoom}%`}
          />
          <span>{MAX_ZOOM}%</span>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
