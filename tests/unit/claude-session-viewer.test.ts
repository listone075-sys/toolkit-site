import { describe, it, expect } from "vitest";
import { parseLine, parseSession, sessionToMarkdown, sessionToHtml } from "@/lib/tools/dev/claude-session-viewer";

describe("parseLine", () => {
  it("parses a standard Anthropic Messages API user message", () => {
    const line = JSON.stringify({
      role: "user",
      content: [{ type: "text", text: "Hello, Claude!" }],
    });
    const msg = parseLine(line);
    expect(msg).not.toBeNull();
    expect(msg!.role).toBe("user");
    expect(msg!.content).toBe("Hello, Claude!");
  });

  it("parses an assistant message with text", () => {
    const line = JSON.stringify({
      role: "assistant",
      content: [{ type: "text", text: "Hi! How can I help?" }],
    });
    const msg = parseLine(line);
    expect(msg).not.toBeNull();
    expect(msg!.role).toBe("assistant");
    expect(msg!.content).toBe("Hi! How can I help?");
  });

  it("parses a message with tool_use blocks", () => {
    const line = JSON.stringify({
      role: "assistant",
      content: [
        { type: "text", text: "Let me read that file." },
        { type: "tool_use", name: "Read", input: { file_path: "/test.txt" } },
      ],
    });
    const msg = parseLine(line);
    expect(msg).not.toBeNull();
    expect(msg!.role).toBe("assistant");
    expect(msg!.toolName).toBe("Read");
    expect(msg!.content).toContain("Let me read that file.");
    expect(msg!.content).toContain("[Tool: Read]");
  });

  it("parses wrapped format with type and message fields", () => {
    const line = JSON.stringify({
      type: "user",
      message: {
        role: "user",
        content: [{ type: "text", text: "What is 2+2?" }],
      },
    });
    const msg = parseLine(line);
    expect(msg).not.toBeNull();
    expect(msg!.role).toBe("user");
    expect(msg!.content).toBe("What is 2+2?");
  });

  it("extracts timestamp", () => {
    const line = JSON.stringify({
      role: "user",
      content: "test",
      timestamp: "2026-07-09T10:00:00Z",
    });
    const msg = parseLine(line);
    expect(msg).not.toBeNull();
    expect(msg!.timestamp).toBe("2026-07-09T10:00:00Z");
  });

  it("returns null for empty line", () => {
    expect(parseLine("")).toBeNull();
    expect(parseLine("   ")).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    expect(parseLine("not json")).toBeNull();
  });

  it("handles string content (not array)", () => {
    const line = JSON.stringify({
      role: "system",
      content: "System message here",
    });
    const msg = parseLine(line);
    expect(msg).not.toBeNull();
    expect(msg!.role).toBe("system");
    expect(msg!.content).toBe("System message here");
  });
});

describe("parseSession", () => {
  it("parses a multi-message session", () => {
    const jsonl = [
      JSON.stringify({ role: "user", content: [{ type: "text", text: "Hello" }] }),
      JSON.stringify({ role: "assistant", content: [{ type: "text", text: "Hi there!" }] }),
      JSON.stringify({ role: "user", content: [{ type: "text", text: "Help me code" }] }),
      JSON.stringify({
        role: "assistant",
        content: [
          { type: "text", text: "Sure, here's the code:" },
          { type: "tool_use", name: "Write", input: { path: "app.ts", content: "..." } },
        ],
      }),
    ].join("\n");

    const session = parseSession(jsonl);
    expect(session.messages).toHaveLength(4);
    expect(session.stats.userMessages).toBe(2);
    expect(session.stats.assistantMessages).toBe(2);
    expect(session.title).toBe("Hello");
  });

  it("extracts model from metadata", () => {
    const jsonl = [
      JSON.stringify({ model: "claude-sonnet-5", role: "user", content: "test" }),
    ].join("\n");

    const session = parseSession(jsonl);
    expect(session.model).toBe("claude-sonnet-5");
  });

  it("handles empty input", () => {
    const session = parseSession("");
    expect(session.messages).toHaveLength(0);
    expect(session.stats.parsedMessages).toBe(0);
  });
});

describe("sessionToMarkdown", () => {
  it("generates markdown with title and stats", () => {
    const jsonl = [
      JSON.stringify({ role: "user", content: [{ type: "text", text: "Write a function" }] }),
      JSON.stringify({ role: "assistant", content: [{ type: "text", text: "Here you go:" }] }),
    ].join("\n");

    const session = parseSession(jsonl);
    const md = sessionToMarkdown(session);

    expect(md).toContain("# Write a function");
    expect(md).toContain("### 👤 User");
    expect(md).toContain("### 🤖 Assistant");
    expect(md).toContain("2 messages");
  });
});

describe("sessionToHtml", () => {
  it("generates valid HTML", () => {
    const jsonl = [
      JSON.stringify({ role: "user", content: [{ type: "text", text: "Hi" }] }),
    ].join("\n");

    const session = parseSession(jsonl);
    const html = sessionToHtml(session);

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<h1>Hi</h1>");
    expect(html).toContain("role-user");
    expect(html).toContain("Session Summary");
  });
});
