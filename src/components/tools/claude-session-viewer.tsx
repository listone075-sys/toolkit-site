"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { downloadFile } from "@/lib/utils/file";
import { cn } from "@/lib/utils/cn";
import { DropTarget } from "./file-upload-zone";
import {
  parseSession,
  sessionToMarkdown,
  sessionToHtml,
  roleEmoji,
  formatTimestamp,
  type ParsedSession,
  type SessionMessage,
} from "@/lib/tools/dev/claude-session-viewer";
import {
  Upload,
  FileText,
  Copy,
  Download,
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
} from "lucide-react";

type ExportFormat = "markdown" | "html" | "docx" | "pdf";
type RoleFilter = SessionMessage["role"] | "all";

// ── Color palette per role ─────────────────────────────────────

const ROLE_COLORS: Record<SessionMessage["role"], { border: string; bg: string; badge: string }> = {
  user: { border: "border-blue-400", bg: "bg-blue-50", badge: "bg-blue-500 text-white" },
  assistant: { border: "border-emerald-400", bg: "bg-emerald-50", badge: "bg-emerald-500 text-white" },
  system: { border: "border-amber-400", bg: "bg-amber-50", badge: "bg-amber-500 text-white" },
  tool: { border: "border-violet-400", bg: "bg-violet-50", badge: "bg-violet-500 text-white" },
};

const ROLE_FILTERS: { value: RoleFilter; icon: React.ReactNode }[] = [
  { value: "all", icon: <MessageSquare className="h-3.5 w-3.5" /> },
  { value: "user", icon: <User className="h-3.5 w-3.5" /> },
  { value: "assistant", icon: <Bot className="h-3.5 w-3.5" /> },
  { value: "system", icon: <Settings className="h-3.5 w-3.5" /> },
  { value: "tool", icon: <Wrench className="h-3.5 w-3.5" /> },
];

/** Threshold above which message content is collapsed behind a "Show more" toggle. */
const PREVIEW_LEN = 400;

// ── Message Card ───────────────────────────────────────────────

