/**
 * Toast — Temporary notification that appears at the top of the screen.
 *
 * Used for: "Opening LinkedIn..." feedback when external links are tapped.
 * Auto-dismisses after 3 seconds (managed by usePocketDevice).
 *
 * @author Muneer Alam
 */

import React from "react";

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="pocket-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}
