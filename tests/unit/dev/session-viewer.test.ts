import { describe, it, expect } from "vitest";
import {
  parseSessionFile,
  validateSessionFile,
  exportToMarkdown,
  buildSessionHtml,
  prepareExportData,
} from "@/lib/tools/dev/session-viewer";

// ── Sample JSONL data ────────────────────────────────────────

const sampleUserLine = JSON.stringify({
  role: "user",
  message: {
    role: "user",
    content: [{ type: "text", text: "Hello, can you help me refactor this code?" }],
  },
});

const sampleAssistantLine = JSON.stringify({
  role: "assistant",
  message: {
    role: "assistant",
    content: [
      { type: "text", text: "I'd be happy to help! Let me read the file first." },
      {
        type: "tool_use",
        id: "tool_001",
        name: "Read",
        input: { file_path: "/src/app.ts", limit: 50 },
      },
    ],
  },
});

const sampleToolResultLine = JSON.stringify({
  role: "user",
  message: {
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: "tool_001",
        content: "import React from 'react';\n\nexport default function App() {\n  return <div>Hello</div>;\n}",
      },
    ],
  },
});

const sampleSystemLine = JSON.stringify({
  role: "system",
  message: {
    role: "system",
    content: [{ type: "text", text: "Session started." }],
  },
});

function makeSessionText(...lines: string[]): string {
  return lines.join("\n");
}

// ── validateSessionFile ──────────────────────────────────────

describe("parseSessionFile", () => {
  it("should parse a simple user message", () => {
    const result = parseSessionFile(sampleUserLine);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].role).toBe("user");
    expect(result.messages[0].content).toContain("Hello, can you help me refactor this code?");
    expect(result.summary.totalMessages).toBe(1);
    expect(result.summary.roleCounts.user).toBe(1);
  });

  it("should parse an assistant message with tool calls", () => {
    const result = parseSessionFile(sampleAssistantLine);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].role).toBe("assistant");
    expect(result.messages[0].toolCalls).toHaveLength(1);
    expect(result.messages[0].toolCalls[0].name).toBe("Read");
    expect(result.messages[0].toolCalls[0].id).toBe("tool_001");
    expect(result.summary.totalToolCalls).toBe(1);
    expect(result.summary.uniqueTools).toContain("Read");
  });

  it("should parse a tool result message", () => {
    const result = parseSessionFile(sampleToolResultLine);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].role).toBe("user");
    expect(result.messages[0].toolResults).toHaveLength(1);
    expect(result.messages[0].toolResults[0].toolUseId).toBe("tool_001");
    expect(result.messages[0].toolResults[0].isError).toBe(false);
  });

  it("should parse a multi-message session", () => {
    const text = makeSessionText(
      sampleUserLine,
      sampleAssistantLine,
      sampleToolResultLine,
    );
    const result = parseSessionFile(text);
    expect(result.messages).toHaveLength(3);
    expect(result.summary.totalMessages).toBe(3);
    expect(result.summary.roleCounts.user).toBe(2); // user + tool_result
    expect(result.summary.roleCounts.assistant).toBe(1);
    expect(result.summary.totalToolCalls).toBe(1);
  });

  it("should handle the Claude Code JSONL format with type field", () => {
    const line = JSON.stringify({
      type: "human",
      content: "What is the weather?",
    });
    const result = parseSessionFile(line);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].role).toBe("user");
    expect(result.messages[0].content).toContain("What is the weather?");
  });

  it("should handle AI type messages", () => {
    const line = JSON.stringify({
      type: "ai",
      content: "The weather is sunny.",
    });
    const result = parseSessionFile(line);
    expect(result.messages[0].role).toBe("assistant");
  });

  it("should skip empty lines", () => {
    const text = makeSessionText("", sampleUserLine, "", sampleAssistantLine, "");
    const result = parseSessionFile(text);
    expect(result.messages).toHaveLength(2);
  });

  it("should skip invalid JSON lines", () => {
    const text = makeSessionText(
      "not valid json at all",
      sampleUserLine,
      "{broken",
    );
    const result = parseSessionFile(text);
    expect(result.messages).toHaveLength(1);
  });

  it("should count unique tools correctly", () => {
    const line1 = JSON.stringify({
      role: "assistant",
      message: {
        role: "assistant",
        content: [
          { type: "tool_use", id: "t1", name: "Read", input: { file_path: "/a" } },
          { type: "tool_use", id: "t2", name: "Write", input: { file_path: "/b", content: "x" } },
        ],
      },
    });
    const line2 = JSON.stringify({
      role: "assistant",
      message: {
        role: "assistant",
        content: [
          { type: "tool_use", id: "t3", name: "Read", input: { file_path: "/c" } },
        ],
      },
    });
    const result = parseSessionFile(makeSessionText(line1, line2));
    expect(result.summary.uniqueTools).toEqual(["Read", "Write"]);
    expect(result.summary.totalToolCalls).toBe(3);
  });

  it("should handle a completely empty file", () => {
    const result = parseSessionFile("", "empty.jsonl");
    expect(result.messages).toHaveLength(0);
    expect(result.summary.totalMessages).toBe(0);
  });

  it("should set the fileName in summary", () => {
    const result = parseSessionFile(sampleUserLine, "my-session.jsonl");
    expect(result.summary.fileName).toBe("my-session.jsonl");
  });
});

