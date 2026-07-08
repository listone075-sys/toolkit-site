/**
 * Claude Code Session Viewer — JSONL parsing and export utilities.
 *
 * Parses Claude Code .jsonl session files and provides export functions
 * for Markdown, Word (DOCX), and PDF formats.
 *
 * All processing is browser-side — no data leaves the client.
 */

// ── Types ───────────────────────────────────────────────────

export interface ParsedMessage {
  /** Message index (1-based) */
  index: number;
  /** Role: user, assistant, system */
  role: "user" | "assistant" | "system";
  /** Plain-text content (flattened from structured content blocks) */
  content: string;
  /** ISO timestamp if available */
  timestamp?: string;
  /** Tool calls made in this message (assistant only) */
  toolCalls: ParsedToolCall[];
  /** Tool results in this message (user role with tool_result) */
  toolResults: ParsedToolResult[];
  /** Raw line data for debugging */
  raw: Record<string, unknown>;
}

export interface ParsedToolCall {
  /** Tool name (e.g. "Bash", "Read", "Write") */
  name: string;
  /** Tool input arguments as a formatted JSON string */
  input: string;
  /** Tool call ID */
  id: string;
}

export interface ParsedToolResult {
  /** The tool_use_id this result corresponds to */
  toolUseId: string;
  /** Result content as text */
  content: string;
  /** Whether the tool call was successful */
  isError: boolean;
}

export interface SessionSummary {
  /** Total number of parsed messages */
  totalMessages: number;
  /** Count by role */
  roleCounts: { user: number; assistant: number; system: number };
  /** Total tool calls */
  totalToolCalls: number;
  /** Unique tools used */
  uniqueTools: string[];
  /** Session duration (first to last timestamp) */
  duration?: string;
  /** File name */
  fileName: string;
}

export interface ParsedSession {
  messages: ParsedMessage[];
  summary: SessionSummary;
}

// ── Content block types (Anthropic API format) ───────────────

interface ContentBlockText {
  type: "text";
  text: string;
}

interface ContentBlockToolUse {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

interface ContentBlockToolResult {
  type: "tool_result";
  tool_use_id: string;
  content?: string | Array<{ type: "text"; text: string }>;
  is_error?: boolean;
}

type ContentBlock =
  | ContentBlockText
  | ContentBlockToolUse
  | ContentBlockToolResult
  | { type: string; [key: string]: unknown };

// ── Raw JSONL line shape ────────────────────────────────────

interface JsonlLine {
  type?: string;
  role?: string;
  message?: {
    role?: string;
    content?: string | ContentBlock[];
  };
  content?: string | ContentBlock[];
  timestamp?: string;
  created_at?: string;
  [key: string]: unknown;
}

// ── Parsing ──────────────────────────────────────────────────

/**
 * Try to parse a single JSONL line. Returns null if the line is empty
 * or not valid JSON.
 */
function tryParseLine(line: string): JsonlLine | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as JsonlLine;
  } catch {
    return null;
  }
}

/**
 * Determine the effective role from a JSONL line.
 */
function extractRole(line: JsonlLine): "user" | "assistant" | "system" {
  // Check explicit role field
  const role = line.role ?? line.message?.role;
  if (role === "user" || role === "assistant" || role === "system") {
    return role;
  }

  // Infer from type
  const type = line.type;
  if (type === "human" || type === "user") return "user";
  if (type === "ai" || type === "assistant") return "assistant";
  if (type === "system") return "system";

  // Tool results are treated as user messages (the system provides them)
  if (type === "tool_result") return "user";

  return "system";
}

/**
 * Flatten structured content blocks into a single plain-text string.
 */
