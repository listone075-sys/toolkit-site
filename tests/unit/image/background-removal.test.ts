import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @imgly/background-removal BEFORE any imports
const mockRemoveBackground = vi.fn();
const mockPreload = vi.fn();

vi.mock("@imgly/background-removal", () => ({
  removeBackground: mockRemoveBackground,
  preload: mockPreload,
}));

describe("background-removal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("removeImageBackground", () => {
    it("should call removeBackground with correct default config", async () => {
      const { removeImageBackground } = await import(
        "@/lib/tools/image/background-removal"
      );

      const file = new File(["test-image-data"], "test.png", {
        type: "image/png",
      });
      const expectedBlob = new Blob(["result"], { type: "image/png" });
      mockRemoveBackground.mockResolvedValue(expectedBlob);

      const result = await removeImageBackground(file);

      expect(mockRemoveBackground).toHaveBeenCalledTimes(1);
      expect(mockRemoveBackground).toHaveBeenCalledWith(file, {
        model: "isnet",
        output: {
          format: "image/png",
          quality: 0.8,
        },
        progress: undefined,
      });
      expect(result).toBe(expectedBlob);
    });

    it("should pass custom model, format, and quality", async () => {
      const { removeImageBackground } = await import(
        "@/lib/tools/image/background-removal"
      );

      const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
      const expectedBlob = new Blob(["webp-result"], { type: "image/webp" });
      mockRemoveBackground.mockResolvedValue(expectedBlob);

      const result = await removeImageBackground(file, {
        model: "isnet_quint8",
        format: "image/webp",
        quality: 0.95,
      });

      expect(mockRemoveBackground).toHaveBeenCalledWith(file, {
        model: "isnet_quint8",
        output: {
          format: "image/webp",
          quality: 0.95,
        },
        progress: undefined,
      });
      expect(result).toBe(expectedBlob);
    });

    it("should pass progress callback", async () => {
      const { removeImageBackground } = await import(
        "@/lib/tools/image/background-removal"
      );

      const file = new File(["data"], "img.png", { type: "image/png" });
      const onProgress = vi.fn();
      mockRemoveBackground.mockResolvedValue(new Blob(["ok"]));

      await removeImageBackground(file, { onProgress });

      expect(mockRemoveBackground).toHaveBeenCalledWith(file, {
        model: "isnet",
        output: {
          format: "image/png",
          quality: 0.8,
        },
        progress: onProgress,
      });
    });

    it("should wrap errors with descriptive message", async () => {
      const { removeImageBackground } = await import(
        "@/lib/tools/image/background-removal"
      );

      const file = new File(["bad"], "bad.png", { type: "image/png" });
      mockRemoveBackground.mockRejectedValue(new Error("Model download failed"));

      await expect(removeImageBackground(file)).rejects.toThrow(
        "Background removal failed: Model download failed",
      );
    });

    it("should handle non-Error throws", async () => {
      const { removeImageBackground } = await import(
        "@/lib/tools/image/background-removal"
      );

      const file = new File(["data"], "img.png", { type: "image/png" });
      mockRemoveBackground.mockRejectedValue("string error");

      await expect(removeImageBackground(file)).rejects.toThrow(
        "Background removal failed: Unknown error",
      );
    });
  });

  describe("preloadBgRemovalModel", () => {
    it("should call preload with isnet model", async () => {
      const { preloadBgRemovalModel } = await import(
        "@/lib/tools/image/background-removal"
      );

      mockPreload.mockResolvedValue(undefined);

      await preloadBgRemovalModel();

      expect(mockPreload).toHaveBeenCalledTimes(1);
      expect(mockPreload).toHaveBeenCalledWith({
        model: "isnet",
        progress: undefined,
      });
    });

    it("should pass progress callback to preload", async () => {
      const { preloadBgRemovalModel } = await import(
        "@/lib/tools/image/background-removal"
      );

      const onProgress = vi.fn();
      mockPreload.mockResolvedValue(undefined);

      await preloadBgRemovalModel(onProgress);

      expect(mockPreload).toHaveBeenCalledWith({
        model: "isnet",
        progress: onProgress,
      });
    });
  });
});
