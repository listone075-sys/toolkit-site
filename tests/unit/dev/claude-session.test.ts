import { describe, it, expect } from "vitest";
import { parseSession } from "@/lib/tools/claude/parse-session";
import { sessionToMarkdown } from "@/lib/tools/claude/session-to-markdown";

/** A small but representative Claude Code transcript. */
const sample = [
  { type: "agent-setting", agentSetting: "claude", sessionId: "sess-1" },
  { type: "ai-title", title: "Refactor the auth module" },
  {
    type: "user",
    uuid: "u1",
    timestamp: "2026-07-08T10:00:00.000Z",
    sessionId: "sess-1",
    cwd: "D:\\proj",
    gitBranch: "main",
    version: "2.0.0",
    message: { role: "user", content: "Please refactor auth." },
  },
  {
    type: "assistant",
    uuid: "a1",
    timestamp: "2026-07-08T10:00:05.000Z",
    message: {
      role: "assistant",
      model: "claude-opus-4-8",
      usage: { input_tokens: 100, output_tokens: 40 },
      content: [
        { type: "thinking", thinking: "Let me look at the files." },
        { type: "text", text: "I'll start by reading the file." },
        { type: "tool_use", id: "call-1", name: "Read", input: { file_path: "auth.ts" } },
      ],
    },
  },
  {
    type: "user",
    uuid: "u2",
    timestamp: "2026-07-08T10:00:06.000Z",
    message: {
      role: "user",
      content: [{ type: "tool_result", tool_use_id: "call-1", content: "export function login() {}" }],
    },
  },
  {
    type: "user",
    uuid: "meta1",
    isMeta: true,
    message: { role: "user", content: "<local-command-caveat>ignore me</local-command-caveat>" },
  },
]
  .map((o) => JSON.stringify(o))
  .join("\n");

describe("parseSession", () => {
  it("extracts session metadata", () => {
    const s = parseSession(sample);
    expect(s.sessionId).toBe("sess-1");
    expect(s.title).toBe("Refactor the auth module");
    expect(s.cwd).toBe("D:\\proj");
    expect(s.gitBranch).toBe("main");
    expect(s.version).toBe("2.0.0");
    expect(s.models).toEqual(["claude-opus-4-8"]);
    expect(s.startTime).toBe("2026-07-08T10:00:00.000Z");
    expect(s.endTime).toBe("2026-07-08T10:00:06.000Z");
  });

  it("aggregates tokens and tool-use counts", () => {
    const s = parseSession(sample);
    expect(s.tokens).toEqual({ input: 100, output: 40 });
    expect(s.toolUseCount).toBe(1);
  });

  it("parses content blocks by type", () => {
    const s = parseSession(sample);
    const assistant = s.messages.find((m) => m.uuid === "a1")!;
    expect(assistant.role).toBe("assistant");
    expect(assistant.blocks.map((b) => b.kind)).toEqual(["thinking", "text", "tool_use"]);
    const toolUse = assistant.blocks[2];
    expect(toolUse).toMatchObject({ kind: "tool_use", name: "Read" });

    const result = s.messages.find((m) => m.uuid === "u2")!;
    expect(result.blocks[0]).toMatchObject({
      kind: "tool_result",
      toolUseId: "call-1",
      content: "export function login() {}",
      isError: false,
    });
  });

  it("normalizes string content into a text block", () => {
    const s = parseSession(sample);
    const user = s.messages.find((m) => m.uuid === "u1")!;
    expect(user.blocks).toEqual([{ kind: "text", text: "Please refactor auth." }]);
  });

  it("flags meta lines and excludes them from messageCount", () => {
    const s = parseSession(sample);
    const meta = s.messages.find((m) => m.uuid === "meta1")!;
    expect(meta.isMeta).toBe(true);
    // 3 real turns: user, assistant, tool-result user (meta excluded)
    expect(s.messageCount).toBe(3);
  });

  it("tolerates malformed lines", () => {
    const withGarbage = sample + "\n{not valid json\n\n";
    const s = parseSession(withGarbage);
    expect(s.skippedLines).toBe(1);
    expect(s.messages.length).toBeGreaterThan(0);
  });

  it("handles tool_result content given as block array", () => {
    const line = JSON.stringify({
      type: "user",
      uuid: "u3",
      message: {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: "c2",
            is_error: true,
            content: [{ type: "text", text: "boom" }],
          },
        ],
      },
    });
    const s = parseSession(line);
    expect(s.messages[0].blocks[0]).toMatchObject({
      kind: "tool_result",
      content: "boom",
      isError: true,
    });
  });
});

describe("sessionToMarkdown", () => {
  it("renders a header and the conversation", () => {
    const md = sessionToMarkdown(parseSession(sample));
    expect(md).toContain("# Refactor the auth module");
    expect(md).toContain("**Branch:** main");
    expect(md).toContain("## 👤 User");
    expect(md).toContain("## 🤖 Assistant");
    expect(md).toContain("Please refactor auth.");
  });

  it("excludes thinking by default and includes it on request", () => {
    const parsed = parseSession(sample);
    expect(sessionToMarkdown(parsed)).not.toContain("Let me look at the files.");
    expect(sessionToMarkdown(parsed, { includeThinking: true })).toContain("Let me look at the files.");
  });

  it("can omit tool calls", () => {
    const parsed = parseSession(sample);
    const withTools = sessionToMarkdown(parsed, { includeToolCalls: true });
    const noTools = sessionToMarkdown(parsed, { includeToolCalls: false });
    expect(withTools).toContain("Tool call: `Read`");
    expect(noTools).not.toContain("Tool call: `Read`");
  });

  it("excludes meta lines from output", () => {
    const md = sessionToMarkdown(parseSession(sample));
    expect(md).not.toContain("ignore me");
  });
});