function MessageCard({
  msg,
  index,
  roleLabel,
}: {
  msg: SessionMessage;
  index: number;
  roleLabel: (role: SessionMessage["role"]) => string;
}) {
  const t = useTranslations("components");
  const [showToolDetails, setShowToolDetails] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const colors = ROLE_COLORS[msg.role];
  const hasToolDetails = !!(msg.toolName || msg.toolResult);
  const isLong = msg.content.length > PREVIEW_LEN;

  return (
    <div className={cn("border-l-4 rounded-r-lg p-4 transition-all hover:shadow-sm", colors.border, colors.bg)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className={cn("text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full", colors.badge)}>
          {roleEmoji(msg.role)} {roleLabel(msg.role)}
        </span>
        <span className="text-xs text-zinc-400 font-mono">#{index + 1}</span>
        {msg.timestamp && (
          <span className="text-xs text-zinc-400 ml-auto">{formatTimestamp(msg.timestamp)}</span>
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
            onClick={() => setShowToolDetails((v) => !v)}
            className="text-xs text-zinc-500 hover:text-zinc-700 flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            {showToolDetails
              ? t("claudeSessionViewer.hideToolDetails")
              : t("claudeSessionViewer.showToolDetails")}
          </button>
          {showToolDetails && (
            <div className="mt-2 space-y-2">
              {msg.toolInput && (
                <details open className="text-xs">
                  <summary className="cursor-pointer text-zinc-500 font-medium">
                    {t("claudeSessionViewer.toolInput")}
                  </summary>
                  <pre className="mt-1 p-2 bg-zinc-100 rounded text-xs overflow-x-auto max-h-40">
                    {msg.toolInput}
                  </pre>
                </details>
              )}
              {msg.toolResult && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-zinc-500 font-medium">
                    {t("claudeSessionViewer.toolResult")}
                  </summary>
                  <pre className="mt-1 p-2 bg-zinc-100 rounded text-xs overflow-x-auto max-h-60 whitespace-pre-wrap">
                    {msg.toolResult.length > 5000
                      ? msg.toolResult.slice(0, 5000) + t("claudeSessionViewer.resultTruncated")
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
        <div className="text-sm whitespace-pre-wrap break-words">
          {isLong && !showFullContent ? (
            <>
              <p>{msg.content.slice(0, PREVIEW_LEN)}…</p>
              <button
                onClick={() => setShowFullContent(true)}
                className="text-xs text-blue-500 hover:text-blue-600 mt-1"
              >
                {t("claudeSessionViewer.showMore", { count: msg.content.length.toLocaleString() })}
              </button>
            </>
          ) : (
            <p>{msg.content}</p>
          )}
        </div>
      ) : (
        <p className="text-xs text-zinc-400 italic">{t("claudeSessionViewer.emptyContent")}</p>
      )}
    </div>
  );
}

// ── Stats Bar ──────────────────────────────────────────────────

function StatsBar({ session }: { session: ParsedSession }) {
  const t = useTranslations("components");
  const s = session.stats;
  return (
    <div className="flex items-center gap-4 flex-wrap text-xs text-zinc-500 bg-zinc-50 rounded-lg p-3 border">
      <BarChart3 className="h-4 w-4 text-zinc-400" />
      <span className="font-medium text-zinc-700">
        {s.parsedMessages} {t("claudeSessionViewer.messagesLabel")}
      </span>
      <span className="w-px h-4 bg-zinc-200" />
      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {s.userMessages}</span>
      <span className="flex items-center gap-1"><Bot className="h-3 w-3" /> {s.assistantMessages}</span>
      <span className="flex items-center gap-1"><Settings className="h-3 w-3" /> {s.systemMessages}</span>
      <span className="flex items-center gap-1"><Wrench className="h-3 w-3" /> {s.toolMessages}</span>
      <span className="w-px h-4 bg-zinc-200" />
      <span>{s.totalChars.toLocaleString()} {t("claudeSessionViewer.charsLabel")}</span>
      <span>~{s.estimatedTokens.toLocaleString()} {t("claudeSessionViewer.tokensLabel")}</span>
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
  const t = useTranslations("components");
  const [session, setSession] = useState<ParsedSession | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RoleFilter>("all");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("markdown");
  const [exporting, setExporting] = useState(false);
  const { copied, copy } = useClipboard();

  // Translated role label for UI (exports keep English labels from the lib).
  const roleLabel = useCallback(
    (role: SessionMessage["role"] | "all") => t(`claudeSessionViewer.role_${role}`),
    [t],
  );

  // Filtered messages, each paired with its original index for stable keys.
  const filteredMessages = useMemo(() => {
    if (!session) return [];
    return session.messages
      .map((msg, index) => ({ msg, index }))
      .filter(({ msg }) => filter === "all" || msg.role === filter);
  }, [session, filter]);

  // ── File handling ─────────────────────────────────────────

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = reader.result as string;
          if (!text.trim()) {
            setError(t("claudeSessionViewer.errorEmpty"));
            return;
          }
          const parsed = parseSession(text);
          if (parsed.messages.length === 0) {
            setError(t("claudeSessionViewer.errorNoMessages"));
            return;
          }
          setSession(parsed);
        } catch (e) {
          setError(t("claudeSessionViewer.errorParse", { message: (e as Error).message }));
        }
      };
      reader.onerror = () => setError(t("claudeSessionViewer.errorRead"));
      reader.readAsText(file);
    },
    [t],
  );

  const handleDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;
      const name = file.name.toLowerCase();
      if (!name.endsWith(".jsonl") && !name.endsWith(".json") && !name.endsWith(".txt")) {
        setError(t("claudeSessionViewer.errorFileType"));
        return;
      }
      handleFile(file);
    },
    [handleFile, t],
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
          downloadFile(sessionToMarkdown(session), "claude-session.md", "text/markdown");
          break;
        }
        case "html": {
          downloadFile(sessionToHtml(session), "claude-session.html", "text/html");
          break;
        }
        case "docx": {
          const { markdownToDocxBlob } = await import("@/lib/tools/markdown/md-to-docx");
          const blob = await markdownToDocxBlob(sessionToMarkdown(session));
          downloadFile(
            blob,
            "claude-session.docx",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          );
          break;
        }
        case "pdf": {
          // Reuse the shared markdown→PDF pipeline: produces a real downloadable
          // file (no popup, no print-dialog race).
          const { markdownToPdfBlob } = await import("@/lib/tools/markdown/md-to-pdf");
          const blob = await markdownToPdfBlob(sessionToMarkdown(session), session.title ?? "Claude Session");
          downloadFile(blob, "claude-session.pdf", "application/pdf");
          break;
        }
      }
    } catch (e) {
      setError(t("claudeSessionViewer.errorExport", { message: (e as Error).message }));
    }
    setExporting(false);
  }, [session, exportFormat, t]);

  const handleCopyMarkdown = useCallback(() => {
    if (!session) return;
    copy(sessionToMarkdown(session));
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
          <div
            className="border-2 border-dashed border-zinc-300 rounded-xl flex-1 flex flex-col items-center justify-center p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
            onClick={handleUploadClick}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-700 mb-2">
              {t("claudeSessionViewer.uploadTitle")}
            </h3>
            <p className="text-sm text-zinc-500 max-w-md mb-3">
              {t("claudeSessionViewer.dropInstructions")}
            </p>
            <p className="text-xs text-zinc-400 max-w-md">{t("claudeSessionViewer.privacyNote")}</p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 max-w-md">
                {error}
              </div>
            )}
          </div>
        </DropTarget>

        {/* Sample / guide */}
        <div className="border rounded-lg p-5 bg-zinc-50">
          <h4 className="text-sm font-semibold text-zinc-600 mb-2">{t("claudeSessionViewer.whereTitle")}</h4>
          <ul className="text-xs text-zinc-500 space-y-1 list-disc list-inside">
            <li>{t("claudeSessionViewer.whereItem1")}</li>
            <li>{t("claudeSessionViewer.whereItem2")}</li>
            <li>{t("claudeSessionViewer.whereItem3")}</li>
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
          <span className="text-xs text-green-600">{t("claudeSessionViewer.parsedSuccess")}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleUploadClick}>
            <Upload className="h-3.5 w-3.5 mr-1" /> {t("claudeSessionViewer.openAnother")}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <X className="h-3.5 w-3.5 mr-1" /> {t("claudeSessionViewer.clear")}
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
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                filter === f.value
                  ? "bg-zinc-800 text-white"
                  : "bg-white border text-zinc-600 hover:bg-zinc-100",
              )}
            >
              {f.icon}
              {roleLabel(f.value)}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Export format selector */}
          <select
            aria-label={t("claudeSessionViewer.exportFormatLabel")}
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
            className="text-xs border rounded-md px-2 py-1.5 bg-white"
          >
            <option value="markdown">{t("claudeSessionViewer.formatMarkdown")}</option>
            <option value="html">{t("claudeSessionViewer.formatHtml")}</option>
            <option value="docx">{t("claudeSessionViewer.formatDocx")}</option>
            <option value="pdf">{t("claudeSessionViewer.formatPdf")}</option>
          </select>

          <Button variant="default" size="sm" onClick={handleExport} disabled={exporting}>
            <Download className="h-3.5 w-3.5 mr-1" />
            {exporting ? t("claudeSessionViewer.exporting") : t("claudeSessionViewer.export")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyMarkdown}>
            <Copy className="h-3.5 w-3.5 mr-1" />
            {copied ? t("claudeSessionViewer.copied") : t("claudeSessionViewer.copyMd")}
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
            <p className="text-sm">{t("claudeSessionViewer.noMatch")}</p>
          </div>
        ) : (
          filteredMessages.map(({ msg, index }) => (
            <MessageCard key={index} msg={msg} index={index} roleLabel={roleLabel} />
          ))
        )}
      </div>

      {/* Footer: showing info */}
      <div className="text-xs text-zinc-400 text-center">
        {filter === "all"
          ? t("claudeSessionViewer.showingAll", { count: session.stats.parsedMessages })
          : t("claudeSessionViewer.showingFiltered", {
              shown: filteredMessages.length,
              total: session.stats.parsedMessages,
              filter: roleLabel(filter),
            })}
        {" · "}
        {t("claudeSessionViewer.processingNote")}
      </div>
    </div>
  );
}
