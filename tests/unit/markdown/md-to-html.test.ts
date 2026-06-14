import { describe, it, expect } from "vitest";
import { markdownToHtml, markdownToHtmlDocument } from "@/lib/tools/markdown/md-to-html";

describe("markdownToHtml", () => {
  it("should convert basic Markdown to HTML", () => {
    const result = markdownToHtml("# Hello\n\nThis is **bold** text.");
    expect(result).toContain("<h1>Hello</h1>");
    expect(result).toContain("<strong>bold</strong>");
  });

  it("should convert GFM tables", () => {
    const md = "| A | B |\n|---|---|\n| 1 | 2 |";
    const result = markdownToHtml(md);
    expect(result).toContain("<table>");
    expect(result).toContain("<td>1</td>");
  });

  it("should handle code blocks", () => {
    const md = '```js\nconst x = 1;\n```';
    const result = markdownToHtml(md);
    expect(result).toContain("<code");
    expect(result).toContain("const x = 1");
  });

  it("should return empty string for empty input", () => {
    expect(markdownToHtml("")).toBe("");
    expect(markdownToHtml("   ")).toBe("");
  });

  it("should convert task lists", () => {
    const md = "- [x] Done\n- [ ] Todo";
    const result = markdownToHtml(md);
    expect(result).toContain("checked");
  });
});

describe("markdownToHtmlDocument", () => {
  it("should generate a full HTML document", () => {
    const result = markdownToHtmlDocument("# Test");
    expect(result).toContain("<!DOCTYPE html>");
    expect(result).toContain("<h1>Test</h1>");
    expect(result).toContain("</html>");
  });
});
