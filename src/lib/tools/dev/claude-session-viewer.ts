/**
 * Claude Code Session Viewer — pure functions for parsing .jsonl session files.
 *
 * Claude Code exports session transcripts as JSONL (one JSON object per line).
 * Each line represents a message or event in the conversation.
 *
 * Supported formats:
 * 1. Anthropic Messages API: {"role":"user","content":[{"type":"text","text":"..."}]}
 * 2. Wrapped: {"type":"user","message":{"role":"user","content":[...]}}
 * 3. Claude Code transcript: lines with various metadata fields
 */

import { escapeHtml } from "@/lib/utils/html";

// ── Types ──────────────────────────────────────────────────────

export interface SessionMessage {
  /** Display role: user, assistant, system, or tool */
  role: "user" | "assistant" | "system" | "tool";
  /** Extracted plain text content */
  content: string;
  /** ISO timestamp if available */
  timestamp?: string;
  /** Tool name if this is a tool_use message */
  toolName?: string;
  /** Tool input JSON string if available */
  toolInput?: string;
  /** Tool result content if this is a tool_result */
  toolResult?: string;
}

export interface SessionStats {
  totalLines: number;
  parsedMessages: number;
  userMessages: number;
  assistantMessages: number;
  systemMessages: number;
  toolMessages: number;
  totalChars: number;
  estimatedTokens: number;
}

export interface ParsedSession {
  messages: SessionMessage[];
  stats: SessionStats;
  /** Model identifier if found in the session */
  model?: string;
  /** Session title derived from first user message */
  title?: string;
}

// ── Tool-block serialization (single source of truth) ──────────

/** Serialize a tool_use `input` value to a display string. */
function stringifyToolInput(input: unknown): string {
  return typeof input === "object" && input !== null
    ? JSON.stringify(input, null, 2)
    : String(input ?? "");
}

/**
 * Serialize a tool_result `content` value to a display string.
 * Handles string content, and arrays whose entries may be plain strings
 * or blocks carrying text under `text`/`content` (not just `.text`).
 */
function stringifyToolResult(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((b) => {
        if (typeof b === "string") return b;
        if (b && typeof b === "object") {
          const obj = b as Record<string, unknown>;
          if (typeof obj.text === "string") return obj.text;
          if (typeof obj.content === "string") return obj.content;
        }
        return "";
      })
      .join("\n");
  }
  return content == null ? "" : JSON.stringify(content);
}

// ── Content extraction helpers ─────────────────────────────────

/**
 * Extract plain text from Anthropic content blocks.
 * Handles: text blocks, tool_use blocks, tool_result blocks, and arrays of blocks.
 */
function extractContent(content: unknown): string {
  if (!content) return "";

  // String content (direct text)
  if (typeof content === "string") return content;

  // Array of content blocks (Anthropic format)
  if (Array.isArray(content)) {
    return content
      .map((block) => {
        if (!block || typeof block !== "object") return "";
        if (block.type === "text" && typeof block.text === "string") {
          return block.text;
        }
        if (block.type === "tool_use") {
          const name = block.name ?? "unknown";
          return `[Tool: ${name}]\n${stringifyToolInput(block.input)}`;
        }
        if (block.type === "tool_result") {
          return `[Tool Result]\n${stringifyToolResult(block.content)}`;
        }
        return "";
      })
      .join("\n")
      .trim();
  }

  // Object with a text property
  if (typeof content === "object" && content !== null) {
    const obj = content as Record<string, unknown>;
    if (typeof obj.text === "string") return obj.text;
    // Fallback: stringify the object
    return JSON.stringify(content);
  }

  return String(content);
}

// ── Message parsing ────────────────────────────────────────────

/**
 * Parse an already-decoded JSONL object into a SessionMessage, or null.
 * Kept separate from parseLine so callers that already have the parsed
 * object (e.g. parseSession) don't pay for a second JSON.parse.
 */
