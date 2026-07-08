"use client";

import { useState, useCallback, useMemo, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { useClipboard } from "@/hooks/use-clipboard";
import { parseSession, type ParsedSession, type SessionMessage } from "@/lib/tools/claude/parse-session";
import { sessionToMarkdown } from "@/lib/tools/claude/session-to-markdown";
import { downloadFile } from "@/lib/utils/file";
import {
  Download,
  Copy,
  X,
  FileJson,
  Brain,
  Wrench,
  User,
  Bot,
  Cog,
  ChevronRight,
} from "lucide-react";

type ExportKind = "md" | "docx" | "pdf";

const ROLE_META: Record<
  SessionMessage["role"],
  { icon: typeof User; label: string; ring: string; badge: string }
> = {
  user: { icon: User, label: "User", ring: "border-l-blue-400", badge: "bg-blue-50 text-blue-700" },
  assistant: { icon: Bot, label: "Assistant", ring: "border-l-emerald-400", badge: "bg-emerald-50 text-emerald-700" },
  system: { icon: Cog, label: "System", ring: "border-l-zinc-300", badge: "bg-zinc-100 text-zinc-600" },
};

function prettyInput(input: unknown): string {
  if (input == null) return "";
  if (typeof input === "string") return input;
  try {
    return JSON.stringify(input, null, 2);
  } catch {
    return String(input);
  }
}

export function ClaudeSessionViewer() {
  const t = useTranslations("components");
  const { copied, copy } = useClipboard();

  const [fileName, setFileName] = useState<string | null>(null);
  const [session, setSession] = useState<ParsedSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<ExportKind | null>(null);

  const [showThinking, setShowThinking] = useState(true);
  const [showTools, setShowTools] = useState(true);

  const handleFile = useCallback(
    async (files: File[]) => {
      const f = files[0];
      if (!f) return;
      if (!/\.jsonl?$/i.test(f.name)) {
        setError(t("claudeSessionViewer.invalidFile"));
        return;
      }
      setError(null);
      try {
        const text = await f.text();
        const parsed = parseSession(text);
        if (parsed.messages.length === 0) {
          setError(t("claudeSessionViewer.emptyFile"));
          return;
        }
        setSession(parsed);
        setFileName(f.name);
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [t],
  );

  const reset = () => {
    setSession(null);
    setFileName(null);
    setError(null);
  };

  const baseName = useMemo(
    () => (fileName ? fileName.replace(/\.jsonl?$/i, "") : session?.sessionId ?? "claude-session"),
    [fileName, session],
  );

  const buildMarkdown = useCallback(
    () =>
      session
        ? sessionToMarkdown(session, {
            includeThinking: showThinking,
            includeToolCalls: showTools,
          })
        : "",
    [session, showThinking, showTools],
  );

  const handleExport = useCallback(
    async (kind: ExportKind) => {
      if (!session) return;
      setBusy(kind);
      setError(null);
      try {
        const md = buildMarkdown();
        if (kind === "md") {
          downloadFile(md, `${baseName}.md`, "text/markdown");
        } else if (kind === "docx") {
          const { markdownToDocxBlob } = await import("@/lib/tools/markdown/md-to-docx");
          const blob = await markdownToDocxBlob(md);
          downloadFile(
            blob,
            `${baseName}.docx`,
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          );
        } else {
          const { markdownToPdfBlob } = await import("@/lib/tools/markdown/md-to-pdf");
          const blob = await markdownToPdfBlob(md, session.title ?? baseName);
          downloadFile(blob, `${baseName}.pdf`, "application/pdf");
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setBusy(null);
      }
    },
    [session, buildMarkdown, baseName],
  );

  // ── Empty state ──────────────────────────────────────────────
  if (!session) {
    return (
      <div className="space-y-4">
        <FileUploadZone
          title={t("claudeSessionViewer.uploadTitle")}
          description={t("claudeSessionViewer.uploadHint")}
          browseLabel={t("claudeSessionViewer.browse")}
          accept=".jsonl,.json,application/jsonl,application/json"
          onFiles={handleFile}
          icon={<FileJson className="h-10 w-10 text-zinc-300 mb-3" />}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <p className="text-xs text-zinc-400 text-center">{t("claudeSessionViewer.privacyNote")}</p>
      </div>
    );
  }

  const visibleMessages = session.messages.filter((m) => !m.isMeta);

  // ── Loaded state ─────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Metadata header */}
      <div className="rounded-lg border bg-zinc-50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold truncate">
              {session.title ?? t("claudeSessionViewer.untitled")}
            </h2>
            <p className="text-xs text-zinc-400 truncate">{fileName}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={reset} aria-label={t("claudeSessionViewer.reset")}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {session.cwd && <Chip label={t("claudeSessionViewer.project")} value={session.cwd} />}
          {session.gitBranch && <Chip label={t("claudeSessionViewer.branch")} value={session.gitBranch} />}
          {session.models.length > 0 && (
            <Chip label={t("claudeSessionViewer.model")} value={session.models.join(", ")} />
          )}
          <Chip label={t("claudeSessionViewer.messages")} value={String(session.messageCount)} />
          <Chip label={t("claudeSessionViewer.toolCalls")} value={String(session.toolUseCount)} />
          {(session.tokens.input > 0 || session.tokens.output > 0) && (
            <Chip
              label={t("claudeSessionViewer.tokens")}
              value={`${session.tokens.input.toLocaleString()} / ${session.tokens.output.toLocaleString()}`}
            />
          )}
        </div>
      </div>

      {/* Toolbar: view toggles + exports */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-white p-3">
        <label className="flex items-center gap-1.5 text-sm text-zinc-600 cursor-pointer">
          <input type="checkbox" checked={showThinking} onChange={(e) => setShowThinking(e.target.checked)} />
          <Brain className="h-3.5 w-3.5" /> {t("claudeSessionViewer.showThinking")}
        </label>
        <label className="flex items-center gap-1.5 text-sm text-zinc-600 cursor-pointer">
          <input type="checkbox" checked={showTools} onChange={(e) => setShowTools(e.target.checked)} />
          <Wrench className="h-3.5 w-3.5" /> {t("claudeSessionViewer.showTools")}
        </label>
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={() => copy(buildMarkdown())}>
            <Copy className="h-4 w-4 mr-1" /> {copied ? t("claudeSessionViewer.copied") : t("claudeSessionViewer.copyMd")}
          </Button>
          <Button variant="outline" size="sm" disabled={busy !== null} onClick={() => handleExport("md")}>
            <Download className="h-4 w-4 mr-1" /> MD
          </Button>
          <Button variant="outline" size="sm" disabled={busy !== null} onClick={() => handleExport("docx")}>
            <Download className="h-4 w-4 mr-1" /> {busy === "docx" ? t("claudeSessionViewer.exporting") : "Word"}
          </Button>
          <Button variant="outline" size="sm" disabled={busy !== null} onClick={() => handleExport("pdf")}>
            <Download className="h-4 w-4 mr-1" /> {busy === "pdf" ? t("claudeSessionViewer.exporting") : "PDF"}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {session.skippedLines > 0 && (
        <p className="text-xs text-amber-600">
          {t("claudeSessionViewer.skipped", { count: session.skippedLines })}
        </p>
      )}

      {/* Transcript */}
      <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
        {visibleMessages.map((msg) => (
          <MessageCard
            key={msg.uuid}
            msg={msg}
            showThinking={showThinking}
            showTools={showTools}
            labels={{
              thinking: t("claudeSessionViewer.thinking"),
              toolCall: t("claudeSessionViewer.toolCall"),
              toolResult: t("claudeSessionViewer.toolResult"),
              toolError: t("claudeSessionViewer.toolError"),
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white border px-2 py-0.5">
      <span className="text-zinc-400">{label}:</span>
      <span className="font-medium text-zinc-700 max-w-[220px] truncate">{value}</span>
    </span>
  );
}

function MessageCard({
  msg,
  showThinking,
  showTools,
  labels,
}: {
  msg: SessionMessage;
  showThinking: boolean;
  showTools: boolean;
  labels: { thinking: string; toolCall: string; toolResult: string; toolError: string };
}) {
  const meta = ROLE_META[msg.role];
  const Icon = meta.icon;

  return (
    <div className={`rounded-lg border border-l-4 ${meta.ring} bg-white p-4`}>
      <div className="mb-2 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${meta.badge}`}>
          <Icon className="h-3 w-3" /> {meta.label}
        </span>
        {msg.isSidechain && (
          <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600">sub-agent</span>
        )}
        {msg.model && <span className="text-xs text-zinc-400">{msg.model}</span>}
      </div>
      <div className="space-y-2">
        {msg.blocks.map((block, i) => {
          if (block.kind === "text") {
            return (
              <p key={i} className="whitespace-pre-wrap break-words text-sm text-zinc-800">
                {block.text}
              </p>
            );
          }
          if (block.kind === "thinking") {
            if (!showThinking) return null;
            return (
              <Collapsible key={i} label={labels.thinking} icon={<Brain className="h-3.5 w-3.5" />} tone="amber">
                <pre className="whitespace-pre-wrap break-words font-mono text-xs text-zinc-600">{block.text}</pre>
              </Collapsible>
            );
          }
          if (block.kind === "tool_use") {
            if (!showTools) return null;
            const input = prettyInput(block.input);
            return (
              <Collapsible
                key={i}
                label={`${labels.toolCall}: ${block.name}`}
                icon={<Wrench className="h-3.5 w-3.5" />}
                tone="blue"
              >
                {input ? (
                  <pre className="whitespace-pre-wrap break-words font-mono text-xs text-zinc-700">{input}</pre>
                ) : (
                  <span className="text-xs text-zinc-400">—</span>
                )}
              </Collapsible>
            );
          }
          // tool_result
          if (!showTools) return null;
          return (
            <Collapsible
              key={i}
              label={block.isError ? labels.toolError : labels.toolResult}
              icon={<Wrench className="h-3.5 w-3.5" />}
              tone={block.isError ? "red" : "zinc"}
            >
              <pre className="whitespace-pre-wrap break-words font-mono text-xs text-zinc-600 max-h-64 overflow-auto">
                {block.content || "—"}
              </pre>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}

const TONE: Record<string, string> = {
  amber: "text-amber-700 bg-amber-50",
  blue: "text-blue-700 bg-blue-50",
  red: "text-red-700 bg-red-50",
  zinc: "text-zinc-600 bg-zinc-50",
};

function Collapsible({
  label,
  icon,
  tone,
  children,
}: {
  label: string;
  icon: ReactNode;
  tone: keyof typeof TONE | string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-md border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center gap-1.5 rounded-t-md px-2.5 py-1.5 text-xs font-medium ${TONE[tone] ?? TONE.zinc}`}
      >
        <ChevronRight className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`} />
        {icon}
        <span className="truncate">{label}</span>
      </button>
      {open && <div className="border-t p-2.5">{children}</div>}
    </div>
  );
}
