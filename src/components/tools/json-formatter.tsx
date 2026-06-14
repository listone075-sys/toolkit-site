"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatJson, minifyJson, validateJson } from "@/lib/tools/dev/json-format";
import { useClipboard } from "@/hooks/use-clipboard";
import { downloadFile } from "@/lib/utils/file";
import { Copy, Download, AlignLeft, Minus, CheckCircle, XCircle } from "lucide-react";

const placeholder = `{
  "name": "Alice",
  "age": 30,
  "hobbies": ["reading", "coding"],
  "address": {
    "city": "San Francisco",
    "country": "US"
  }
}`;

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);
  const { copied, copy } = useClipboard();

  const handleFormat = () => {
    try {
      const formatted = formatJson(input || placeholder, 2);
      setOutput(formatted);
      setError(null);
      setValid(true);
    } catch (e) {
      setError((e as Error).message);
      setValid(false);
      setOutput("");
    }
  };

  const handleMinify = () => {
    try {
      const minified = minifyJson(input || placeholder);
      setOutput(minified);
      setError(null);
      setValid(true);
    } catch (e) {
      setError((e as Error).message);
      setValid(false);
      setOutput("");
    }
  };

  const handleCopy = () => copy(output);
  const handleDownload = () => downloadFile(output, "formatted.json", "application/json");

  // Live validation
  const handleInputChange = (value: string) => {
    setInput(value);
    if (!value.trim()) {
      setValid(null);
      setError(null);
      return;
    }
    const result = validateJson(value);
    setValid(result.valid);
    setError(result.valid ? null : result.error ?? null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap p-3 bg-zinc-50 rounded-lg border">
        <Button variant="default" size="sm" onClick={handleFormat}>
          <AlignLeft className="h-4 w-4 mr-1" /> Format
        </Button>
        <Button variant="outline" size="sm" onClick={handleMinify}>
          <Minus className="h-4 w-4 mr-1" /> Minify
        </Button>
        <div className="ml-auto flex items-center gap-2">
          {valid !== null && (
            valid ? (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Valid JSON
              </span>
            ) : (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <XCircle className="h-3 w-3" /> Invalid
              </span>
            )
          )}
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
            <Copy className="h-4 w-4 mr-1" /> {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output}>
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        </div>
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 min-h-[400px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Input</div>
          <Textarea
            className="flex-1 font-mono text-sm resize-none border-0 shadow-none focus-visible:ring-0 p-0"
            placeholder={placeholder}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="border rounded-lg p-4 min-h-[400px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Output</div>
          {error ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-red-500 text-center">{error}</p>
            </div>
          ) : output ? (
            <pre className="flex-1 text-sm font-mono whitespace-pre-wrap overflow-auto bg-zinc-50 p-3 rounded">
              {output}
            </pre>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-zinc-400">Click Format or Minify to see the result</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
