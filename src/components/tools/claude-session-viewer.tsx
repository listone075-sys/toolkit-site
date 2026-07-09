"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { downloadFile } from "@/lib/utils/file";
import { DropTarget } from "./file-upload-zone";
import {
  parseSession,
  sessionToMarkdown,
  sessionToHtml,
  roleDisplayLabel,
  roleEmoji,
  type ParsedSession,
  type SessionMessage,
} from "@/lib/tools/dev/claude-session-viewer";
import {
  Upload,
  FileText,
  Copy,
  Download,
  FileDown,
  FileCode,
  MessageSquare,
  User,
  Bot,
  Wrench,
  Settings,
  Eye,
  Filter,
  X,
  CheckCircle,
  BarChart3,
  Printer,
} from "lucide-react";

type ExportFormat = "markdown" | "html" | "docx" | "pdf";
type RoleFilter = SessionMessage["role"] | "all";

// ── Color palette per role ─────────────────────────────────────

const ROLE_COLORS: Record<SessionMessage["role"], { border: string; bg: string; badge: string; text: string }> = {
  user: { border: "border-blue-400", bg: "bg-blue-50", badge: "bg-blue-500 text-white", text: "text-blue-700" },
  assistant: { border: "border-emerald-400", bg: "bg-emerald-50", badge: "bg-emerald-500 text-white", text: "text-emerald-700" },
  system: { border: "border-amber-400", bg: "bg-amber-50", badge: "bg-amber-500 text-white", text: "text-amber-700" },
  tool: { border: "border-violet-400", bg: "bg-violet-50", badge: "bg-violet-500 text-white", text: "text-violet-700" },
};

const ROLE_FILTERS: { value: RoleFilter; label: string; icon: React.ReactNode; countKey?: string }[] = [
  { value: "all", label: "All", icon: <MessageSquare className="h-3.5 w-3.5" /> },
  { value: "user", label: "User", icon: <User className="h-3.5 w-3.5" /> },
  { value: "assistant", label: "Assistant", icon: <Bot className="h-3.5 w-3.5" /> },
  { value: "system", label: "System", icon: <Settings className="h-3.5 w-3.5" /> },
  { value: "tool", label: "Tool", icon: <Wrench className="h-3.5 w-3.5" /> },
];

// ── Message Card ───────────────────────────────────────────────

