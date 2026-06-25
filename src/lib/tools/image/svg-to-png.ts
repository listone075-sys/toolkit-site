/**
 * Convert an SVG file or string to a PNG blob via Canvas rendering.
 */
export async function svgToPng(
  input: File | string,
  options?: { width?: number; height?: number; scale?: number },
): Promise<Blob> {
  const scale = options?.scale ?? 2;
  let svgText: string;

  if (typeof input === "string") {
    svgText = input;
  } else {
    svgText = await input.text();
  }

  // Parse SVG to get or set dimensions
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
  const svgEl = svgDoc.documentElement;

  if (svgEl.tagName !== "svg") {
    throw new Error("Invalid SVG: root element is not <svg>");
  }

  // Determine dimensions
  let width = options?.width;
  let height = options?.height;

  if (!width || !height) {
    const viewBox = svgEl.getAttribute("viewBox");
    if (viewBox) {
      const parts = viewBox.split(/[\s,]+/);
      width = width || parseFloat(parts[2]);
      height = height || parseFloat(parts[3]);
    }
    width = width || parseFloat(svgEl.getAttribute("width") || "300");
    height = height || parseFloat(svgEl.getAttribute("height") || "300");
  }

  // Set explicit dimensions on SVG for proper rendering
  svgEl.setAttribute("width", String(width));
  svgEl.setAttribute("height", String(height));

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to render SVG. Check for syntax errors."));
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");

    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, width, height);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        },
        "image/png",
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
