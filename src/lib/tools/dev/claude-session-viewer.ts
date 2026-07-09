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
  /** Original raw JSON for debugging */
  raw?: string;
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
          const input =
            typeof block.input === "object"
              ? JSON.stringify(block.input, null, 2)
              : String(block.input ?? "");
          return `[Tool: ${name}]\n${input}`;
        }
        if (block.type === "tool_result") {
          const resultContent = block.content;
          if (typeof resultContent === "string") {
            return `[Tool Result]\n${resultContent}`;
          }
          if (Array.isArray(resultContent)) {
            return `[Tool Result]\n${resultContent.map((b: any) => b.text ?? "").join("\n")}`;
          }
          return "[Tool Result]";
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
 * Parse a single JSONL line into a SessionMessage, or null if unparseable.
 */
export function parseLine(raw: string): SessionMessage | null {
  if (!raw.trim()) return null;

  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(raw);
  } catch {
    // Try to recover: some lines may have extra content after JSON
    // or be wrapped differently
    return null;
  }

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
        raw,
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

  // Detect tool messages
  let toolName: string | undefined;
  let toolInput: string | undefined;
  let toolResult: string | undefined;

  if (Array.isArray(message.content)) {
    const blocks = message.content as Array<Record<string, unknown>>;
    for (const block of blocks) {
      if (block.type === "tool_use") {
        toolName = block.name as string;
        toolInput =
          typeof block.input === "object"
            ? JSON.stringify(block.input, null, 2)
            : String(block.input ?? "");
        // A tool_use in content makes this a tool-calling assistant message
        if (role === "assistant") {
          // Keep as assistant — the tool call is embedded in content
        }
      }
      if (block.type === "tool_result") {
        const rc = block.content;
        toolResult =
          typeof rc === "string"
            ? rc
            : Array.isArray(rc)
              ? rc.map((b: any) => b.text ?? "").join("\n")
              : JSON.stringify(rc);
      }
    }
  }

  // If this is purely tool output, classify as tool role
  const effectiveRole: SessionMessage["role"] =
    obj.type === "tool_result" || obj.tool_result ? "tool" : role;

  return {
    role: effectiveRole,
    content,
    timestamp,
    toolName,
    toolInput,
    toolResult,
    raw,
  };
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
 */
export function parseSession(content: string): ParsedSession {
  const lines = content.split("\n");
  const messages: SessionMessage[] = [];
  let model: string | undefined;
  let title: string | undefined;

  for (const line of lines) {
    // Try to extract model from metadata lines
    if (!model) {
      try {
        const obj = JSON.parse(line);
        if (obj.model && typeof obj.model === "string") {
          model = obj.model;
        }
        // Also check inside message
        if (!model && obj.message?.model && typeof obj.message.model === "string") {
          model = obj.message.model;
        }
      } catch {
        // ignore
      }
    }

    const msg = parseLine(line);
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
  lines.push(`> ${s.parsedMessages} messages · ${s.totalChars.toLocaleString()} chars · ~${s.estimatedTokens.toLocaleString()} tokens`);
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
        lines.push("<details>");
        lines.push("<summary>Tool Input</summary>");
        lines.push("");
        lines.push("```json");
        lines.push(msg.toolInput);
        lines.push("```");
        lines.push("");
        lines.push("</details>");
        lines.push("");
      }
    }

    if (msg.toolResult) {
      lines.push("<details>");
      lines.push("<summary>Tool Result</summary>");
      lines.push("");
      // Truncate very long tool results in export
      const truncated =
        msg.toolResult.length > 5000
          ? msg.toolResult.slice(0, 5000) + "\n\n*(result truncated)*"
          : msg.toolResult;
      lines.push("```");
      lines.push(truncated);
      lines.push("```");
      lines.push("");
      lines.push("</details>");
      lines.push("");
    }

    // Content
    if (msg.content) {
      // For system messages, wrap in blockquote
      if (msg.role === "system") {
        lines.push("> " + msg.content.replace(/\n/g, "\n> "));
      } else if (msg.content.length > 500) {
        // Long messages: use code fence for readability
        lines.push(msg.content);
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
        ? `<span class="timestamp">${formatTimestamp(msg.timestamp)}</span>`
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
        const truncated =
          msg.toolResult.length > 5000
            ? msg.toolResult.slice(0, 5000) + "\n\n(result truncated)"
            : msg.toolResult;
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

export function roleDisplayLabel(role: SessionMessage["role"]): string {
  switch (role) {
    case "user":
      return "User";
    case "assistant":
      return "Assistant";
    case "system":
      return "System";
    case "tool":
      return "Tool";
  }
}

export function roleEmoji(role: SessionMessage["role"]): string {
  switch (role) {
    case "user":
      return "👤";
    case "assistant":
      return "🤖";
    case "system":
      return "⚙️";
    case "tool":
      return "🔧";
  }
}

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return d.toLocaleString();
  } catch {
    return ts;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
