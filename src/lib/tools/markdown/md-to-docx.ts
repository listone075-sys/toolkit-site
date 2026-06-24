import { type Token } from "marked";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ShadingType,
  convertInchesToTwip,
} from "docx";
import { md } from "./md-to-html";

const DEFAULT_FONT = "Calibri";
const CODE_FONT = "Consolas";
const BASE_SIZE = 22; // half-points (11pt)

interface DocxContext {
  paragraphs: Paragraph[];
}

/**
 * Convert a Markdown string to a DOCX Blob.
 * Preserves headings, bold, italic, code, links, tables, lists, and code blocks.
 */
export async function markdownToDocxBlob(markdown: string): Promise<Blob> {
  const tokens = md.lexer(markdown);
  const ctx: DocxContext = { paragraphs: [] };

  for (const token of tokens) {
    switch (token.type) {
      case "heading":
        ctx.paragraphs.push(renderHeading(token));
        break;
      case "paragraph":
        ctx.paragraphs.push(renderParagraph(token));
        break;
      case "list":
        ctx.paragraphs.push(...renderList(token));
        break;
      case "code":
        ctx.paragraphs.push(renderCodeBlock(token));
        break;
      case "table":
        ctx.paragraphs.push(...renderTable(token));
        break;
      case "hr":
        ctx.paragraphs.push(renderHorizontalRule());
        break;
      case "space":
        ctx.paragraphs.push(new Paragraph({ spacing: { after: 200 } }));
        break;
    }
  }

  if (ctx.paragraphs.length === 0) {
    ctx.paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "(Empty document)", italics: true, color: "999999" }),
        ],
      }),
    );
  }

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: DEFAULT_FONT, size: BASE_SIZE } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.2),
              right: convertInchesToTwip(1.2),
            },
          },
        },
        children: ctx.paragraphs,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

// ── Block renderers ──────────────────────────────────────────

const HEADING_LEVELS: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
  5: HeadingLevel.HEADING_5,
  6: HeadingLevel.HEADING_6,
};

function renderHeading(token: Token): Paragraph {
  const h = token as { depth: number; tokens?: Token[] };
  return new Paragraph({
    heading: HEADING_LEVELS[h.depth ?? 1] ?? HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
    children: parseInline(h.tokens ?? []),
  });
}

function renderParagraph(token: Token): Paragraph {
  const p = token as { tokens?: Token[] };
  return new Paragraph({
    spacing: { after: 120 },
    children: parseInline(p.tokens ?? []),
  });
}

function renderCodeBlock(token: Token): Paragraph {
  const c = token as { text: string };
  return new Paragraph({
    spacing: { after: 120 },
    shading: { type: ShadingType.SOLID, fill: "F5F5F5" },
    indent: { left: convertInchesToTwip(0.3) },
    children: [
      new TextRun({ text: c.text, font: CODE_FONT, size: 20 }),
    ],
  });
}

function renderHorizontalRule(): Paragraph {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: {
      bottom: {
        style: "single" as any,
        size: 1,
        color: "CCCCCC",
        space: 4,
      },
    },
    children: [],
  });
}

// ── List renderer ────────────────────────────────────────────

function renderList(token: Token): Paragraph[] {
  const list = token as {
    ordered: boolean;
    items: Array<{ number?: number; tokens?: Token[] }>;
  };
  const result: Paragraph[] = [];
  for (const item of list.items) {
    const prefix = list.ordered ? `${item.number ?? 1}.` : "•";
    result.push(
      new Paragraph({
        spacing: { after: 60 },
        indent: { left: convertInchesToTwip(0.3) },
        children: [
          new TextRun({ text: `${prefix}\t`, font: DEFAULT_FONT, size: BASE_SIZE }),
          ...parseInline(item.tokens ?? []),
        ],
      }),
    );
  }
  return result;
}

// ── Table renderer (text-based, always works) ────────────────

function renderTable(token: Token): Paragraph[] {
  const table = token as {
    header: Array<{ text: string }>;
    rows: Array<Array<{ text: string }>>;
  };
  const lines: string[] = [];
  lines.push("| " + table.header.map((h) => h.text.trim()).join(" | ") + " |");
  lines.push("|" + table.header.map(() => "---").join("|") + "|");
  for (const row of table.rows) {
    lines.push("| " + row.map((r) => r.text.trim()).join(" | ") + " |");
  }
  const text = lines.join("\n");

  return [
    new Paragraph({
      spacing: { before: 120, after: 120 },
      shading: { type: ShadingType.SOLID, fill: "FAFAFA" },
      indent: { left: convertInchesToTwip(0.2) },
      children: [
        new TextRun({ text, font: CODE_FONT, size: 20 }),
      ],
    }),
  ];
}

// ── Inline token parser ──────────────────────────────────────

interface InlineFmt {
  bold?: boolean;
  italics?: boolean;
  strike?: boolean;
  fontFace?: string;
  fontSize?: number;
}

function parseInline(tokens: Token[], fmt?: InlineFmt): TextRun[] {
  const runs: TextRun[] = [];
  const bold = fmt?.bold;
  const italics = fmt?.italics;
  const strike = fmt?.strike;
  const font = fmt?.fontFace ?? DEFAULT_FONT;
  const size = fmt?.fontSize ?? BASE_SIZE;

  for (const t of tokens) {
    switch (t.type) {
      case "text": {
        const tt = t as { text: string };
        runs.push(new TextRun({ text: tt.text, font, size, bold, italics, strike }));
        break;
      }
      case "strong": {
        const st = t as { tokens: Token[] };
        runs.push(...parseInline(st.tokens, { ...fmt, bold: true }));
        break;
      }
      case "em": {
        const et = t as { tokens: Token[] };
        runs.push(...parseInline(et.tokens, { ...fmt, italics: true }));
        break;
      }
      case "codespan": {
        const cs = t as { text: string };
        runs.push(
          new TextRun({
            text: cs.text,
            font: CODE_FONT,
            size: 20,
            shading: { type: ShadingType.SOLID, fill: "EEEEEE" },
          }),
        );
        break;
      }
      case "link": {
        const lk = t as { text?: string; href: string };
        runs.push(
          new TextRun({
            text: lk.text || lk.href,
            style: "Hyperlink",
            color: "0563C1",
            underline: {},
          }),
        );
        break;
      }
      case "image": {
        const img = t as { href: string };
        runs.push(
          new TextRun({
            text: `[Image: ${img.href}]`,
            italics: true,
            color: "999999",
            font,
            size,
          }),
        );
        break;
      }
      case "del": {
        const dl = t as { tokens: Token[] };
        runs.push(...parseInline(dl.tokens, { ...fmt, strike: true }));
        break;
      }
      case "br":
        runs.push(new TextRun({ break: 1 }));
        break;
      default:
        if ("tokens" in t && Array.isArray(t.tokens)) {
          runs.push(...parseInline(t.tokens as Token[], fmt));
        }
        break;
    }
  }
  return runs;
}
