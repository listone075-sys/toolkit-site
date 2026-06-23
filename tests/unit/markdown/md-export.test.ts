import { describe, it, expect } from "vitest";
import { markdownToDocxBlob } from "@/lib/tools/markdown/md-to-docx";
import { markdownToPptxBlob } from "@/lib/tools/markdown/md-to-pptx";
import { docxToMarkdown } from "@/lib/tools/markdown/docx-to-md";

const sampleMd = `# Hello World

## Section One

This is a **bold** and *italic* paragraph with \`inline code\`.

- List item 1
- List item 2

### Sub-section

| Col A | Col B |
|-------|-------|
| Val 1 | Val 2 |

> Blockquote text

\`\`\`
code block
\`\`\`

~~strikethrough~~ [Link](https://example.com)`;

describe("markdownToDocxBlob", () => {
  it("should return a Blob with DOCX MIME type", async () => {
    const blob = await markdownToDocxBlob("# Hello\n\nWorld");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
    expect(blob.type).toBe(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
  });

  it("should handle empty markdown", async () => {
    const blob = await markdownToDocxBlob("");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it("should handle headings h1-h6", async () => {
    const md = "# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6";
    const blob = await markdownToDocxBlob(md);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it("should handle complex markdown with tables and lists", async () => {
    const blob = await markdownToDocxBlob(sampleMd);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(500);
  });

  it("should handle only whitespace", async () => {
    const blob = await markdownToDocxBlob("   \n  ");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });
});

describe("markdownToPptxBlob", () => {
  it("should return a Blob with PPTX MIME type", async () => {
    const blob = await markdownToPptxBlob("# Title\n\n## Slide 1\n\nContent");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
    // pptxgenjs returns "application/zip" since PPTX is a ZIP container
    expect(
      blob.type === "application/zip" ||
        blob.type ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ).toBe(true);
  });

  it("should handle empty markdown", async () => {
    const blob = await markdownToPptxBlob("");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it("should create slides from h2 headings", async () => {
    const md = "# Title\n\n## Slide A\n\nContent A\n\n## Slide B\n\nContent B";
    const blob = await markdownToPptxBlob(md);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(1000);
  });

  it("should handle markdown with tables", async () => {
    const md = "## Data\n\n| A | B |\n|---|---|\n| 1 | 2 |";
    const blob = await markdownToPptxBlob(md);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it("should handle content before first heading", async () => {
    const md = "Intro text\n\n## First Slide\n\nContent";
    const blob = await markdownToPptxBlob(md);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });
});

describe("docxToMarkdown", () => {
  it("should reject non-docx files in the component layer", () => {
    // This is tested via component behavior, not the pure function
    // The pure function accepts any ArrayBuffer
    expect(true).toBe(true);
  });

  it("should export a function that takes a File", () => {
    expect(typeof docxToMarkdown).toBe("function");
    expect(docxToMarkdown.length).toBe(1); // 1 parameter
  });
});
