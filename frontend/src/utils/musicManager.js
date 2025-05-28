// Global music manager to handle music playback across the application
class MusicManager {
  constructor() {
    this.currentAudio = null;
    this.currentTrack = null;
    this.isPlaying = false;
    this.volume = 0.3; // Start with lower volume (30%)
    this.availableMusic = [];
    this.onStateChangeCallbacks = [];
  }

  // Initialize with available music files
  async loadAvailableMusic() {
    try {
      const response = await fetch("/home/muneer/directory_structure.json");
      const fileSystem = await response.json();

      if (fileSystem.Music && fileSystem.Music.children) {
        this.availableMusic = Object.keys(fileSystem.Music.children)
          .filter((filename) => this.isAudioFile(filename))
          .map((filename) => ({
            name: filename,
            title: filename.replace(/\.[^/.]+$/, ""), // Remove extension
            path: `/home/muneer/Music/${filename}`,
          }));
      }
    } catch (error) {
      console.error("Error loading music files:", error);
      this.availableMusic = [];
    }

    this.notifyStateChange();
    return this.availableMusic;
  }

  isAudioFile(filename) {
    const audioExtensions = ["mp3", "wav", "ogg", "flac", "m4a", "webm"];
    return audioExtensions.includes(filename.split(".").pop().toLowerCase());
  }

  // Play a specific track
  async playTrack(trackPath) {
    // Stop current track if any
    this.stop();

    if (!this.hasAvailableMusic()) {
      console.warn("No music available to play");
      return false;
    }

    // Find the track info
    const track =
      this.availableMusic.find((t) => t.path === trackPath) ||
      this.availableMusic[0];

    try {
      this.currentAudio = new Audio(track.path);
      this.currentTrack = track;
      this.currentAudio.volume = this.volume;

      // Set up event listeners
      this.currentAudio.addEventListener("ended", () => {
        this.stop();
      });

      this.currentAudio.addEventListener("error", (e) => {
        console.error("Error playing audio:", e);
        this.stop();
      });

      await this.currentAudio.play();
      this.isPlaying = true;
      this.notifyStateChange();
      return true;
    } catch (error) {
      console.error("Error playing track:", error);
      this.stop();
      return false;
    }
  }

  // Toggle play/pause
  async toggle() {
    if (!this.hasAvailableMusic()) {
      return false;
    }

    if (this.currentAudio && this.currentTrack) {
      if (this.isPlaying) {
        this.pause();
      } else {
        try {
          await this.currentAudio.play();
          this.isPlaying = true;
          this.notifyStateChange();
        } catch (error) {
          console.error("Error resuming playback:", error);
          this.stop();
        }
      }
    } else {
      // Start playing first available track
      if (this.availableMusic.length > 0) {
        return await this.playTrack(this.availableMusic[0].path);
      }
    }
    return this.isPlaying;
  }

  // Pause current track
  pause() {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause();
      this.isPlaying = false;
      this.notifyStateChange();
    }
  }

  // Stop and clear current track
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = "";
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.currentTrack = null;
    this.notifyStateChange();
  }

  // Set volume (0-1)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
    this.notifyStateChange();
  }

  // Get current state
  getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrack,
      volume: this.volume,
      hasMusic: this.hasAvailableMusic(),
      availableMusic: this.availableMusic,
    };
  }

  // Check if any music is available
  hasAvailableMusic() {
    return this.availableMusic.length > 0;
  }

  // Subscribe to state changes
  onStateChange(callback) {
    this.onStateChangeCallbacks.push(callback);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  // Notify all subscribers of state changes
  notifyStateChange() {
    const state = this.getState();
    this.onStateChangeCallbacks.forEach((callback) => {
      try {
        callback(state);
      } catch (error) {
        console.error("Error in state change callback:", error);
      }
    });
  }

  // Get current audio element (for MusicPlayer component)
  getCurrentAudio() {
    return this.currentAudio;
  }

  // Seek to specific time
  seekTo(time) {
    if (this.currentAudio) {
      this.currentAudio.currentTime = time;
    }
  }
}

// Create global instance
const musicManager = new MusicManager();
export default musicManager;
