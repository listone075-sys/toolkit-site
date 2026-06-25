"use client";

import { useEffect } from "react";

/**
 * Registers the service worker on mount.
 * Renders nothing — purely a side effect.
 */
export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration can fail for many reasons (dev mode, unsupported, etc.)
        // Silently ignore — the app still works without it.
      });
    }
  }, []);
  return null;
}
