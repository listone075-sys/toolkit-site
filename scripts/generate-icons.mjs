import sharp from "sharp";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");

const svg512 = readFileSync(join(iconsDir, "icon-512.svg"));

async function generate() {
  await sharp(svg512).resize(192, 192).png().toFile(join(iconsDir, "icon-192.png"));
  console.log("  ✓ icon-192.png");

  await sharp(svg512).resize(512, 512).png().toFile(join(iconsDir, "icon-512.png"));
  console.log("  ✓ icon-512.png");

  await sharp(svg512)
    .resize(180, 180)
    .png()
    .toFile(join(iconsDir, "apple-touch-icon.png"));
  console.log("  ✓ apple-touch-icon.png");

  console.log("PNG icons generated successfully.");
}

generate().catch((err) => {
  console.error("Icon generation failed:", err);
  process.exit(1);
});
