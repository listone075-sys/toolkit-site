/**
 * Parser for Claude Code session transcripts (.jsonl).
 *
 * A Claude Code session file is JSON Lines: one JSON object per line, each an
 * event in the conversation stream. This module turns that raw stream into a
 * structured {@link ParsedSession} that the viewer and exporters can consume.
 *
 * Pure — zero UI / DOM dependency, fully testable in Node.js.
 */

export type MessageRole = "user" | "assistant" | "system";

export type ContentBlock =
  | { kind: "text"; text: string }
  | { kind: "thinking"; text: string }
  | { kind: "tool_use"; id: string; name: string; input: unknown }
  | { kind: "tool_result"; toolUseId: string; content: string; isError: boolean };

export interface SessionMessage {
  /** Stable id from the source line (falls back to a synthetic index-based id) */
  uuid: string;
  role: MessageRole;
  /** ISO timestamp, when present on the source line */
  timestamp?: string;
  /** Model id for assistant messages, e.g. "claude-opus-4-8" */
  model?: string;
  /** Ordered content blocks */
  blocks: ContentBlock[];
  /** True for injected/caveat/meta lines that aren't real conversation */
  isMeta: boolean;
  /** True for sub-agent (sidechain) messages */
  isSidechain: boolean;
}

export interface TokenTotals {
  input: number;
  output: number;
}

export interface ParsedSession {
  sessionId?: string;
  /** Human title, when the file carries an `ai-title` event */
  title?: string;
  /** Working directory the session ran in */
  cwd?: string;
  gitBranch?: string;
  /** Claude Code version string */
  version?: string;
  /** Distinct assistant models seen, in first-seen order */
  models: string[];
  startTime?: string;
  endTime?: string;
  messages: SessionMessage[];
  /** Count of real (non-meta) conversation turns */
  messageCount: number;
  /** Count of tool_use blocks across the session */
  toolUseCount: number;
  /** Aggregate token usage, when the file reports it */
  tokens: TokenTotals;
  /** Lines that failed to JSON.parse (corruption / truncation) */
  skippedLines: number;
}

/** A minimal shape of the raw JSONL line — everything is optional & untrusted. */
interface RawLine {
  type?: string;
  uuid?: string;
  timestamp?: string;
  sessionId?: string;
  cwd?: string;
  gitBranch?: string;
  version?: string;
  isMeta?: boolean;
  isSidechain?: boolean;
  title?: string;
  aiTitle?: string;
  message?: {
    role?: string;
    model?: string;
    content?: unknown;
    usage?: { input_tokens?: number; output_tokens?: number };
  };
}

const MESSAGE_ROLES = new Set<MessageRole>(["user", "assistant", "system"]);

/**
 * Coerce an arbitrary tool_result `content` field into a display string.
 * It may be a string, or an array of `{ type: "text", text }` blocks.
 */
function stringifyResultContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text: unknown }).text ?? "");
        }
        return "";
      })
      .join("");
  }
  if (content == null) return "";
  return typeof content === "object" ? JSON.stringify(content, null, 2) : String(content);
}

/** Turn a raw message `content` (string | block[]) into typed content blocks. */
function extractBlocks(content: unknown): ContentBlock[] {
  if (typeof content === "string") {
    return content.trim() ? [{ kind: "text", text: content }] : [];
  }
  if (!Array.isArray(content)) return [];

  const blocks: ContentBlock[] = [];
  for (const raw of content) {
    if (!raw || typeof raw !== "object") continue;
    const b = raw as Record<string, unknown>;
    switch (b.type) {
      case "text":
        if (typeof b.text === "string" && b.text.length) {
          blocks.push({ kind: "text", text: b.text });
        }
        break;
      case "thinking":
        if (typeof b.thinking === "string" && b.thinking.length) {
          blocks.push({ kind: "thinking", text: b.thinking });
        }
        break;
      case "tool_use":
        blocks.push({
          kind: "tool_use",
          id: typeof b.id === "string" ? b.id : "",
          name: typeof b.name === "string" ? b.name : "tool",
          input: b.input,
        });
        break;
      case "tool_result":
        blocks.push({
          kind: "tool_result",
          toolUseId: typeof b.tool_use_id === "string" ? b.tool_use_id : "",
          content: stringifyResultContent(b.content),
          isError: b.is_error === true,
        });
        break;
    }
  }
  return blocks;
}

/**
 * Parse a Claude Code `.jsonl` transcript into a structured session.
 *
 * Tolerant by design: malformed lines are skipped (counted in `skippedLines`)
 * rather than aborting the whole parse, because real transcripts can be
 * truncated mid-write.
 */
export function parseSession(jsonl: string): ParsedSession {
  const lines = jsonl.split(/\r?\n/);
  const messages: SessionMessage[] = [];
  const models: string[] = [];
  let skippedLines = 0;
  let toolUseCount = 0;
  let messageCount = 0;
  const tokens: TokenTotals = { input: 0, output: 0 };

  let sessionId: string | undefined;
  let cwd: string | undefined;
  let gitBranch: string | undefined;
  let version: string | undefined;
  let title: string | undefined;
  let startTime: string | undefined;
  let endTime: string | undefined;

  let index = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    index += 1;

    let obj: RawLine;
    try {
      obj = JSON.parse(line) as RawLine;
    } catch {
      skippedLines += 1;
      continue;
    }

    // Harvest session-level metadata from any line that carries it.
    sessionId ??= obj.sessionId;
    cwd ??= obj.cwd;
    gitBranch ??= obj.gitBranch;
    version ??= obj.version;
    if (obj.type === "ai-title") {
      const t = obj.aiTitle ?? obj.title;
      if (typeof t === "string" && t) title = t;
    }

    if (!obj.type || !MESSAGE_ROLES.has(obj.type as MessageRole)) continue;
    const role = obj.type as MessageRole;
    const msg = obj.message;
    if (!msg) continue;

    const blocks = extractBlocks(msg.content);
    if (blocks.length === 0) continue;

    if (obj.timestamp) {
      startTime ??= obj.timestamp;
      endTime = obj.timestamp;
    }

    const model = typeof msg.model === "string" ? msg.model : undefined;
    if (model && !models.includes(model)) models.push(model);

    if (msg.usage) {
      tokens.input += msg.usage.input_tokens ?? 0;
      tokens.output += msg.usage.output_tokens ?? 0;
    }

    for (const block of blocks) {
      if (block.kind === "tool_use") toolUseCount += 1;
    }

    const isMeta = obj.isMeta === true;
    if (!isMeta) messageCount += 1;

    messages.push({
      uuid: obj.uuid ?? `line-${index}`,
      role,
      timestamp: obj.timestamp,
      model,
      blocks,
      isMeta,
      isSidechain: obj.isSidechain === true,
    });
  }

  return {
    sessionId,
    title,
    cwd,
    gitBranch,
    version,
    models,
    startTime,
    endTime,
    messages,
    messageCount,
    toolUseCount,
    tokens,
    skippedLines,
  };
}