function parseObject(obj: Record<string, unknown>): SessionMessage | null {
  if (!obj || typeof obj !== "object") return null;

  // Check if this is a wrapped format: { type: "...", message: { ... } }
  let message: Record<string, unknown> | undefined;
  if (obj.message && typeof obj.message === "object" && !Array.isArray(obj.message)) {
    message = obj.message as Record<string, unknown>;
  } else if (obj.role) {
    // Direct Messages API format
    message = obj;
  }

  if (!message) {
    // Try to extract whatever we can: this might be a bare event
    const type = obj.type as string | undefined;
    if (type === "system" && typeof obj.subtype === "string") {
      return {
        role: "system",
        content: typeof obj.content === "string" ? obj.content : JSON.stringify(obj),
        timestamp: obj.timestamp as string | undefined,
      };
    }
    return null;
  }

  const role = normalizeRole(message.role as string | undefined);
  const content = extractContent(message.content);
  const timestamp =
    (obj.timestamp as string) ??
    (message.timestamp as string) ??
    (obj.created_at as string) ??
    undefined;

  // Detect tool metadata from content blocks
  let toolName: string | undefined;
  let toolInput: string | undefined;
  let toolResult: string | undefined;

  if (Array.isArray(message.content)) {
    for (const block of message.content as Array<Record<string, unknown>>) {
      if (block.type === "tool_use") {
        toolName = block.name as string;
        toolInput = stringifyToolInput(block.input);
      }
      if (block.type === "tool_result") {
        toolResult = stringifyToolResult(block.content);
      }
    }
  }

  // If this is purely tool output, classify as tool role
  const effectiveRole: SessionMessage["role"] =
    obj.type === "tool_result" || obj.tool_result ? "tool" : role;

  return { role: effectiveRole, content, timestamp, toolName, toolInput, toolResult };
}

/**
 * Parse a single JSONL line into a SessionMessage, or null if unparseable.
 */
export function parseLine(raw: string): SessionMessage | null {
  if (!raw.trim()) return null;
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(raw);
  } catch {
    return null;
  }
  return parseObject(obj);
}

function normalizeRole(role?: string): SessionMessage["role"] {
  if (!role) return "system";
  const r = role.toLowerCase();
  if (r === "user" || r === "human") return "user";
  if (r === "assistant" || r === "ai" || r === "model") return "assistant";
  if (r === "tool") return "tool";
  return "system";
}

// ── Session parsing ────────────────────────────────────────────

/**
 * Parse an entire .jsonl session file content into a ParsedSession.
 * Each line is decoded with a single JSON.parse; both model detection and
 * message extraction reuse that one decode.
 */
export function parseSession(content: string): ParsedSession {
  const lines = content.split("\n");
  const messages: SessionMessage[] = [];
  let model: string | undefined;
  let title: string | undefined;

  for (const line of lines) {
    if (!line.trim()) continue;

    let obj: Record<string, unknown>;
    try {
      obj = JSON.parse(line);
    } catch {
      continue;
    }

    // Extract model from metadata (from the same decoded object)
    if (!model) {
      if (typeof obj.model === "string") {
        model = obj.model;
      } else {
        const inner = obj.message as Record<string, unknown> | undefined;
        if (inner && typeof inner.model === "string") model = inner.model;
      }
    }

    const msg = parseObject(obj);
    if (msg) {
      messages.push(msg);
      // Derive title from first user message
      if (!title && msg.role === "user" && msg.content) {
        title = msg.content.slice(0, 80) + (msg.content.length > 80 ? "…" : "");
      }
    }
  }

  const stats = computeStats(messages, lines.length);
  return { messages, stats, model, title };
}

function computeStats(messages: SessionMessage[], totalLines: number): SessionStats {
  let userMessages = 0;
  let assistantMessages = 0;
  let systemMessages = 0;
  let toolMessages = 0;
  let totalChars = 0;

  for (const msg of messages) {
    switch (msg.role) {
      case "user":
        userMessages++;
        break;
      case "assistant":
        assistantMessages++;
        break;
      case "system":
        systemMessages++;
        break;
      case "tool":
        toolMessages++;
        break;
    }
    totalChars += msg.content.length;
  }

  // Rough token estimate: ~4 chars per token for English text
  const estimatedTokens = Math.round(totalChars / 4);

  return {
    totalLines,
    parsedMessages: messages.length,
    userMessages,
    assistantMessages,
    systemMessages,
    toolMessages,
    totalChars,
    estimatedTokens,
  };
}

