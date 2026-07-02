/**
 * HomeScreen — Main navigation hub after unlocking.
 *
 * Displays: wallpaper, status bar, QuickStats card, app grid.
 * Apps are rendered from the APPS registry.
 *
 * @author Muneer Alam
 */

import React from "react";
import StatusBar from "./StatusBar";
import QuickStats from "./QuickStats";
import AppIcon from "./AppIcon";
import { APPS, GRID_COLUMNS } from "./data/apps";

export default function HomeScreen({ onOpenApp }) {
  // Split apps into rows for the grid
  const rows = [];
  for (let i = 0; i < APPS.length; i += GRID_COLUMNS) {
    rows.push(APPS.slice(i, i + GRID_COLUMNS));
  }

  return (
    <div className="pocket-homescreen">
      {/* Wallpaper is applied via CSS — shared with lock screen */}
      <div className="pocket-homescreen-wallpaper" aria-hidden="true" />
      <div className="pocket-homescreen-overlay" aria-hidden="true" />

      <StatusBar />

      <div className="pocket-homescreen-content">
        <QuickStats />

        <div
          className="pocket-homescreen-grid"
          role="list"
          aria-label="Available apps"
        >
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="pocket-homescreen-row"
              role="list"
              aria-label={`App row ${rowIndex + 1}`}
            >
              {row.map((app) => (
                <AppIcon key={app.id} app={app} onOpen={onOpenApp} />
              ))}
              {/* Fill remaining cells in last row for alignment */}
              {row.length < GRID_COLUMNS &&
                Array.from({ length: GRID_COLUMNS - row.length }).map(
                  (_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="pocket-app-icon pocket-app-icon-empty"
                      aria-hidden="true"
                    />
                  )
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