// ── validateSessionFile ──────────────────────────────────────

describe("validateSessionFile", () => {
  it("should return valid for a proper JSONL file", () => {
    const result = validateSessionFile(sampleUserLine);
    expect(result.valid).toBe(true);
  });

  it("should return invalid for empty input", () => {
    const result = validateSessionFile("");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("empty");
  });

  it("should return invalid for whitespace-only input", () => {
    const result = validateSessionFile("   \n  \n  ");
    expect(result.valid).toBe(false);
  });

  it("should return invalid when no lines are valid JSON", () => {
    const result = validateSessionFile("not json\nstill not json");
    expect(result.valid).toBe(false);
    expect(result.lineCount).toBe(2);
  });
});

// ── exportToMarkdown ─────────────────────────────────────────

describe("exportToMarkdown", () => {
  it("should produce a Markdown string with header info", () => {
    const session = parseSessionFile(sampleUserLine, "test.jsonl");
    const md = exportToMarkdown(session);
    expect(md).toContain("# Claude Code Session: test.jsonl");
    expect(md).toContain("**Messages:** 1");
    expect(md).toContain("🧑 User");
  });

  it("should include tool calls section", () => {
    const session = parseSessionFile(sampleAssistantLine, "test.jsonl");
    const md = exportToMarkdown(session);
    expect(md).toContain("🔧 Tool:");
    expect(md).toContain("Read");
    expect(md).toContain("<details>");
  });

  it("should include tool results section", () => {
    const session = parseSessionFile(sampleToolResultLine, "test.jsonl");
    const md = exportToMarkdown(session);
    expect(md).toContain("✅ Tool Result");
  });
});

// ── buildSessionHtml ─────────────────────────────────────────

describe("buildSessionHtml", () => {
  it("should produce valid HTML with proper structure", () => {
    const session = parseSessionFile(sampleUserLine, "test.jsonl");
    const html = buildSessionHtml(session);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<title>");
    expect(html).toContain("<style>");
    expect(html).toContain("test.jsonl");
    expect(html).toContain("🧑 User");
  });

  it("should escape HTML entities in content", () => {
    const line = JSON.stringify({
      role: "user",
      message: {
        role: "user",
        content: [{ type: "text", text: "Use <div> tags & such" }],
      },
    });
    const session = parseSessionFile(line);
    const html = buildSessionHtml(session);
    expect(html).toContain("&lt;div&gt;");
    expect(html).toContain("&amp;");
  });
});

// ── prepareExportData ────────────────────────────────────────

describe("prepareExportData", () => {
  it("should return markdown, html, and fileName", () => {
    const session = parseSessionFile(sampleUserLine, "my-session.jsonl");
    const data = prepareExportData(session);
    expect(data.markdown).toBeTruthy();
    expect(data.html).toBeTruthy();
    expect(data.fileName).toBe("my-session");
  });

  it("should strip .jsonl extension from fileName", () => {
    const session = parseSessionFile(sampleUserLine, "chat-2026-07-08.jsonl");
    const data = prepareExportData(session);
    expect(data.fileName).toBe("chat-2026-07-08");
  });
});

// ── Edge cases ───────────────────────────────────────────────

describe("edge cases", () => {
  it("should handle content as a plain string (not content blocks)", () => {
    const line = JSON.stringify({
      role: "user",
      content: "plain string content",
    });
    const result = parseSessionFile(line);
    expect(result.messages[0].content).toBe("plain string content");
  });

  it("should handle missing message field", () => {
    const line = JSON.stringify({
      role: "system",
    });
    const result = parseSessionFile(line);
    expect(result.messages[0].role).toBe("system");
    expect(result.messages[0].content).toBe("");
  });

  it("should handle tool result with is_error true", () => {
    const line = JSON.stringify({
      role: "user",
      message: {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: "tool_001",
            content: "Error: file not found",
            is_error: true,
          },
        ],
      },
    });
    const result = parseSessionFile(line);
    expect(result.messages[0].toolResults[0].isError).toBe(true);
  });
});
