import { describe, it, expect } from "vitest";
import { generateMarkdownTable, parseMarkdownTable } from "@/lib/tools/markdown/table-gen";

describe("generateMarkdownTable", () => {
  it("should generate a valid Markdown table", () => {
    const result = generateMarkdownTable({
      headers: ["Name", "Age"],
      rows: [["Alice", "30"], ["Bob", "25"]],
      alignments: ["left", "center"],
    });

    expect(result).toBe(
      "| Name | Age |\n| :--- | :---: |\n| Alice | 30 |\n| Bob | 25 |",
    );
  });

  it("should escape pipe characters in cells", () => {
    const result = generateMarkdownTable({
      headers: ["Value"],
      rows: [["a | b"]],
      alignments: ["left"],
    });

    expect(result).toContain("a \\| b");
  });

  it("should return empty string for empty headers", () => {
    const result = generateMarkdownTable({
      headers: [],
      rows: [],
      alignments: [],
    });
    expect(result).toBe("");
  });
});

describe("parseMarkdownTable", () => {
  it("should parse a valid table", () => {
    const input = "| Name | Age |\n| :--- | :---: |\n| Alice | 30 |";
    const result = parseMarkdownTable(input);

    expect(result).not.toBeNull();
    expect(result!.headers).toEqual(["Name", "Age"]);
    expect(result!.alignments).toEqual(["left", "center"]);
    expect(result!.rows).toEqual([["Alice", "30"]]);
  });

  it("should return null for invalid input", () => {
    expect(parseMarkdownTable("not a table")).toBeNull();
  });
});
