import { type Token } from "marked";
import PptxGenJS from "pptxgenjs";
import { md } from "./md-to-html";

interface SlideGroup {
  title: string;
  bodyLines: string[];
}

/**
 * Convert a Markdown string to a PPTX Blob.
 * Each H2 heading creates a new slide; H1 becomes the title slide.
 * Content between headings becomes the slide body.
 */
export async function markdownToPptxBlob(markdown: string): Promise<Blob> {
  const tokens = md.lexer(markdown);
  const groups = splitIntoSlides(tokens);

  if (groups.length === 0) {
    groups.push({ title: "Presentation", bodyLines: ["(No content)"] });
  }

  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "ToolCraft";
  pres.title = groups[0]?.title || "Presentation";

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const slide = pres.addSlide();

    slide.addText(group.title, {
      x: 0.5,
      y: 0.4,
      w: "90%",
      h: 0.8,
      fontSize: i === 0 ? 36 : 28,
      bold: true,
      color: "1F2937",
      fontFace: "Calibri",
    });

    if (group.bodyLines.length > 0) {
      const bodyText = group.bodyLines.join("\n");
      slide.addText(bodyText, {
        x: 0.5,
        y: 1.5,
        w: "90%",
        h: 5.0,
        fontSize: 16,
        color: "374151",
        fontFace: "Calibri",
        lineSpacing: 28,
        valign: "top",
      });
    }

    if (groups.length > 1) {
      slide.addText(`${i + 1} / ${groups.length}`, {
        x: 0,
        y: "94%",
        w: "100%",
        h: 0.4,
        fontSize: 10,
        color: "9CA3AF",
        align: "center",
      });
    }
  }

  const result = (await pres.write({ outputType: "blob" })) as Blob;
  return result;
}

// ── Slide splitting logic ────────────────────────────────────

function splitIntoSlides(tokens: Token[]): SlideGroup[] {
  const groups: SlideGroup[] = [];
  let current: SlideGroup | null = null;

  for (const token of tokens) {
    if (token.type === "heading" && token.depth <= 2) {
      if (current) groups.push(current);
      const headingText = extractPlainText(token);
      current = { title: headingText, bodyLines: [] };
    } else if (current) {
      const line = tokenToPlainText(token);
      if (line.trim()) {
        current.bodyLines.push(line);
      }
    } else {
      const line = tokenToPlainText(token);
      if (line.trim()) {
        current = { title: "Presentation", bodyLines: [line] };
      }
    }
  }

  if (current) groups.push(current);
  return groups;
}

// ── Token to plain text converters ───────────────────────────

function extractPlainText(token: Token): string {
  if ("tokens" in token && Array.isArray(token.tokens)) {
    return token.tokens
      .map((t: Token) => ("text" in t ? (t as unknown as { text: string }).text : ""))
      .join("");
  }
  if ("text" in token) return (token as unknown as { text: string }).text;
  return "";
}

function tokenToPlainText(token: Token): string {
  switch (token.type) {
    case "paragraph":
      return extractPlainText(token);
    case "code":
      return (token as unknown as { text: string }).text
        .split("\n")
        .map((l: string) => `  ${l}`)
        .join("\n");
    case "list": {
      const listToken = token as unknown as {
        ordered: boolean;
        items: Array<{ number?: number; tokens?: Token[] }>;
      };
      const lines: string[] = [];
      for (const item of listToken.items) {
        const prefix = listToken.ordered ? `${item.number ?? 1}.` : "•";
        const itemText = item.tokens ? extractPlainTextFromTokens(item.tokens) : "";
        lines.push(`${prefix} ${itemText}`);
      }
      return lines.join("\n");
    }
    case "table": {
      const tableToken = token as unknown as {
        header: Array<{ text: string }>;
        rows: Array<Array<{ text: string }>>;
      };
      const lines: string[] = [];
      lines.push("| " + tableToken.header.map((h) => h.text.trim()).join(" | ") + " |");
      for (const row of tableToken.rows) {
        lines.push("| " + row.map((r) => r.text.trim()).join(" | ") + " |");
      }
      return lines.join("\n");
    }
    case "hr":
      return "─".repeat(30);
    case "heading":
      return extractPlainText(token);
    case "blockquote":
      return `> ${extractPlainText(token)}`;
    case "space":
      return "";
    default:
      return extractPlainText(token);
  }
}

function extractPlainTextFromTokens(tokens: Token[]): string {
  return tokens.map((t) => ("text" in t ? (t as unknown as { text: string }).text : "")).join("");
}