function flattenContent(content: string | ContentBlock[] | undefined): string {
  if (!content) return "";
  if (typeof content === "string") return content;

  return content
    .map((block) => {
      if (block.type === "text" && "text" in block) {
        return block.text;
      }
      if (block.type === "tool_use") {
        const tu = block as ContentBlockToolUse;
        return `[Tool Call: ${tu.name}(${JSON.stringify(tu.input)})]`;
      }
      if (block.type === "tool_result") {
        const tr = block as ContentBlockToolResult;
        const resultText =
          typeof tr.content === "string"
            ? tr.content
            : tr.content?.map((c) => c.text).join("\n") ?? "";
        const preview =
          resultText.length > 500 ? resultText.slice(0, 500) + "…" : resultText;
        return `[Tool Result${tr.is_error ? " (ERROR)" : ""}]: ${preview}`;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

/**
 * Extract tool calls from structured content blocks.
 */
function extractToolCalls(
  content: string | ContentBlock[] | undefined,
): ParsedToolCall[] {
  if (!content || typeof content === "string") return [];

  return content
    .filter((block): block is ContentBlockToolUse => block.type === "tool_use")
    .map((block) => ({
      name: block.name,
      input: JSON.stringify(block.input, null, 2),
      id: block.id,
    }));
}

/**
 * Extract tool results from structured content blocks.
 */
function extractToolResults(
  content: string | ContentBlock[] | undefined,
): ParsedToolResult[] {
  if (!content || typeof content === "string") return [];

  return content
    .filter(
      (block): block is ContentBlockToolResult =>
        block.type === "tool_result",
    )
    .map((block) => {
      const resultText =
        typeof block.content === "string"
          ? block.content
          : block.content?.map((c) => c.text).join("\n") ?? "";
      return {
        toolUseId: block.tool_use_id ?? "",
        content: resultText,
        isError: block.is_error ?? false,
      };
    });
}

/**
 * Parse a Claude Code .jsonl session file and return structured data.
 *
 * Handles both the standard Anthropic API message format and
 * Claude Code's own JSONL format.
 */
export function parseSessionFile(
  rawText: string,
  fileName = "session.jsonl",
): ParsedSession {
  const lines = rawText.split("\n");
  const messages: ParsedMessage[] = [];

  for (let i = 0; i < lines.length; i++) {
    const parsed = tryParseLine(lines[i]);
    if (!parsed) continue;

    const role = extractRole(parsed);

    // Get content from either message.content or top-level content
    const rawContent =
      parsed.message?.content ?? parsed.content ?? "";

    messages.push({
      index: messages.length + 1,
      role,
      content: flattenContent(
        typeof rawContent === "string" ? rawContent : rawContent as ContentBlock[],
      ),
      timestamp:
        parsed.timestamp ??
        parsed.created_at,
      toolCalls: extractToolCalls(
        typeof rawContent === "string" ? undefined : rawContent as ContentBlock[],
      ),
      toolResults: extractToolResults(
        typeof rawContent === "string" ? undefined : rawContent as ContentBlock[],
      ),
      raw: parsed as Record<string, unknown>,
    });
  }

  // Build summary
  const roleCounts = {
    user: messages.filter((m) => m.role === "user").length,
    assistant: messages.filter((m) => m.role === "assistant").length,
    system: messages.filter((m) => m.role === "system").length,
  };

  const allToolCalls = messages.flatMap((m) => m.toolCalls);
  const uniqueTools = [...new Set(allToolCalls.map((tc) => tc.name))].sort();

  return {
    messages,
    summary: {
      totalMessages: messages.length,
      roleCounts,
      totalToolCalls: allToolCalls.length,
      uniqueTools,
      fileName,
    },
  };
}

/**
 * Validate a JSONL file for basic correctness.
 */
export function validateSessionFile(rawText: string): {
  valid: boolean;
  error?: string;
  lineCount?: number;
} {
  if (!rawText.trim()) {
    return { valid: false, error: "File is empty or contains only whitespace." };
  }

  const lines = rawText.split("\n").filter((l) => l.trim());
  if (lines.length === 0) {
    return { valid: false, error: "No non-empty lines found in file." };
  }

  let parseCount = 0;
  for (const line of lines) {
    const parsed = tryParseLine(line);
    if (parsed) parseCount++;
  }

  if (parseCount === 0) {
    return {
      valid: false,
      error: `File has ${lines.length} line(s) but none are valid JSON. Is this a Claude Code session file?`,
      lineCount: lines.length,
    };
  }

  return { valid: true, lineCount: lines.length };
}

// ── Export: Markdown ─────────────────────────────────────────

/**
 * Export parsed session to a Markdown string.
 */
export function exportToMarkdown(session: ParsedSession): string {
  const lines: string[] = [];

  lines.push(`# Claude Code Session: ${session.summary.fileName}`);
  lines.push("");
  lines.push(
    `**Messages:** ${session.summary.totalMessages} | **Tool Calls:** ${session.summary.totalToolCalls}`,
  );
  if (session.summary.uniqueTools.length > 0) {
    lines.push(`**Tools Used:** ${session.summary.uniqueTools.join(", ")}`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");

  for (const msg of session.messages) {
    const roleLabel =
      msg.role === "user"
        ? "🧑 User"
        : msg.role === "assistant"
          ? "🤖 Assistant"
          : "⚙️ System";

    lines.push(`### ${roleLabel} — Message #${msg.index}`);
    lines.push("");

    if (msg.timestamp) {
      lines.push(`*${msg.timestamp}*`);
      lines.push("");
    }

    if (msg.content) {
      lines.push(msg.content);
      lines.push("");
    }

    // Tool calls detail
    for (const tc of msg.toolCalls) {
      lines.push(`<details>`);
      lines.push(`<summary>🔧 Tool: \`${tc.name}\`</summary>`);
      lines.push("");
      lines.push("```json");
      lines.push(tc.input);
      lines.push("```");
      lines.push("</details>");
      lines.push("");
    }

    // Tool results detail
    for (const tr of msg.toolResults) {
      const label = tr.isError ? "❌ Tool Result (Error)" : "✅ Tool Result";
      lines.push(`<details>`);
      lines.push(`<summary>${label}</summary>`);
      lines.push("");
      lines.push("```");
      lines.push(tr.content.length > 2000 ? tr.content.slice(0, 2000) + "\n…(truncated)" : tr.content);
      lines.push("```");
      lines.push("</details>");
      lines.push("");
    }

    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

// ── Export: HTML ─────────────────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Build a styled HTML document from the parsed session.
 */
export function buildSessionHtml(session: ParsedSession): string {
  const bodyParts: string[] = [];

  bodyParts.push(`<h1>Claude Code Session: ${escapeHtml(session.summary.fileName)}</h1>`);
  bodyParts.push(`<div class="summary">`);
  bodyParts.push(`<p><strong>Messages:</strong> ${session.summary.totalMessages} | <strong>Tool Calls:</strong> ${session.summary.totalToolCalls}</p>`);
  if (session.summary.uniqueTools.length > 0) {
    bodyParts.push(`<p><strong>Tools Used:</strong> ${session.summary.uniqueTools.join(", ")}</p>`);
  }
  bodyParts.push(`</div>`);

  for (const msg of session.messages) {
    const roleClass = msg.role;

    const roleLabel =
      msg.role === "user"
        ? "🧑 User"
        : msg.role === "assistant"
          ? "🤖 Assistant"
          : "⚙️ System";

    bodyParts.push(`<div class="message ${roleClass}">`);
    bodyParts.push(`<h3>${roleLabel} — Message #${msg.index}</h3>`);

    if (msg.timestamp) {
      bodyParts.push(`<p class="timestamp">${escapeHtml(msg.timestamp)}</p>`);
    }

    if (msg.content) {
      bodyParts.push(`<div class="content">${escapeHtml(msg.content).replace(/\n/g, "<br>")}</div>`);
    }

    for (const tc of msg.toolCalls) {
      bodyParts.push(`<details class="tool-call">`);
      bodyParts.push(`<summary>🔧 Tool: <code>${escapeHtml(tc.name)}</code></summary>`);
      bodyParts.push(`<pre><code>${escapeHtml(tc.input)}</code></pre>`);
      bodyParts.push(`</details>`);
    }

    for (const tr of msg.toolResults) {
      const label = tr.isError ? "❌ Tool Result (Error)" : "✅ Tool Result";
      bodyParts.push(`<details class="tool-result">`);
      bodyParts.push(`<summary>${label}</summary>`);
      const preview = tr.content.length > 2000 ? tr.content.slice(0, 2000) + "\n…(truncated)" : tr.content;
      bodyParts.push(`<pre><code>${escapeHtml(preview)}</code></pre>`);
      bodyParts.push(`</details>`);
    }

    bodyParts.push(`</div>`);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Claude Code Session — ${escapeHtml(session.summary.fileName)}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 2rem; color: #1a1a1a; background: #fff; }
  h1 { border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
  .summary { background: #f3f4f6; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
  .message { margin: 1.5rem 0; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; }
  .message.user { border-left: 4px solid #3b82f6; }
  .message.assistant { border-left: 4px solid #10b981; }
  .message.system { border-left: 4px solid #6b7280; }
  .message h3 { margin: 0 0 0.5rem 0; font-size: 1rem; }
  .timestamp { color: #6b7280; font-size: 0.85rem; margin: 0.25rem 0; }
  .content { margin: 0.5rem 0; line-height: 1.6; white-space: pre-wrap; }
  details { margin: 0.5rem 0; }
  details summary { cursor: pointer; color: #4b5563; font-size: 0.9rem; }
  details pre { background: #f9fafb; padding: 0.75rem; border-radius: 4px; overflow-x: auto; font-size: 0.85rem; }
  code { background: #f3f4f6; padding: 0.15rem 0.3rem; border-radius: 3px; font-size: 0.9em; }
  pre code { background: none; padding: 0; }
  @media print { body { padding: 1rem; } .message { break-inside: avoid; } }
</style>
</head>
<body>
${bodyParts.join("\n")}
</body>
</html>`;
}

/**
 * Prepare export data for all formats.
 */
export function prepareExportData(session: ParsedSession): {
  markdown: string;
  html: string;
  fileName: string;
} {
  const md = exportToMarkdown(session);
  const html = buildSessionHtml(session);
  const baseName = session.summary.fileName.replace(/\.jsonl$/i, "");

  return { markdown: md, html, fileName: baseName };
}

/**
 * Return the HTML string ready for PDF conversion.
 */
export function getSessionExportHtml(session: ParsedSession): string {
  return buildSessionHtml(session);
}
