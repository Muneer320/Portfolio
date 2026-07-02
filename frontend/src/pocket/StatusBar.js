/**
 * StatusBar — Top status bar for the Pocket Device.
 *
 * Shows: monogram, time, decorative signal dots.
 * Matches the device metaphor without being a functional OS bar.
 *
 * @author Muneer Alam
 */

import React, { useState, useEffect } from "react";

export default function StatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const formatted = time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="pocket-statusbar" role="status" aria-label="Device status">
      <span className="pocket-statusbar-left" aria-hidden="true">
        MA
      </span>
      <span className="pocket-statusbar-center">{formatted}</span>
      <span className="pocket-statusbar-right" aria-hidden="true">
        <span className="pocket-signal" />
        <span className="pocket-signal active" />
        <span className="pocket-signal active" />
        <span className="pocket-signal active" />
      </span>
    </div>
  );
}
