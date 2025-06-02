/**
 * Music Manager Utility
 *
 * Manages multiple audio players across the portfolio application,
 * ensuring only one audio stream plays at a time and providing
 * centralized control for all music playback functionality.
 *
 * Features:
 * - Multiple player registration and management
 * - Automatic pausing of other players when starting new playback
 * - Global volume control across all players
 * - Current music path tracking
 * - Active player state management
 *
 * @author Muneer
 * @module musicManager
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/** Map of registered audio players by ID */
const players = new Map();

/** ID of the currently active (playing) player */
let activeId = null;

/** ID of the last player that was active */
let lastId = null;

/** Path to the currently loaded music file */
let currentMusicPath = null;

// ============================================================================
// PLAYER REGISTRATION
// ============================================================================

/**
 * Register an audio player instance
 *
 * @param {string} id - Unique identifier for the player
 * @param {HTMLAudioElement} audio - Audio element instance
 */
export const registerPlayer = (id, audio) => {
  players.set(id, audio);
};

/**
 * Unregister an audio player instance
 *
 * @param {string} id - Unique identifier for the player to remove
 */
export const unregisterPlayer = (id) => {
  if (players.has(id)) players.delete(id);
  if (activeId === id) activeId = null;
};

// ============================================================================
// PLAYBACK CONTROL
// ============================================================================

/**
 * Start playback for a specific player
 * Automatically pauses other active players
 *
 * @param {string} id - Unique identifier for the player
 */
export const playPlayer = (id) => {
  const audio = players.get(id);
  if (!audio) return;

  // Pause other active players to ensure only one plays at a time
  if (activeId && activeId !== id) {
    const prev = players.get(activeId);
    if (prev) prev.pause();
  }

  activeId = id;
  lastId = id;
  audio.play().catch(() => {
    // Silently handle play failures (e.g., user interaction required)
  });
};

/**
 * Pause playback for a specific player
 *
 * @param {string} id - Unique identifier for the player
 */
export const pausePlayer = (id) => {
  const audio = players.get(id);
  if (!audio) return;

  audio.pause();
  lastId = id;
  if (activeId === id) activeId = null;
};

/**
 * Toggle play/pause state for a specific player
 *
 * @param {string} id - Unique identifier for the player
 */
export const togglePlayer = (id) => {
  const audio = players.get(id);
  if (!audio) return;

  if (audio.paused) {
    playPlayer(id);
  } else {
    pausePlayer(id);
  }
};

// ============================================================================
// STATE GETTERS
// ============================================================================

/**
 * Get the ID of the last active player
 *
 * @returns {string|null} Player ID or null if none
 */
export const getActivePlayer = () => lastId;

/**
 * Get the audio element for a registered player
 *
 * @param {string} id - Unique identifier for the player
 * @returns {HTMLAudioElement|undefined} Audio element or undefined
 */
export const getRegisteredAudio = (id) => players.get(id);

// ============================================================================
// MUSIC PATH MANAGEMENT
// ============================================================================

/**
 * Set the current music file path
 *
 * @param {string} path - File path to the current music
 */
export const setCurrentMusicPath = (path) => {
  currentMusicPath = path;
};

/**
 * Get the current music file path
 *
 * @returns {string|null} Current music path or null
 */
export const getCurrentMusicPath = () => currentMusicPath;

// ============================================================================
// VOLUME CONTROL
// ============================================================================

/**
 * Set volume for all registered players
 *
 * @param {number} vol - Volume level (0.0 to 1.0)
 */
export const setVolume = (vol) => {
  for (const audio of players.values()) {
    audio.volume = vol;
  }
};
