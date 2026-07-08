"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropTarget } from "./file-upload-zone";
import { downloadFile } from "@/lib/utils/file";
import { useClipboard } from "@/hooks/use-clipboard";
import {
  parseSessionFile,
  validateSessionFile,
  exportToMarkdown,
  buildSessionHtml,
  prepareExportData,
  type ParsedSession,
  type ParsedMessage,
} from "@/lib/tools/dev/session-viewer";
import {
  Upload,
  FileJson,
  Download,
  Copy,
  FileText,
  FileType,
  File,
  MessageSquare,
  Wrench,
  User,
  Bot,
  Settings,
  Filter,
  ChevronDown,
  ChevronRight,
  Eye,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Loader2,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────

type ExportFormat = "markdown" | "docx" | "pdf";
type RoleFilter = "all" | "user" | "assistant" | "system";

// ── Helpers ──────────────────────────────────────────────────

function formatTimestamp(ts?: string): string {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return d.toLocaleString();
  } catch {
    return ts;
  }
}

// ── Sub-components ───────────────────────────────────────────

/** Session stats dashboard */
function SessionDashboard({ session }: { session: ParsedSession }) {
  const t = useTranslations("components");
  const s = session.summary;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="p-3 text-center">
        <div className="text-2xl font-bold text-blue-600">{s.totalMessages}</div>
        <div className="text-xs text-zinc-500 mt-1">Messages</div>
      </Card>
      <Card className="p-3 text-center">
        <div className="text-2xl font-bold text-emerald-600">{s.totalToolCalls}</div>
        <div className="text-xs text-zinc-500 mt-1">Tool Calls</div>
      </Card>
      <Card className="p-3 text-center">
        <div className="flex justify-center gap-1 text-sm font-semibold">
          <span className="text-blue-500">{s.roleCounts.user}</span>
          <span className="text-zinc-300">/</span>
          <span className="text-emerald-500">{s.roleCounts.assistant}</span>
          <span className="text-zinc-300">/</span>
          <span className="text-zinc-400">{s.roleCounts.system}</span>
        </div>
        <div className="text-xs text-zinc-500 mt-1">User / Asst / Sys</div>
      </Card>
      <Card className="p-3 text-center">
        <div className="text-lg font-bold text-violet-600 truncate px-1" title={s.uniqueTools.join(", ")}>
          {s.uniqueTools.length}
        </div>
        <div className="text-xs text-zinc-500 mt-1">Unique Tools</div>
      </Card>
    </div>
  );
}

