import { describe, it, expect } from "vitest";
import { generateUuidV4, generateUuids, isValidUuid } from "@/lib/tools/dev/uuid";

describe("generateUuidV4", () => {
  it("should generate a valid UUID v4 string", () => {
    const uuid = generateUuidV4();
    expect(isValidUuid(uuid)).toBe(true);
  });

  it("should generate unique values", () => {
    const a = generateUuidV4();
    const b = generateUuidV4();
    expect(a).not.toBe(b);
  });
});

describe("generateUuids", () => {
  it("should generate the requested number", () => {
    const uuids = generateUuids(5);
    expect(uuids).toHaveLength(5);
    uuids.forEach((u) => expect(isValidUuid(u)).toBe(true));
  });

  it("should respect the cap of 1000", () => {
    const uuids = generateUuids(2000);
    expect(uuids).toHaveLength(1000);
  });

  it("should all be unique", () => {
    const uuids = generateUuids(100);
    const set = new Set(uuids);
    expect(set.size).toBe(100);
  });
});
