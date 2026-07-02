/**
 * usePocketDevice — Unified state hook for the Pocket Device.
 *
 * Manages:
 *   - Lock/unlock state
 *   - Current app (null = home screen)
 *   - Browser history (pushState / popState) for back navigation
 *   - Toast notification queue
 *   - Session restoration on refresh
 *
 * Usage:
 *   const device = usePocketDevice();
 *   // device.isLocked, device.currentApp, device.unlock(), device.openApp(id), etc.
 *
 * @author Muneer Alam
 */

import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "pocket_device_state";

function loadSession() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Only restore unlocked state — always start locked on fresh navigation
      if (parsed.currentApp) {
        return { isLocked: false, currentApp: parsed.currentApp };
      }
    }
  } catch {
    // Ignore parse errors
  }
  return { isLocked: true, currentApp: null };
}

export default function usePocketDevice() {
  // Always start locked; restore app state only if it was unlocked
  const initialState = loadSession();
  const [isLocked, setIsLocked] = useState(initialState.isLocked);
  const [currentApp, setCurrentApp] = useState(initialState.currentApp);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  /** Unlock the device — transitions from lock screen to home screen */
  const unlock = useCallback(() => {
    setIsLocked(false);
    setCurrentApp(null);

    // Manage browser history for back navigation
    // Push a "lock" buffer state so pressing back from home → lock, not leave site
    window.history.pushState({ screen: "lock" }, "");
    window.history.pushState({ screen: "home" }, "");

    // Persist unlocked state
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ isLocked: false, currentApp: null })
    );
  }, []);

  /** Open an app */
  const openApp = useCallback((appId) => {
    setCurrentApp(appId);
    window.history.pushState({ screen: "app", app: appId }, "");

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ isLocked: false, currentApp: appId })
    );
  }, []);

  /** Close the current app and return to home */
  const closeApp = useCallback(() => {
    setCurrentApp(null);
    window.history.pushState({ screen: "home" }, "");

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ isLocked: false, currentApp: null })
    );
  }, []);

  /** Show a temporary toast notification */
  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  /** Handle browser back button */
  useEffect(() => {
    const handlePopState = (e) => {
      const screen = e.state?.screen;

      if (currentApp) {
        // Currently in an app → go back to home
        setCurrentApp(null);
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ isLocked: false, currentApp: null })
        );
        return;
      }

      if (!isLocked && (!screen || screen === "lock")) {
        // On home screen with no further app → go back to lock
        setIsLocked(true);
        setCurrentApp(null);
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }

      // If already on lock screen (or no state), let browser handle normally
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isLocked, currentApp]);

  // Clean up toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  return {
    isLocked,
    currentApp,
    toast,
    unlock,
    openApp,
    closeApp,
    showToast,
  };
}
