/**
 * Color converter: HEX ↔ RGB ↔ HSL.
 * All conversions are pure mathematical functions.
 */

export interface RgbColor {
  r: number; // 0–255
  g: number; // 0–255
  b: number; // 0–255
}

export interface HslColor {
  h: number; // 0–360
  s: number; // 0–100
  l: number; // 0–100
}

/**
 * Parse a HEX color string (3, 4, 6, or 8 digits, with or without #).
 */
export function hexToRgb(hex: string): RgbColor | null {
  hex = hex.replace(/^#/, "");

  // Expand shorthand (3 or 4 chars)
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (hex.length !== 6) return null;

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;

  return { r, g, b };
}

/**
 * Convert RGB to HEX string (e.g., "#1a2b3c").
 */
export function rgbToHex(rgb: RgbColor): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Convert RGB to HSL.
 */
export function rgbToHsl(rgb: RgbColor): HslColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB.
 */
export function hslToRgb(hsl: HslColor): RgbColor {
  const h = ((hsl.h % 360) + 360) % 360;
  const s = Math.max(0, Math.min(100, hsl.s)) / 100;
  const l = Math.max(0, Math.min(100, hsl.l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c; g = x;
  } else if (h < 120) {
    r = x; g = c;
  } else if (h < 180) {
    g = c; b = x;
  } else if (h < 240) {
    g = x; b = c;
  } else if (h < 300) {
    r = x; b = c;
  } else {
    r = c; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Convert HEX to HSL.
 */
export function hexToHsl(hex: string): HslColor | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb);
}

/**
 * Convert HSL to HEX.
 */
export function hslToHex(hsl: HslColor): string {
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Parse an RGB string like "rgb(255, 128, 0)" or "255, 128, 0".
 */
export function parseRgbString(input: string): RgbColor | null {
  const match = input.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/);
  if (!match) return null;
  return {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3]),
  };
}

/**
 * Parse an HSL string like "hsl(200, 80%, 50%)" or "200, 80, 50".
 */
export function parseHslString(input: string): HslColor | null {
  const match = input.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/);
  if (!match) return null;
  return {
    h: parseInt(match[1]),
    s: parseInt(match[2]),
    l: parseInt(match[3]),
  };
}
