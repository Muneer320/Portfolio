/**
 * SkipLink — Accessibility skip-link for the Pocket Device.
 *
 * Allows keyboard and screen reader users to bypass
 * the device simulation and jump directly to portfolio content.
 * Rendered as the first focusable element in the DOM.
 *
 * @author Muneer Alam
 */

import React from "react";

const SKIP_TARGET_ID = "pocket-skip-content";

export default function SkipLink() {
  return (
    <a
      href={`#${SKIP_TARGET_ID}`}
      className="pocket-skip-link"
      style={{
        position: "absolute",
        top: "-100px",
        left: "8px",
        zIndex: 99999,
        padding: "12px 20px",
        background: "#61dafb",
        color: "#1e1e2e",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "14px",
        textDecoration: "none",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      Skip to portfolio content
    </a>
  );
}

export function SkipTarget() {
  return <div id={SKIP_TARGET_ID} tabIndex={-1} style={{ outline: "none" }} />;
}