/** Single message card */
function MessageCard({
  msg,
  expanded,
  onToggle,
}: {
  msg: ParsedMessage;
  expanded: boolean;
  onToggle: () => void;
}) {
  const roleIcons: Record<string, React.ReactNode> = {
    user: <User className="h-3.5 w-3.5" />,
    assistant: <Bot className="h-3.5 w-3.5" />,
    system: <Settings className="h-3.5 w-3.5" />,
  };

  const roleColors: Record<string, string> = {
    user: "border-l-blue-500 bg-blue-50/50",
    assistant: "border-l-emerald-500 bg-emerald-50/50",
    system: "border-l-zinc-400 bg-zinc-50/50",
  };

  const hasExtras = msg.toolCalls.length > 0 || msg.toolResults.length > 0;

  return (
    <div
      className={`border-l-4 rounded-r-lg p-3 mb-2 cursor-pointer transition hover:shadow-sm ${
        roleColors[msg.role] ?? "border-l-zinc-200"
      }`}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-semibold text-zinc-600">
          {roleIcons[msg.role]}
          <span className="capitalize">{msg.role}</span>
        </span>
        <span className="text-xs text-zinc-400">#{msg.index}</span>
        {hasExtras && (
          <span className="flex items-center gap-0.5 text-[10px] text-zinc-400 ml-auto">
            {msg.toolCalls.length > 0 && (
              <span className="flex items-center gap-0.5">
                <Wrench className="h-3 w-3" /> {msg.toolCalls.length}
              </span>
            )}
          </span>
        )}
        <span className="text-zinc-300">
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </span>
      </div>

      {/* Preview (when collapsed) */}
      {!expanded && msg.content && (
        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{msg.content}</p>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
          {msg.timestamp && (
            <p className="text-[10px] text-zinc-400">{formatTimestamp(msg.timestamp)}</p>
          )}

          {msg.content && (
            <div className="bg-white rounded border p-2 max-h-80 overflow-y-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap break-words text-zinc-700">
                {msg.content}
              </pre>
            </div>
          )}

          {/* Tool Calls */}
          {msg.toolCalls.map((tc, i) => (
            <details key={`tc-${i}`} className="bg-amber-50 rounded border border-amber-200">
              <summary className="px-2 py-1 text-xs font-medium text-amber-700 cursor-pointer">
                🔧 Tool: <code className="bg-amber-100 px-1 rounded">{tc.name}</code>
              </summary>
              <pre className="px-2 pb-2 text-[11px] font-mono whitespace-pre-wrap break-words text-zinc-600 max-h-48 overflow-y-auto">
                {tc.input}
              </pre>
            </details>
          ))}

          {/* Tool Results */}
          {msg.toolResults.map((tr, i) => (
            <details key={`tr-${i}`} className={`rounded border ${tr.isError ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
              <summary className={`px-2 py-1 text-xs font-medium cursor-pointer ${tr.isError ? "text-red-700" : "text-green-700"}`}>
                {tr.isError ? "❌" : "✅"} Tool Result
              </summary>
              <pre className="px-2 pb-2 text-[11px] font-mono whitespace-pre-wrap break-words text-zinc-600 max-h-48 overflow-y-auto">
                {tr.content}
              </pre>
            </details>
          ))}

          {!msg.content && !hasExtras && (
            <p className="text-xs text-zinc-400 italic">(empty message)</p>
          )}
        </div>
      )}
    </div>
  );
}

/** Export progress / loading state */
function ExportOverlay({ format }: { format: ExportFormat }) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <Card className="p-6 text-center space-y-3 min-w-[200px]">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
        <p className="text-sm font-medium text-zinc-700">
          Generating {format === "markdown" ? "Markdown" : format === "docx" ? "Word Document" : "PDF"}…
        </p>
      </Card>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────

export function SessionViewer() {
  const t = useTranslations("components");
  const [rawText, setRawText] = useState("");
  const [fileName, setFileName] = useState("session.jsonl");
  const [session, setSession] = useState<ParsedSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [expandedMsgs, setExpandedMsgs] = useState<Set<number>>(new Set());
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { copied, copy } = useClipboard();
  const exportRef = useRef<HTMLDivElement>(null);

  // Parse when file is loaded
  const handleFile = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Accept .jsonl, .json, and text files
    const name = file.name.toLowerCase();
    if (!name.endsWith(".jsonl") && !name.endsWith(".json") && !file.type.startsWith("text/")) {
      setError("Please upload a .jsonl or .json file from Claude Code.");
      return;
    }

    setFileName(file.name);
    setError(null);
    setSession(null);
    setExpandedMsgs(new Set());

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setRawText(text);

      // Validate first
      const validation = validateSessionFile(text);
      if (!validation.valid) {
        setError(validation.error ?? "Invalid session file.");
        return;
      }

      // Parse
      try {
        const parsed = parseSessionFile(text, file.name);
        setSession(parsed);
      } catch (e) {
        setError((e as Error).message);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
    };
    reader.readAsText(file);
  }, []);

  // Filtered messages
  const filteredMessages = useMemo(() => {
    if (!session) return [];
    if (roleFilter === "all") return session.messages;
    return session.messages.filter((m) => m.role === roleFilter);
  }, [session, roleFilter]);

  // Paginated messages (show 50 at a time)
  const pageSize = 50;
  const displayedMessages = showAll
    ? filteredMessages
    : filteredMessages.slice(0, pageSize);

  // Toggle message expansion
  const toggleMessage = (index: number) => {
    setExpandedMsgs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const expandAll = () => {
    const allIndices = new Set(filteredMessages.map((m) => m.index));
    setExpandedMsgs(allIndices);
  };

  const collapseAll = () => {
    setExpandedMsgs(new Set());
  };

  // ── Export Handlers ────────────────────────────────────────

  const handleExportMarkdown = useCallback(async () => {
    if (!session) return;
    setExporting("markdown");
    // Small delay to show loading state
    await new Promise((r) => setTimeout(r, 100));
    try {
      const { markdown, fileName: baseName } = prepareExportData(session);
      downloadFile(markdown, `${baseName}-session.md`, "text/markdown");
    } finally {
      setExporting(null);
    }
  }, [session]);

  const handleExportDocx = useCallback(async () => {
    if (!session) return;
    setExporting("docx");
    await new Promise((r) => setTimeout(r, 100));
    try {
      // Use the docx package for proper .docx generation
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children: any[] = [];

      // Title
      children.push(
        new Paragraph({
          text: `Claude Code Session: ${session.summary.fileName}`,
          heading: HeadingLevel.HEADING_1,
        }),
      );

      // Summary
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Messages: ${session.summary.totalMessages}`, bold: true }),
            new TextRun({ text: `  |  Tool Calls: ${session.summary.totalToolCalls}`, bold: true }),
          ],
        }),
      );
      if (session.summary.uniqueTools.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `Tools Used: ${session.summary.uniqueTools.join(", ")}`, bold: true }),
            ],
          }),
        );
      }
      children.push(new Paragraph({ text: "" }));

      // Messages
      for (const msg of session.messages) {
        const roleLabel = msg.role === "user" ? "User" : msg.role === "assistant" ? "Assistant" : "System";

        children.push(
          new Paragraph({
            text: `${roleLabel} — Message #${msg.index}`,
            heading: HeadingLevel.HEADING_3,
          }),
        );

        if (msg.timestamp) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: formatTimestamp(msg.timestamp), italics: true, color: "#6b7280", size: 18 })],
            }),
          );
        }

        if (msg.content) {
          // Split content by newlines for proper paragraphs
          const contentLines = msg.content.split("\n");
          for (const line of contentLines) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: line || " ", size: 20 })],
                spacing: { after: 60 },
              }),
            );
          }
        }

        // Tool calls
        for (const tc of msg.toolCalls) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `Tool: ${tc.name}`, bold: true, color: "#d97706", size: 18 }),
              ],
            }),
          );
          children.push(
            new Paragraph({
              children: [new TextRun({ text: tc.input, font: "Consolas", size: 16, color: "#4b5563" })],
              spacing: { after: 120 },
            }),
          );
        }

        // Separator
        children.push(new Paragraph({ text: "" }));
      }

      const doc = new Document({
        sections: [
          {
            properties: {},
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const baseName = session.summary.fileName.replace(/\.jsonl$/i, "");
      downloadFile(blob, `${baseName}-session.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    } catch (e) {
      console.error("DOCX export failed:", e);
      // Fallback: download as HTML with .doc extension
      const { html, fileName: baseName } = prepareExportData(session);
      downloadFile(html, `${baseName}-session.doc`, "application/msword");
    } finally {
      setExporting(null);
    }
  }, [session]);

  const handleExportPdf = useCallback(async () => {
    if (!session) return;
    setExporting("pdf");
    await new Promise((r) => setTimeout(r, 100));
    try {
      const html = buildSessionHtml(session);

      // Try html2pdf.js if available
      try {
        const html2pdf = (await import("html2pdf.js")).default;

        const container = document.createElement("div");
        container.innerHTML = html;
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.top = "0";
        document.body.appendChild(container);

        const baseName = session.summary.fileName.replace(/\.jsonl$/i, "");
        await html2pdf()
          .set({
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `${baseName}-session.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
          })
          .from(container)
          .save();

        document.body.removeChild(container);
      } catch {
        // Fallback: open in new window for print-to-PDF
        const w = window.open("", "_blank");
        if (w) {
          w.document.write(html);
          w.document.close();
          setTimeout(() => w.print(), 500);
        }
      }
    } finally {
      setExporting(null);
    }
  }, [session]);

  // ── Compute tool list for filter chips ─────────────────────

  const uniqueTools = useMemo(
    () => (session ? session.summary.uniqueTools : []),
    [session],
  );

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {exporting && <ExportOverlay format={exporting} />}

      {/* File Upload Zone */}
      {!session && (
        <DropTarget onFiles={handleFile} className="min-h-[300px] flex flex-col">
          <div className="border-2 border-dashed border-zinc-300 rounded-xl p-12 text-center flex-1 flex flex-col items-center justify-center bg-zinc-50 hover:bg-blue-50/50 hover:border-blue-400 transition-colors">
            <FileJson className="h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-700 mb-2">
              Upload Claude Code Session File
            </h3>
            <p className="text-sm text-zinc-500 mb-4">
              Drag & drop your <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">.jsonl</code> or{" "}
              <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">.json</code> session file here
            </p>
            <Button
              variant="outline"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".jsonl,.json,text/plain,application/json";
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files && files.length > 0) handleFile(Array.from(files));
                };
                input.click();
              }}
            >
              <Upload className="h-4 w-4 mr-2" /> Browse Files
            </Button>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-md">
              <p className="text-xs text-blue-700 flex items-center gap-1">
                <Eye className="h-3 w-3" /> All processing happens in your browser — your data never leaves your device.
              </p>
            </div>
          </div>
        </DropTarget>
      )}

      {/* Error display */}
      {error && !session && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              setError(null);
              setRawText("");
              setSession(null);
            }}
          >
            Try Another File
          </Button>
        </Card>
      )}

      {/* Session loaded — show dashboard + messages */}
      {session && (
        <>
          {/* File info + actions bar */}
          <div className="flex items-center gap-3 flex-wrap p-3 bg-zinc-50 rounded-lg border">
            <FileJson className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-zinc-700 truncate max-w-[200px]">
              {session.summary.fileName}
            </span>
            <span className="text-xs text-zinc-400">
              {session.summary.totalMessages} messages
            </span>

            <div className="ml-auto flex items-center gap-2 flex-wrap">
              {/* Export dropdown */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportMarkdown}
                  disabled={exporting !== null}
                >
                  <FileText className="h-3.5 w-3.5 mr-1" /> Markdown
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportDocx}
                  disabled={exporting !== null}
                >
                  <FileType className="h-3.5 w-3.5 mr-1" /> Word
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPdf}
                  disabled={exporting !== null}
                >
                  <File className="h-3.5 w-3.5 mr-1" /> PDF
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSession(null);
                  setRawText("");
                  setError(null);
                  setExpandedMsgs(new Set());
                }}
              >
                <Upload className="h-3.5 w-3.5 mr-1" /> New File
              </Button>
            </div>
          </div>

          {/* Dashboard */}
          <SessionDashboard session={session} />

          {/* Filter bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Filter:
            </span>
            {(["all", "user", "assistant", "system"] as RoleFilter[]).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`text-xs px-2.5 py-1 rounded-full border transition ${
                  roleFilter === role
                    ? "bg-blue-100 border-blue-300 text-blue-700 font-medium"
                    : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {role === "all" ? "All" : role.charAt(0).toUpperCase() + role.slice(1)}
                {role !== "all" && session && (
                  <span className="ml-1 text-zinc-400">
                    ({session.summary.roleCounts[role as keyof typeof session.summary.roleCounts]})
                  </span>
                )}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="ghost" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
          </div>

          {/* Tools used chips */}
          {uniqueTools.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Tools:</span>
              {uniqueTools.map((tool) => (
                <span
                  key={tool}
                  className="text-[10px] px-1.5 py-0.5 bg-violet-50 border border-violet-200 rounded text-violet-700 font-mono"
                >
                  {tool}
                </span>
              ))}
            </div>
          )}

          {/* Message list */}
          <div className="max-h-[600px] overflow-y-auto border rounded-lg p-2 bg-white">
            {displayedMessages.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 text-sm">
                No messages match the selected filter.
              </div>
            ) : (
              displayedMessages.map((msg) => (
                <MessageCard
                  key={msg.index}
                  msg={msg}
                  expanded={expandedMsgs.has(msg.index)}
                  onToggle={() => toggleMessage(msg.index)}
                />
              ))
            )}

            {/* Show more button */}
            {!showAll && filteredMessages.length > pageSize && (
              <div className="text-center py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(true)}
                >
                  Show All {filteredMessages.length} Messages
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            )}
          </div>

          {/* Message count footer */}
          <p className="text-xs text-zinc-400 text-center">
            Showing {displayedMessages.length} of {filteredMessages.length} messages
            {!showAll && filteredMessages.length > pageSize && " (scroll to load more)"}
          </p>
        </>
      )}
    </div>
  );
}
