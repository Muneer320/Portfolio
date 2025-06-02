// Audio player manager for handling multiple music players
const players = new Map();
let activeId = null;
let lastId = null;
let currentMusicPath = null;

export const registerPlayer = (id, audio) => {
  players.set(id, audio);
};

export const unregisterPlayer = (id) => {
  if (players.has(id)) players.delete(id);
  if (activeId === id) activeId = null;
};

export const playPlayer = (id) => {
  const audio = players.get(id);
  if (!audio) return;

  // Pause other active players
  if (activeId && activeId !== id) {
    const prev = players.get(activeId);
    if (prev) prev.pause();
  }

  activeId = id;
  lastId = id;
  audio.play().catch(() => {});
};

export const pausePlayer = (id) => {
  const audio = players.get(id);
  if (!audio) return;

  audio.pause();
  lastId = id;
  if (activeId === id) activeId = null;
};

export const togglePlayer = (id) => {
  const audio = players.get(id);
  if (!audio) return;

  if (audio.paused) playPlayer(id);
  else pausePlayer(id);
};

export const getActivePlayer = () => lastId;

export const getRegisteredAudio = (id) => players.get(id);

export const setCurrentMusicPath = (path) => {
  currentMusicPath = path;
};

export const getCurrentMusicPath = () => currentMusicPath;

export const setVolume = (vol) => {
  for (const audio of players.values()) {
    audio.volume = vol;
  }
};
