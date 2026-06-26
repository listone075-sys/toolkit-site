import type { ShareState } from "./types";

/**
 * Encode tool state into URL hash fragment.
 * Hash fragments are client-side only — never sent to the server.
 */
export function encodeShareState(state: ShareState): string {
  try {
    const json = JSON.stringify(state);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    return `#s=${encoded}`;
  } catch {
    return "";
  }
}

/**
 * Decode share state from current URL hash fragment.
 * Returns null if no valid share state is present.
 */
export function decodeShareState(): ShareState | null {
  if (typeof window === "undefined") return null;

  try {
    const hash = window.location.hash;
    const match = hash.match(/^#s=(.+)$/);
    if (!match) return null;

    const json = decodeURIComponent(escape(atob(match[1])));
    const state = JSON.parse(json);

    if (state && typeof state.tool === "string" && state.params) {
      return state as ShareState;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Clear share state from the URL without a page reload.
 */
export function clearShareState(): void {
  if (typeof window === "undefined") return;
  history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search,
  );
}

/**
 * Get the full shareable URL with hash encoded.
 */
export function getShareUrl(state: ShareState): string {
  if (typeof window === "undefined") return "";
  const base = window.location.origin + window.location.pathname;
  return base + encodeShareState(state);
}
