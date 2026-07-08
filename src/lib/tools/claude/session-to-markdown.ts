/**
 * Render a {@link ParsedSession} to clean Markdown.
 *
 * This is the single intermediate format for every export path: the DOCX and
 * PDF exporters simply run this Markdown through the existing
 * `markdownToDocxBlob` / `markdownToPdfBlob` pipelines, so no new heavy
 * dependency is needed for multi-format export.
 *
 * Pure — no DOM dependency.
 */
import type { ContentBlock, ParsedSession, SessionMessage } from "./parse-session";

export interface MarkdownOptions {
  /** Include assistant `thinking` blocks (default: false) */
  includeThinking?: boolean;
  /** Include tool calls and their results (default: true) */
  includeToolCalls?: boolean;
  /** Include the metadata header block (default: true) */
  includeHeader?: boolean;
  /** Include `isMeta` caveat/injected lines (default: false) */
  includeMeta?: boolean;
}

const ROLE_LABEL: Record<SessionMessage["role"], string> = {
  user: "👤 User",
  assistant: "🤖 Assistant",
  system: "⚙️ System",
};

/** Fence a value as a code block, picking a fence long enough to be safe. */
function fence(body: string, lang = ""): string {
  const longest = (body.match(/`+/g) ?? []).reduce((m, s) => Math.max(m, s.length), 0);
  const bar = "`".repeat(Math.max(3, longest + 1));
  return `${bar}${lang}\n${body.replace(/\n$/, "")}\n${bar}`;
}

/** Pretty-print a tool_use input (object → JSON, string → as-is). */
function formatToolInput(input: unknown): string {
  if (input == null) return "";
  if (typeof input === "string") return input;
  try {
    return JSON.stringify(input, null, 2);
  } catch {
    return String(input);
  }
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

function renderBlock(block: ContentBlock, opts: Required<MarkdownOptions>): string | null {
  switch (block.kind) {
    case "text":
      return block.text.trim();
    case "thinking":
      if (!opts.includeThinking) return null;
      return `> 💭 **Thinking**\n>\n${block.text
        .trim()
        .split("\n")
        .map((l) => `> ${l}`)
        .join("\n")}`;
    case "tool_use": {
      if (!opts.includeToolCalls) return null;
      const input = formatToolInput(block.input);
      const body = input ? `\n\n${fence(input, "json")}` : "";
      return `**🔧 Tool call: \`${block.name}\`**${body}`;
    }
    case "tool_result": {
      if (!opts.includeToolCalls) return null;
      const label = block.isError ? "⚠️ Tool result (error)" : "✅ Tool result";
      const trimmed = block.content.trim();
      const body = trimmed ? `\n\n${fence(trimmed)}` : " _(empty)_";
      return `**${label}**${body}`;
    }
  }
}

function renderMessage(msg: SessionMessage, opts: Required<MarkdownOptions>): string | null {
  const parts: string[] = [];
  for (const block of msg.blocks) {
    const rendered = renderBlock(block, opts);
    if (rendered) parts.push(rendered);
  }
  if (parts.length === 0) return null;

  const meta: string[] = [];
  if (msg.role === "assistant" && msg.model) meta.push(`\`${msg.model}\``);
  if (msg.timestamp) meta.push(formatDate(msg.timestamp));
  const suffix = meta.length ? `  \n<sub>${meta.join(" · ")}</sub>` : "";

  return `## ${ROLE_LABEL[msg.role]}${suffix}\n\n${parts.join("\n\n")}`;
}

function renderHeader(session: ParsedSession): string {
  const lines: string[] = [];
  lines.push(`# ${session.title ?? "Claude Code Session"}`);
  lines.push("");

  const rows: Array<[string, string | undefined]> = [
    ["Project", session.cwd],
    ["Branch", session.gitBranch],
    ["Model", session.models.join(", ") || undefined],
    ["Started", formatDate(session.startTime) || undefined],
    ["Messages", String(session.messageCount)],
    ["Tool calls", String(session.toolUseCount)],
    ["Tokens", session.tokens.input || session.tokens.output
      ? `${session.tokens.input.toLocaleString()} in / ${session.tokens.output.toLocaleString()} out`
      : undefined],
    ["Session", session.sessionId],
    ["Version", session.version],
  ];
  for (const [key, value] of rows) {
    if (value) lines.push(`- **${key}:** ${value}`);
  }
  lines.push("");
  lines.push("---");
  return lines.join("\n");
}

/**
 * Convert a parsed session to a Markdown document string.
 */
export function sessionToMarkdown(session: ParsedSession, options: MarkdownOptions = {}): string {
  const opts: Required<MarkdownOptions> = {
    includeThinking: options.includeThinking ?? false,
    includeToolCalls: options.includeToolCalls ?? true,
    includeHeader: options.includeHeader ?? true,
    includeMeta: options.includeMeta ?? false,
  };

  const sections: string[] = [];
  if (opts.includeHeader) sections.push(renderHeader(session));

  for (const msg of session.messages) {
    if (msg.isMeta && !opts.includeMeta) continue;
    const rendered = renderMessage(msg, opts);
    if (rendered) sections.push(rendered);
  }

  return sections.join("\n\n") + "\n";
}