function MessageCard({ msg, index }: { msg: SessionMessage; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const colors = ROLE_COLORS[msg.role];
  const hasToolDetails = !!(msg.toolName || msg.toolResult);
  const isLong = msg.content.length > 300;

  return (
    <div className={`border-l-4 ${colors.border} ${colors.bg} rounded-r-lg p-4 transition-all hover:shadow-sm`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${colors.badge}`}>
          {roleEmoji(msg.role)} {roleDisplayLabel(msg.role)}
        </span>
        <span className="text-xs text-zinc-400 font-mono">#{index + 1}</span>
        {msg.timestamp && (
          <span className="text-xs text-zinc-400 ml-auto">
            {new Date(msg.timestamp).toLocaleString()}
          </span>
        )}
        {msg.toolName && (
          <span className="text-xs bg-white border rounded px-2 py-0.5 text-zinc-500 font-mono">
            🔧 {msg.toolName}
          </span>
        )}
      </div>

      {/* Tool details (collapsible) */}
      {hasToolDetails && (
        <div className="mb-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-zinc-500 hover:text-zinc-700 flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            {expanded ? "Hide details" : "Show tool details"}
          </button>
          {expanded && (
            <div className="mt-2 space-y-2">
              {msg.toolInput && (
                <details open className="text-xs">
                  <summary className="cursor-pointer text-zinc-500 font-medium">Tool Input</summary>
                  <pre className="mt-1 p-2 bg-zinc-100 rounded text-xs overflow-x-auto max-h-40">
                    {msg.toolInput}
                  </pre>
                </details>
              )}
              {msg.toolResult && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-zinc-500 font-medium">Tool Result</summary>
                  <pre className="mt-1 p-2 bg-zinc-100 rounded text-xs overflow-x-auto max-h-60 whitespace-pre-wrap">
                    {msg.toolResult.length > 5000
                      ? msg.toolResult.slice(0, 5000) + "\n\n… (result truncated in preview)"
                      : msg.toolResult}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {msg.content ? (
        <div className={`text-sm whitespace-pre-wrap break-words ${isLong ? "" : ""}`}>
          {isLong && !expanded ? (
            <>
              <p>{msg.content.slice(0, 400)}</p>
              {msg.content.length > 400 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-blue-500 hover:text-blue-600 mt-1"
                >
                  Show more ({msg.content.length.toLocaleString()} chars total)
                </button>
              )}
            </>
          ) : (
            <p>{msg.content}</p>
          )}
        </div>
      ) : (
        <p className="text-xs text-zinc-400 italic">(empty content)</p>
      )}
    </div>
  );
}

// ── Stats Bar ──────────────────────────────────────────────────

function StatsBar({ session }: { session: ParsedSession }) {
  const s = session.stats;
  return (
    <div className="flex items-center gap-4 flex-wrap text-xs text-zinc-500 bg-zinc-50 rounded-lg p-3 border">
      <BarChart3 className="h-4 w-4 text-zinc-400" />
      <span className="font-medium text-zinc-700">{s.parsedMessages} messages</span>
      <span className="w-px h-4 bg-zinc-200" />
      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {s.userMessages}</span>
      <span className="flex items-center gap-1"><Bot className="h-3 w-3" /> {s.assistantMessages}</span>
      <span className="flex items-center gap-1"><Settings className="h-3 w-3" /> {s.systemMessages}</span>
      <span className="flex items-center gap-1"><Wrench className="h-3 w-3" /> {s.toolMessages}</span>
      <span className="w-px h-4 bg-zinc-200" />
      <span>{s.totalChars.toLocaleString()} chars</span>
      <span>~{s.estimatedTokens.toLocaleString()} tokens</span>
      {session.model && (
        <>
          <span className="w-px h-4 bg-zinc-200" />
          <span className="font-mono text-zinc-400">{session.model}</span>
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

export function ClaudeSessionViewer() {
  const [session, setSession] = useState<ParsedSession | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RoleFilter>("all");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("markdown");
  const [exporting, setExporting] = useState(false);
  const { copied, copy } = useClipboard();

  // Filtered messages
  const filteredMessages = useMemo(() => {
    if (!session) return [];
    if (filter === "all") return session.messages;
    return session.messages.filter((m) => m.role === filter);
  }, [session, filter]);

  // ── File handling ─────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    setError(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        if (!text.trim()) {
          setError("The file appears to be empty. Please select a valid .jsonl session file.");
          return;
        }
        const parsed = parseSession(text);
        if (parsed.messages.length === 0) {
          setError(
            "No recognizable messages found. Make sure this is a Claude Code .jsonl session file. Each line should be a JSON object with a 'role' or 'message' field."
          );
          return;
        }
        setSession(parsed);
      } catch (e) {
        setError(
          `Failed to parse file: ${(e as Error).message}. Make sure the file is valid JSONL (one JSON object per line).`
        );
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;
      const name = file.name.toLowerCase();
      if (!name.endsWith(".jsonl") && !name.endsWith(".json") && !name.endsWith(".txt")) {
        setError("Please drop a .jsonl or .json file exported from Claude Code.");
        return;
      }
      handleFile(file);
    },
    [handleFile],
  );

  const handleUploadClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jsonl,.json,.txt";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  // ── Export ────────────────────────────────────────────────

  const handleExport = useCallback(async () => {
    if (!session) return;
    setExporting(true);
    try {
      switch (exportFormat) {
        case "markdown": {
          const md = sessionToMarkdown(session);
          downloadFile(md, "claude-session.md", "text/markdown");
          break;
        }
        case "html": {
          const html = sessionToHtml(session);
          downloadFile(html, "claude-session.html", "text/html");
          break;
        }
        case "docx": {
          // Use HTML as intermediate → convert via Blob
          const html = sessionToHtml(session);
          const { markdownToDocxBlob } = await import("@/lib/tools/markdown/md-to-docx");
          // Convert session to markdown first, then to docx
          const md = sessionToMarkdown(session);
          const blob = await markdownToDocxBlob(md);
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "claude-session.docx";
          a.click();
          URL.revokeObjectURL(url);
          break;
        }
        case "pdf": {
          // Open HTML in new window for print-to-PDF
          const html = sessionToHtml(session);
          const w = window.open("", "_blank");
          if (w) {
            w.document.write(html);
            w.document.close();
            w.onload = () => w.print();
          }
          break;
        }
      }
    } catch (e) {
      setError(`Export failed: ${(e as Error).message}`);
    }
    setExporting(false);
  }, [session, exportFormat]);

  const handleCopyMarkdown = useCallback(() => {
    if (!session) return;
    const md = sessionToMarkdown(session);
    copy(md);
  }, [session, copy]);

  // ── Reset ─────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    setSession(null);
    setFileName(null);
    setError(null);
    setFilter("all");
  }, []);

  // ── Render: Empty State ───────────────────────────────────

  if (!session) {
    return (
      <div className="space-y-4">
        <DropTarget onFiles={handleDrop} className="min-h-[350px] flex flex-col">
          <div className="border-2 border-dashed border-zinc-300 rounded-xl flex-1 flex flex-col items-center justify-center p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer" onClick={handleUploadClick}>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-700 mb-2">
              Upload Claude Code Session File
            </h3>
            <p className="text-sm text-zinc-500 max-w-md mb-3">
              Drag &amp; drop your <code className="bg-zinc-100 px-1.5 py-0.3 rounded text-xs">.jsonl</code> session file here,
              or click to browse
            </p>
            <p className="text-xs text-zinc-400 max-w-md">
              Claude Code stores session transcripts as JSONL files. Each line is one message.
              All processing happens in your browser — your data never leaves your device.
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 max-w-md">
                {error}
              </div>
            )}
          </div>
        </DropTarget>

        {/* Sample / guide */}
        <div className="border rounded-lg p-5 bg-zinc-50">
          <h4 className="text-sm font-semibold text-zinc-600 mb-2">Where to find your session files?</h4>
          <ul className="text-xs text-zinc-500 space-y-1 list-disc list-inside">
            <li>Claude Code stores sessions in your project's <code className="bg-zinc-200 px-1 rounded">.claude/sessions/</code> directory</li>
            <li>Or run <code className="bg-zinc-200 px-1 rounded">claude --export-session</code> to export the current session</li>
            <li>You can also drag any JSONL file with Anthropic Messages API format</li>
          </ul>
        </div>
      </div>
    );
  }

  // ── Render: Session Loaded ────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Top bar: file info + reset */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-zinc-400" />
          <span className="font-medium text-zinc-700">{fileName ?? "session.jsonl"}</span>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-xs text-green-600">Parsed successfully</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleUploadClick}>
            <Upload className="h-3.5 w-3.5 mr-1" /> Open Another
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <X className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsBar session={session} />

      {/* Filter + Export toolbar */}
      <div className="flex items-center gap-2 flex-wrap p-3 bg-zinc-50 rounded-lg border">
        {/* Role filters */}
        <div className="flex items-center gap-1">
          <Filter className="h-3.5 w-3.5 text-zinc-400 mr-1" />
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === f.value
                  ? "bg-zinc-800 text-white"
                  : "bg-white border text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Export format selector */}
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
            className="text-xs border rounded-md px-2 py-1.5 bg-white"
          >
            <option value="markdown">Markdown (.md)</option>
            <option value="html">HTML (.html)</option>
            <option value="docx">Word (.docx)</option>
            <option value="pdf">PDF (Print)</option>
          </select>

          <Button variant="default" size="sm" onClick={handleExport} disabled={exporting}>
            <Download className="h-3.5 w-3.5 mr-1" />
            {exporting ? "Exporting…" : "Export"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyMarkdown}>
            <Copy className="h-3.5 w-3.5 mr-1" />
            {copied ? "Copied!" : "Copy MD"}
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
          <X className="h-4 w-4" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Message list */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <MessageSquare className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No messages match the selected filter.</p>
          </div>
        ) : (
          filteredMessages.map((msg, i) => (
            <MessageCard key={i} msg={msg} index={session.messages.indexOf(msg)} />
          ))
        )}
      </div>

      {/* Footer: showing info */}
      <div className="text-xs text-zinc-400 text-center">
        {filter === "all"
          ? `Showing all ${session.stats.parsedMessages} messages`
          : `Showing ${filteredMessages.length} of ${session.stats.parsedMessages} messages (filtered by "${filter}")`}
        {" · "}All processing is done locally in your browser
      </div>
    </div>
  );
}