// ── Fenced-code helpers ────────────────────────────────────────

const TOOL_RESULT_MAX = 5000;

/**
 * Build a code-fence delimiter guaranteed to be longer than any backtick run
 * inside `content`, so embedded ``` sequences can't terminate the block early.
 */
function fenceFor(content: string): string {
  const runs = content.match(/`+/g);
  const longest = runs ? Math.max(...runs.map((r) => r.length)) : 0;
  return "`".repeat(Math.max(3, longest + 1));
}

function truncateResult(result: string, suffix: string): string {
  return result.length > TOOL_RESULT_MAX ? result.slice(0, TOOL_RESULT_MAX) + suffix : result;
}

// ── Export: Markdown ───────────────────────────────────────────

/**
 * Convert a parsed session to a nicely formatted Markdown string.
 */
export function sessionToMarkdown(session: ParsedSession): string {
  const lines: string[] = [];

  // Header
  const title = session.title ?? "Claude Code Session";
  lines.push(`# ${title}`);
  lines.push("");

  if (session.model) {
    lines.push(`**Model:** ${session.model}`);
    lines.push("");
  }

  // Stats summary
  const s = session.stats;
  lines.push(
    `> ${s.parsedMessages} messages · ${s.totalChars.toLocaleString()} chars · ~${s.estimatedTokens.toLocaleString()} tokens`,
  );
  lines.push("");
  lines.push("---");
  lines.push("");

  // Messages
  for (let i = 0; i < session.messages.length; i++) {
    const msg = session.messages[i];

    // Role heading
    const roleLabel = roleDisplayLabel(msg.role);
    const emoji = roleEmoji(msg.role);
    const ts = msg.timestamp ? ` *(${formatTimestamp(msg.timestamp)})*` : "";

    lines.push(`### ${emoji} ${roleLabel}${ts}`);
    lines.push("");

    // Tool info
    if (msg.toolName) {
      lines.push(`**🔧 Tool:** \`${msg.toolName}\``);
      lines.push("");
      if (msg.toolInput) {
        const fence = fenceFor(msg.toolInput);
        lines.push("<details>");
        lines.push("<summary>Tool Input</summary>");
        lines.push("");
        lines.push(`${fence}json`);
        lines.push(msg.toolInput);
        lines.push(fence);
        lines.push("");
        lines.push("</details>");
        lines.push("");
      }
    }

    if (msg.toolResult) {
      const truncated = truncateResult(msg.toolResult, "\n\n*(result truncated)*");
      const fence = fenceFor(truncated);
      lines.push("<details>");
      lines.push("<summary>Tool Result</summary>");
      lines.push("");
      lines.push(fence);
      lines.push(truncated);
      lines.push(fence);
      lines.push("");
      lines.push("</details>");
      lines.push("");
    }

    // Content
    if (msg.content) {
      if (msg.role === "system") {
        lines.push("> " + msg.content.replace(/\n/g, "\n> "));
      } else {
        lines.push(msg.content);
      }
      lines.push("");
    }

    // Add a separator between messages
    if (i < session.messages.length - 1) {
      lines.push("---");
      lines.push("");
    }
  }

  return lines.join("\n");
}

/**
 * Convert a parsed session to a styled HTML page (for PDF print and DOCX source).
 */
export function sessionToHtml(session: ParsedSession): string {
  const title = session.title ?? "Claude Code Session";
  const stats = session.stats;

  const messagesHtml = session.messages
    .map((msg) => {
      const roleClass = `role-${msg.role}`;
      const roleLabel = roleDisplayLabel(msg.role);
      const emoji = roleEmoji(msg.role);
      const ts = msg.timestamp
        ? `<span class="timestamp">${escapeHtml(formatTimestamp(msg.timestamp))}</span>`
        : "";

      const contentEscaped = escapeHtml(msg.content);

      let toolSection = "";
      if (msg.toolName) {
        toolSection += `<div class="tool-info"><strong>🔧 ${escapeHtml(msg.toolName)}</strong></div>`;
        if (msg.toolInput) {
          toolSection += `<details><summary>Tool Input</summary><pre><code>${escapeHtml(msg.toolInput)}</code></pre></details>`;
        }
      }
      if (msg.toolResult) {
        const truncated = truncateResult(msg.toolResult, "\n\n(result truncated)");
        toolSection += `<details><summary>Tool Result</summary><pre><code>${escapeHtml(truncated)}</code></pre></details>`;
      }

      return `
        <div class="message ${roleClass}">
          <div class="message-header">
            <span class="role-badge ${roleClass}">${emoji} ${roleLabel}</span>
            ${ts}
          </div>
          ${toolSection}
          <div class="message-content">${contentEscaped.replace(/\n/g, "<br>")}</div>
        </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 24px;
      color: #1a1a2e;
      background: #fff;
      line-height: 1.7;
    }
    @media print {
      body { padding: 0; }
      .message { break-inside: avoid; }
    }
    h1 { font-size: 1.8rem; margin-bottom: 8px; color: #111; }
    .model { color: #666; font-size: 0.9rem; margin-bottom: 4px; }
    .stats {
      background: #f5f5f5;
      padding: 12px 16px;
      border-radius: 8px;
      margin: 16px 0 24px;
      font-size: 0.85rem;
      color: #555;
    }
    .stats-grid { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 6px; }
    .stat-item { display: flex; align-items: center; gap: 4px; }
    .message {
      margin-bottom: 24px;
      padding: 16px;
      border-left: 4px solid #e0e0e0;
      border-radius: 0 8px 8px 0;
      background: #fafafa;
    }
    .message.role-user { border-left-color: #3b82f6; background: #eff6ff; }
    .message.role-assistant { border-left-color: #10b981; background: #ecfdf5; }
    .message.role-system { border-left-color: #f59e0b; background: #fffbeb; font-size: 0.9rem; }
    .message.role-tool { border-left-color: #8b5cf6; background: #f5f3ff; font-size: 0.85rem; }
    .message-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .role-badge {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      padding: 2px 10px;
      border-radius: 12px;
      letter-spacing: 0.5px;
    }
    .role-badge.role-user { background: #3b82f6; color: #fff; }
    .role-badge.role-assistant { background: #10b981; color: #fff; }
    .role-badge.role-system { background: #f59e0b; color: #fff; }
    .role-badge.role-tool { background: #8b5cf6; color: #fff; }
    .timestamp { color: #999; font-size: 0.8rem; }
    .tool-info { margin-bottom: 6px; font-size: 0.85rem; }
    .message-content { white-space: pre-wrap; word-break: break-word; }
    details { margin: 8px 0; }
    details summary { cursor: pointer; color: #666; font-size: 0.85rem; }
    details pre {
      background: #f0f0f0;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 0.8rem;
      margin-top: 6px;
    }
    code { font-family: "SF Mono", Consolas, monospace; font-size: 0.85em; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${session.model ? `<div class="model">Model: ${escapeHtml(session.model)}</div>` : ""}
  <div class="stats">
    <strong>Session Summary</strong>
    <div class="stats-grid">
      <span class="stat-item">💬 ${stats.parsedMessages} messages</span>
      <span class="stat-item">👤 ${stats.userMessages} user</span>
      <span class="stat-item">🤖 ${stats.assistantMessages} assistant</span>
      <span class="stat-item">📝 ${stats.totalChars.toLocaleString()} chars</span>
      <span class="stat-item">🔤 ~${stats.estimatedTokens.toLocaleString()} tokens</span>
    </div>
  </div>
  ${messagesHtml}
</body>
</html>`;
}

// ── Display helpers ────────────────────────────────────────────

const ROLE_META: Record<SessionMessage["role"], { label: string; emoji: string }> = {
  user: { label: "User", emoji: "👤" },
  assistant: { label: "Assistant", emoji: "🤖" },
  system: { label: "System", emoji: "⚙️" },
  tool: { label: "Tool", emoji: "🔧" },
};

export function roleDisplayLabel(role: SessionMessage["role"]): string {
  return ROLE_META[role].label;
}

export function roleEmoji(role: SessionMessage["role"]): string {
  return ROLE_META[role].emoji;
}

/**
 * Format an ISO/date-like timestamp for display, falling back to the raw
 * string when it isn't a valid date (so users never see "Invalid Date").
 */
export function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}
