import { describe, it, expect } from "vitest";

// Unit tests for image compression utilities
// Full compressImage() requires a browser canvas, so we test the helpers

describe("image compress (unit)", () => {
  it("formatFileSize should work", async () => {
    const { formatFileSize } = await import("@/lib/utils/file");
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(1024)).toBe("1.0 KB");
    expect(formatFileSize(1048576)).toBe("1.0 MB");
  });

  it("getOutputFileName should produce correct names", async () => {
    const { getOutputFileName } = await import("@/lib/tools/image/convert");
    expect(getOutputFileName("photo.heic", "jpg")).toBe("photo.jpg");
    expect(getOutputFileName("image.webp", "png")).toBe("image.png");
    expect(getOutputFileName("noext", "jpg")).toBe("noext.jpg");
  });
});
