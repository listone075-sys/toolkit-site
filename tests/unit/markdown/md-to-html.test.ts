import { describe, it, expect, vi } from "vitest";
import { markdownToHtml, markdownToHtmlDocument } from "@/lib/tools/markdown/md-to-html";

// ── markdownToHtml ─────────────────────────────────────────────

describe("markdownToHtml", () => {
  // ── Basic conversion ──────────────────────────────────────────

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

  it("should convert nested formatting", () => {
    const result = markdownToHtml("**bold *and italic***");
    expect(result).toContain("<strong>");
    expect(result).toContain("<em>");
  });

  it("should handle blockquotes", () => {
    const result = markdownToHtml("> This is a quote");
    expect(result).toContain("<blockquote>");
  });

  it("should handle links", () => {
    const result = markdownToHtml("[Google](https://google.com)");
    expect(result).toContain('<a href="https://google.com"');
  });

  it("should handle images", () => {
    const result = markdownToHtml("![Alt](image.png)");
    expect(result).toContain('<img');
    expect(result).toContain('alt="Alt"');
  });

  // ── XSS prevention ──────────────────────────────────────────

  it("should escape <script> tags to prevent XSS", () => {
    const result = markdownToHtml('<script>alert("XSS")</script>');
    // The raw script tag must not appear (would be executable)
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("</script>");
    // Angle brackets and quotes must be entity-escaped
    expect(result).toContain("&lt;script&gt;");
    expect(result).toContain("&lt;/script&gt;");
    // Double-quotes in attribute values must be escaped
    expect(result).toContain("&quot;");
    // The alert text itself should be visible as text
    expect(result).toContain("alert");
    expect(result).toContain("XSS");
  });

  it("should escape <img onerror> handlers to prevent XSS", () => {
    const result = markdownToHtml('<img src=x onerror="alert(1)">');
    // The tag delimiters must be escaped so it's not parsed as HTML
    expect(result).not.toContain("<img src=");
    expect(result).toContain("&lt;img");
    // The onerror attribute text remains (it's not an HTML special char),
    // but the browser won't execute it because < and > are escaped
    expect(result).toContain("onerror");
    expect(result).toContain("&quot;");
  });

  it("should escape <iframe> tags", () => {
    const result = markdownToHtml('<iframe src="https://evil.com"></iframe>');
    expect(result).not.toContain("<iframe");
    expect(result).toContain("&lt;iframe");
  });

  it("should escape <style> tags", () => {
    const result = markdownToHtml("<style>body { display: none; }</style>");
    expect(result).not.toContain("<style>");
    expect(result).toContain("&lt;style&gt;");
  });

  it("should escape HTML entities in raw HTML blocks", () => {
    const result = markdownToHtml("<div onclick='alert(1)'>click</div>");
    // Angle brackets must be escaped so the browser won't parse <div> as HTML
    expect(result).toContain("&lt;div");
    expect(result).toContain("&lt;/div&gt;");
    // Single quotes must be escaped
    expect(result).toContain("&#39;");
  });

  // ── Edge cases ─────────────────────────────────────────────

  it("should handle very large input without hanging", () => {
    const lines: string[] = [];
    for (let i = 0; i < 5000; i++) {
      lines.push(`Line ${i}: this is some **bold** text with *italic* styling.`);
    }
    const start = performance.now();
    const result = markdownToHtml(lines.join("\n"));
    const elapsed = performance.now() - start;
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(lines.length * 10);
    expect(elapsed).toBeLessThan(5000); // Should complete well under 5s
  });

  it("should preserve Unicode and emoji", () => {
    const result = markdownToHtml("# 你好世界 🎉\n\nEmoji: 😀 🔥 🚀");
    expect(result).toContain("你好世界");
    expect(result).toContain("🎉");
    expect(result).toContain("😀");
  });

  it("should handle markdown inside HTML-like text (not raw HTML blocks)", () => {
    // Markdown content that contains angle brackets as text
    const result = markdownToHtml("Use `<div>` for block elements in HTML");
    // The inline code should be preserved, angle brackets inside code are markdown
    expect(result).toContain("<code>");
  });

  it("should handle strikethrough (GFM)", () => {
    const result = markdownToHtml("~~deleted text~~");
    expect(result).toContain("<del>");
  });

  it("should handle horizontal rules", () => {
    const result = markdownToHtml("---");
    expect(result).toContain("<hr");
  });

  it("should handle ordered lists", () => {
    const result = markdownToHtml("1. First\n2. Second\n3. Third");
    expect(result).toContain("<ol>");
    expect(result).toContain("<li>");
  });

  it("should handle unordered lists", () => {
    const result = markdownToHtml("- Item A\n- Item B\n- Item C");
    expect(result).toContain("<ul>");
    expect(result).toContain("<li>");
  });

  it("should handle null/undefined input gracefully", () => {
    // These should not throw — our function handles them
    expect(() => markdownToHtml(null as unknown as string)).not.toThrow();
    expect(() => markdownToHtml(undefined as unknown as string)).not.toThrow();
  });

  it("should handle only whitespace input", () => {
    expect(markdownToHtml("\n\n   \t  \n")).toBe("");
  });

  it("should handle only raw HTML (no markdown)", () => {
    const result = markdownToHtml("<div>Just HTML, no markdown</div>");
    // Should be escaped, not rendered as HTML
    expect(result).not.toContain("<div>Just HTML");
    expect(result).toContain("&lt;div&gt;");
    expect(result).toContain("Just HTML, no markdown");
  });
});

// ── markdownToHtmlDocument ──────────────────────────────────────

describe("markdownToHtmlDocument", () => {
  it("should generate a full HTML document", () => {
    const result = markdownToHtmlDocument("# Test");
    expect(result).toContain("<!DOCTYPE html>");
    expect(result).toContain("<h1>Test</h1>");
    expect(result).toContain("</html>");
  });

  it("should include the title in the <title> tag", () => {
    const result = markdownToHtmlDocument("# Content", "My Document");
    expect(result).toContain("<title>My Document</title>");
  });

  it("should HTML-escape the title", () => {
    const result = markdownToHtmlDocument("# Hi", '<script>alert("bad")</script>');
    expect(result).not.toContain("<title><script>");
    expect(result).toContain("&lt;script&gt;");
  });

  it("should include embedded CSS styles", () => {
    const result = markdownToHtmlDocument("# Test");
    expect(result).toContain("<style>");
    expect(result).toContain("max-width: 800px");
  });

  it("should wrap content in <body> tags", () => {
    const result = markdownToHtmlDocument("# Test");
    expect(result).toContain("<body>");
    expect(result).toContain("</body>");
  });

  it("should use default title when not provided", () => {
    const result = markdownToHtmlDocument("# Hi");
    expect(result).toContain("<title>Document</title>");
  });

  it("should escape XSS in the body content too", () => {
    const result = markdownToHtmlDocument('<script>alert(1)</script>', "Safe");
    expect(result).not.toContain("<script>alert");
    expect(result).toContain("&lt;script&gt;");
  });
});
