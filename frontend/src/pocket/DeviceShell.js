/**
 * DeviceShell — Main orchestrator for the Pocket Device.
 *
 * Manages the three display layers:
 *   1. Locked  → LockScreen
 *   2. Unlocked → HomeScreen (or AppShell + app content)
 *   3. In-app  → AppShell wrapping the lazy-loaded app component
 *
 * All state comes from the usePocketDevice hook.
 *
 * @author Muneer Alam
 */

import React, { Suspense } from "react";
import usePocketDevice from "./hooks/usePocketDevice";
import { APPS } from "./data/apps";
import LockScreen from "./LockScreen";
import HomeScreen from "./HomeScreen";
import AppShell from "./AppShell";
import Toast from "./Toast";
import SkipLink, { SkipTarget } from "./SkipLink";

function AppFallback() {
  return (
    <div className="pocket-appshell-pocket-appshell-loading">
      <div className="pocket-loading-spinner" aria-label="Loading" />
    </div>
  );
}

export default function DeviceShell() {
  const { isLocked, currentApp, toast, unlock, openApp, closeApp, showToast } =
    usePocketDevice();

  // Lock screen
  if (isLocked) {
    return (
      <div className="pocket-device">
        <SkipLink />
        <SkipTarget />
        <LockScreen onUnlock={unlock} />
      </div>
    );
  }

  // Home screen
  if (!currentApp) {
    return (
      <div className="pocket-device">
        <SkipLink />
        <SkipTarget />
        <HomeScreen onOpenApp={openApp} />
        <Toast message={toast} />
      </div>
    );
  }

  // App view — find the app in the registry and render it
  const appConfig = APPS.find((a) => a.id === currentApp);
  if (!appConfig) {
    closeApp();
    return null;
  }

  const AppComponent = appConfig.component;

  return (
    <div className="pocket-device">
      <SkipLink />
      <SkipTarget />
      <AppShell appId={currentApp} onClose={closeApp}>
        <Suspense fallback={<AppFallback />}>
          <AppComponent showToast={showToast} />
        </Suspense>
      </AppShell>
      <Toast message={toast} />
    </div>
  );
}
