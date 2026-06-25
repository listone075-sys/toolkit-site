/**
 * Minimal client-side GIF encoder for creating animated GIFs from image frames.
 * Uses LZW compression per the GIF89a specification.
 */

interface GifFrame {
  /** ImageData for this frame */
  data: ImageData;
  /** Delay in centiseconds (1/100th second) */
  delay: number;
}

/**
 * Encode a series of frames into an animated GIF blob.
 */
export async function encodeGif(frames: GifFrame[]): Promise<Blob> {
  if (frames.length === 0) throw new Error("At least one frame required");

  const width = frames[0].data.width;
  const height = frames[0].data.height;

  // Build a global color table from all frames (simple median-cut alternative: sample first frame)
  const palette = buildPalette(frames[0].data);
  const colorTable = buildColorTableData(palette);
  const colorTableSize = paletteSizeToFlag(palette.length);

  const parts: Uint8Array[] = [];

  // Header
  parts.push(stringToBytes("GIF89a"));

  // Logical Screen Descriptor
  const lsd = new Uint8Array(7);
  lsd[0] = width & 0xff;
  lsd[1] = (width >> 8) & 0xff;
  lsd[2] = height & 0xff;
  lsd[3] = (height >> 8) & 0xff;
  lsd[4] = 0xf0 | colorTableSize; // Global color table, 8 bits per pixel
  lsd[5] = 0; // Background color index
  lsd[6] = 0; // Pixel aspect ratio
  parts.push(lsd);

  // Global Color Table
  parts.push(colorTable);

  // Netscape Application Extension (loop count)
  parts.push(netscapeExt());

  for (const frame of frames) {
    // Graphic Control Extension
    const delay = Math.max(0, Math.min(frame.delay, 65535));
    const gce = new Uint8Array(8);
    gce[0] = 0x21; // Extension introducer
    gce[1] = 0xf9; // Graphic Control Label
    gce[2] = 0x04; // Block size
    gce[3] = 0x04; // Disposal method: none, no transparency
    gce[4] = delay & 0xff;
    gce[5] = (delay >> 8) & 0xff;
    gce[6] = 0; // Transparent color index (none)
    gce[7] = 0x00; // Block terminator
    parts.push(gce);

    // Image Descriptor
    const imgDesc = new Uint8Array(10);
    imgDesc[0] = 0x2c; // Image separator
    imgDesc[1] = 0; imgDesc[2] = 0; // Left
    imgDesc[3] = 0; imgDesc[4] = 0; // Top
    imgDesc[5] = width & 0xff;
    imgDesc[6] = (width >> 8) & 0xff;
    imgDesc[7] = height & 0xff;
    imgDesc[8] = 0; // No local color table
    imgDesc[9] = 0;
    parts.push(imgDesc);

    // Image data (LZW compressed)
    const indices = quantizeFrame(frame.data, palette);
    const lzwData = lzwEncode(indices, palette.length);
    parts.push(lzwData);
  }

  // Trailer
  parts.push(new Uint8Array([0x3b]));

  const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const p of parts) {
    result.set(p, offset);
    offset += p.length;
  }

  return new Blob([result], { type: "image/gif" });
}

/**
 * Create a frame from an ImageData with a delay.
 */
export function createFrame(data: ImageData, delayMs: number): GifFrame {
  return { data, delay: Math.round(delayMs / 10) }; // Convert ms to centiseconds
}

/**
 * Render an HTMLImageElement to ImageData at the target dimensions.
 */
export function imageToImageData(
  img: HTMLImageElement,
  width: number,
  height: number,
): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

// ── Internal helpers ──────────────────────────────────────────

function stringToBytes(s: string): Uint8Array {
  const arr = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) arr[i] = s.charCodeAt(i);
  return arr;
}

