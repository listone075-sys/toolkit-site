"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { encodeBase64, decodeBase64, isBase64 } from "@/lib/tools/dev/base64";
import { useClipboard } from "@/hooks/use-clipboard";
import { ArrowLeftRight, Copy, Trash2 } from "lucide-react";

export function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState<string | null>(null);
  const { copied, copy } = useClipboard();

  const handleProcess = () => {
    setError(null);
    try {
      if (mode === "encode") {
        setOutput(encodeBase64(input));
      } else {
        setOutput(decodeBase64(input));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const handleSwap = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setError(null);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap p-3 bg-zinc-50 rounded-lg border">
        <div className="flex items-center gap-1 bg-white rounded-md border p-0.5">
          <Button
            variant={mode === "encode" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setMode("encode"); setOutput(""); setError(null); }}
          >
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setMode("decode"); setOutput(""); setError(null); }}
          >
            Decode
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleSwap} title="Swap input/output">
          <ArrowLeftRight className="h-4 w-4 mr-1" /> Swap
        </Button>
        <Button variant="outline" size="sm" onClick={handleProcess} className="ml-2">
          {mode === "encode" ? "Encode" : "Decode"}
        </Button>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={() => copy(output)} disabled={!output}>
            <Copy className="h-4 w-4 mr-1" /> {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} className="ml-1">
            <Trash2 className="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {mode === "encode" ? "Plain Text" : "Base64 String"}
          </div>
          <Textarea
            className="flex-1 font-mono text-sm resize-none border-0 shadow-none focus-visible:ring-0 p-0"
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {mode === "encode" ? "Base64 Output" : "Decoded Text"}
          </div>
          {error ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : output ? (
            <pre className="flex-1 text-sm font-mono whitespace-pre-wrap overflow-auto bg-zinc-50 p-3 rounded break-all">
              {output}
            </pre>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-zinc-400">
                Click {mode === "encode" ? "Encode" : "Decode"} to see the result
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
