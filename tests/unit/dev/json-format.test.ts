import { describe, it, expect } from "vitest";
import { formatJson, minifyJson, validateJson } from "@/lib/tools/dev/json-format";

describe("formatJson", () => {
  it("should format compact JSON", () => {
    const result = formatJson('{"name":"Alice","age":30}');
    expect(result).toContain('"name": "Alice"');
    expect(result).toContain("\n");
  });

  it("should throw on invalid JSON", () => {
    expect(() => formatJson("{invalid}")).toThrow("Invalid JSON");
  });
});

describe("minifyJson", () => {
  it("should remove whitespace", () => {
    const input = `{
  "name": "Alice"
}`;
    expect(minifyJson(input)).toBe('{"name":"Alice"}');
  });
});

describe("validateJson", () => {
  it("should return valid for good JSON", () => {
    expect(validateJson('{"a":1}').valid).toBe(true);
  });

  it("should return invalid for bad JSON", () => {
    const result = validateJson("{bad}");
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
