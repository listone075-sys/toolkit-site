"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { generatePassword, estimateStrength } from "@/lib/tools/dev/password";
import { useClipboard } from "@/hooks/use-clipboard";
import { Copy, RefreshCw, Shield } from "lucide-react";

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { copied, copy } = useClipboard();

  const handleGenerate = useCallback(() => {
    try {
      const pwd = generatePassword({ length, uppercase, lowercase, numbers, symbols });
      setPassword(pwd);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setPassword("");
    }
  }, [length, uppercase, lowercase, numbers, symbols]);

  const strength = password ? estimateStrength(password) : null;

  return (
    <div className="space-y-4">
      {/* Generated Password */}
      <div className="border rounded-lg p-4 bg-zinc-50">
        <div className="flex items-center gap-3">
          <div className="flex-1 font-mono text-lg tracking-wider text-zinc-900 select-all">
            {password || "Click Generate to create a password"}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="outline" size="sm" onClick={handleGenerate}>
              <RefreshCw className="h-4 w-4 mr-1" /> Generate
            </Button>
            {password && (
              <Button variant="outline" size="sm" onClick={() => copy(password)}>
                <Copy className="h-4 w-4 mr-1" /> {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </div>
        </div>
        {strength && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  strength.score >= 5 ? "bg-green-500 w-full" :
                  strength.score >= 4 ? "bg-green-400 w-4/5" :
                  strength.score >= 3 ? "bg-amber-400 w-3/5" :
                  "bg-red-400 w-2/5"
                }`}
              />
            </div>
            <span className={`text-xs font-medium ${strength.color}`}>{strength.label}</span>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 bg-zinc-50 rounded-lg border">
        <div>
          <label className="text-xs font-medium text-zinc-600 block mb-1">Length: {length}</label>
          <input
            type="range" min={6} max={64} value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 accent-blue-600"
          />
        </div>
        {[
          { label: "A-Z", value: uppercase, set: setUppercase },
          { label: "a-z", value: lowercase, set: setLowercase },
          { label: "0-9", value: numbers, set: setNumbers },
          { label: "!@#$", value: symbols, set: setSymbols },
        ].map((opt) => (
          <label key={opt.label} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox" checked={opt.value}
              onChange={(e) => opt.set(e.target.checked)}
              className="rounded accent-blue-600"
            />
            {opt.label}
          </label>
        ))}
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
        <Shield className="h-4 w-4 mt-0.5 shrink-0" />
        <span>Generated in your browser using cryptographically strong randomness. Never stored or transmitted.</span>
      </div>
    </div>
  );
}