function paletteSizeToFlag(size: number): number {
  // size is 2^n, flag is n-1
  return Math.log2(size) - 1;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function buildPalette(frame: ImageData): RgbColor[] {
  // Use a fixed 256-color palette (6×6×6 = 216 web-safe + 40 grays)
  const palette: RgbColor[] = [];

  // 6 levels each for R, G, B = 216 colors
  const levels = [0, 51, 102, 153, 204, 255];
  for (const r of levels) {
    for (const g of levels) {
      for (const b of levels) {
        palette.push({ r, g, b });
      }
    }
  }

  // Add 40 gray levels to fill 256
  for (let i = 0; i < 40; i++) {
    const v = Math.round((i / 39) * 255);
    palette.push({ r: v, g: v, b: v });
  }

  return palette.slice(0, 256);
}

function buildColorTableData(palette: RgbColor[]): Uint8Array {
  const size = Math.max(2, roundUpPower2(palette.length));
  const data = new Uint8Array(size * 3);
  for (let i = 0; i < palette.length; i++) {
    data[i * 3] = palette[i].r;
    data[i * 3 + 1] = palette[i].g;
    data[i * 3 + 2] = palette[i].b;
  }
  // Pad remaining entries with black
  return data;
}

function roundUpPower2(n: number): number {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

function quantizeFrame(data: ImageData, palette: RgbColor[]): Uint8Array {
  const pixels = data.data;
  const indices = new Uint8Array(data.width * data.height);
  for (let i = 0; i < indices.length; i++) {
    const r = pixels[i * 4];
    const g = pixels[i * 4 + 1];
    const b = pixels[i * 4 + 2];
    // Find nearest palette color
    let minDist = Infinity;
    let bestIdx = 0;
    for (let j = 0; j < palette.length; j++) {
      const dr = r - palette[j].r;
      const dg = g - palette[j].g;
      const db = b - palette[j].b;
      const dist = dr * dr + dg * dg + db * db;
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }
  return indices;
}

function netscapeExt(): Uint8Array {
  // Netscape 2.0 extension for loop count
  return new Uint8Array([
    0x21, 0xff, 0x0b,
    0x4e, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2e, 0x30, // "NETSCAPE2.0"
    0x03, 0x01, 0x00, 0x00, // Loop count (0 = infinite)
    0x00,
  ]);
}

// ── LZW Encoder (GIF variant) ─────────────────────────────────

function lzwEncode(indices: Uint8Array, colorCount: number): Uint8Array {
  const clearCode = colorCount;
  const endCode = colorCount + 1;
  let codeSize = Math.max(2, Math.ceil(Math.log2(colorCount + 1)));
  if (codeSize < 2) codeSize = 2;

  const output: number[] = [];
  const bitBuf: number[] = [];

  function writeCode(code: number, size: number) {
    for (let i = 0; i < size; i++) {
      bitBuf.push((code >> i) & 1);
    }
  }

  function flushBytes(): number[] {
    const bytes: number[] = [];
    while (bitBuf.length >= 8) {
      let byte = 0;
      for (let i = 0; i < 8; i++) byte |= (bitBuf.shift() ?? 0) << i;
      bytes.push(byte);
    }
    return bytes;
  }

  // Write min code size
  output.push(codeSize);

  const maxTableSize = 1 << 12; // 4096
  const table: Map<string, number> = new Map();

  // Initialize table with single-color entries + clear + end
  for (let i = 0; i < colorCount; i++) {
    table.set(String.fromCharCode(i), i);
  }
  table.set("__clear__", clearCode);
  table.set("__end__", endCode);

  let nextCode = endCode + 1;
  let currentCodeSize = codeSize + 1;

  writeCode(clearCode, currentCodeSize);

  if (indices.length === 0) {
    writeCode(endCode, currentCodeSize);
    return packLzwData(output, flushBytes(), bitBuf);
  }

  let w = String.fromCharCode(indices[0]);

  for (let i = 1; i < indices.length; i++) {
    const k = String.fromCharCode(indices[i]);
    const wk = w + k;

    if (table.has(wk)) {
      w = wk;
    } else {
      writeCode(table.get(w)!, currentCodeSize);
      if (nextCode < maxTableSize) {
        table.set(wk, nextCode++);
        if (nextCode >= (1 << currentCodeSize) && currentCodeSize < 12) {
          currentCodeSize++;
        }
      } else {
        // Table full: emit clear code and reset
        writeCode(clearCode, currentCodeSize);
        table.clear();
        for (let j = 0; j < colorCount; j++) {
          table.set(String.fromCharCode(j), j);
        }
        table.set("__clear__", clearCode);
        table.set("__end__", endCode);
        nextCode = endCode + 1;
        currentCodeSize = codeSize + 1;
      }
      w = k;
    }
  }

  writeCode(table.get(w) ?? clearCode, currentCodeSize);
  writeCode(endCode, currentCodeSize);

  return packLzwData(output, flushBytes(), bitBuf);
}

function packLzwData(
  output: number[],
  bytes: number[],
  remainingBits: number[],
): Uint8Array {
  // Flush remaining bits
  if (remainingBits.length > 0) {
    while (remainingBits.length < 8) remainingBits.push(0);
    let byte = 0;
    for (let i = 0; i < 8; i++) byte |= (remainingBits[i] ?? 0) << i;
    bytes.push(byte);
  }

  // Output min code size
  const minCodeSize = output[0];

  // Pack into sub-blocks (max 255 bytes each)
  const dataBlocks: number[][] = [];
  let block: number[] = [];
  for (const b of bytes) {
    block.push(b);
    if (block.length === 255) {
      dataBlocks.push(block);
      block = [];
    }
  }
  if (block.length > 0 || dataBlocks.length === 0) {
    dataBlocks.push(block);
  }

  const totalSize = 1 + dataBlocks.reduce((s, b) => s + 1 + b.length, 0) + 1;
  const result = new Uint8Array(totalSize);
  result[0] = minCodeSize;
  let pos = 1;
  for (const blk of dataBlocks) {
    result[pos] = blk.length;
    pos++;
    for (const b of blk) {
      result[pos] = b;
      pos++;
    }
  }
  result[pos] = 0; // Block terminator
  return result;
}
