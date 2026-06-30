/**
 * Pin Image Generator — creates Pinterest-optimized images from templates.
 *
 * Uses sharp to composite text/colors onto a 1000×1500 canvas.
 * For richer designs, use Canva. This is for quick automated pins.
 *
 * Usage:
 *   node scripts/browser/generate-pin-image.js \
 *     --title "Compress Images by 80%" \
 *     --subtitle "Free Online Tool — No Upload" \
 *     --output ./pin-output.png
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const WIDTH = 1000;
const HEIGHT = 1500;

function parseArgs() {
  const args = { title: "", subtitle: "", output: "" };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--title" && argv[i + 1]) args.title = argv[++i];
    else if (argv[i] === "--subtitle" && argv[i + 1]) args.subtitle = argv[++i];
    else if (argv[i] === "--output" && argv[i + 1]) args.output = argv[++i];
  }
  return args;
}

function createPinSVG({ title, subtitle }) {
  // Split long titles into lines
  const words = title.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).length > 22) {
      lines.push(current.trim());
      current = word;
    } else {
      current += " " + word;
    }
  }
  if (current.trim()) lines.push(current.trim());

  const titleLines = lines
    .map(
      (line, i) =>
        `<text x="500" y="${380 + i * 80}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="58" font-weight="800" fill="white" letter-spacing="-1">${line}</text>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af"/>
      <stop offset="100%" style="stop-color:#1e3a5f"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <!-- Decorative circles -->
  <circle cx="800" cy="1200" r="300" fill="rgba(255,255,255,0.03)"/>
  <circle cx="200" cy="200" r="200" fill="rgba(255,255,255,0.03)"/>
  <!-- Icon area -->
  <rect x="350" y="120" width="300" height="180" rx="24" fill="rgba(255,255,255,0.08)"/>
  <text x="500" y="230" text-anchor="middle" font-size="80">🛠️</text>
  <!-- Title -->
  ${titleLines}
  <!-- Subtitle -->
  <text x="500" y="${380 + lines.length * 80 + 60}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" fill="rgba(255,255,255,0.7)">${subtitle}</text>
  <!-- Brand -->
  <text x="500" y="${HEIGHT - 60}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" fill="rgba(255,255,255,0.4)">toolcraftbox.com</text>
</svg>`;
}

async function main() {
  const args = parseArgs();

  if (!args.title) {
    console.error("Usage: node scripts/browser/generate-pin-image.js \\");
    console.error("  --title <text> [--subtitle <text>] --output <file>");
    process.exit(1);
  }

  const svg = createPinSVG({
    title: args.title,
    subtitle: args.subtitle || "Free Online Tool · No Sign-Up",
  });

  const output = args.output || "pin-output.png";

  await sharp(Buffer.from(svg)).resize(WIDTH, HEIGHT).png().toFile(output);

  console.log(`✅ Pin image saved: ${output} (${WIDTH}×${HEIGHT})`);
}

main().catch(console.error);
