import { describe, it, expect } from "vitest";
import { encodeBase64, decodeBase64, isBase64 } from "@/lib/tools/dev/base64";

describe("encodeBase64", () => {
  it("should encode a string to Base64", () => {
    expect(encodeBase64("Hello")).toBe("SGVsbG8=");
  });

  it("should handle empty string", () => {
    expect(encodeBase64("")).toBe("");
  });

  it("should handle UTF-8 characters", () => {
    const encoded = encodeBase64("你好");
    expect(decodeBase64(encoded)).toBe("你好");
  });
});

describe("decodeBase64", () => {
  it("should decode a Base64 string", () => {
    expect(decodeBase64("SGVsbG8=")).toBe("Hello");
  });

  it("should throw on invalid Base64", () => {
    expect(() => decodeBase64("!!!invalid!!!")).toThrow();
  });

  it("should roundtrip correctly", () => {
    const original = "Hello, World! 🌍";
    const encoded = encodeBase64(original);
    const decoded = decodeBase64(encoded);
    expect(decoded).toBe(original);
  });
});

describe("isBase64", () => {
  it("should return true for valid Base64", () => {
    expect(isBase64("SGVsbG8=")).toBe(true);
  });

  it("should return false for non-Base64", () => {
    expect(isBase64("hello world")).toBe(false);
  });
});
