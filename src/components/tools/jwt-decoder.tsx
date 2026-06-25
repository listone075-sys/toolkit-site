"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { decodeJwt, formatJwtTimestamp, isJwtExpired } from "@/lib/tools/dev/jwt-decoder";
import type { DecodedJwt } from "@/lib/tools/dev/jwt-decoder";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { Copy, Check, X, AlertTriangle, ShieldCheck } from "lucide-react";

export function JwtDecoder() {
  const t = useTranslations("components");
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = () => {
    setError(null);
    if (!token.trim()) {
      setError("Paste a JWT token to decode.");
      setDecoded(null);
      return;
    }
    const result = decodeJwt(token.trim());
    if (!result.isValidStructure) {
      setError("Invalid JWT. A valid JWT has three parts separated by dots: header.payload.signature");
      setDecoded(null);
      return;
    }
    setDecoded(result);
  };

  const handleClear = () => {
    setToken("");
    setDecoded(null);
    setError(null);
  };

  const expired = decoded && isJwtExpired(decoded.payload);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-600">JWT Token</p>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIs..."
          className="w-full h-24 p-3 text-sm font-mono border rounded-lg resize-y"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={handleDecode}>Decode JWT</Button>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <X className="h-4 w-4 mr-1" /> Clear
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {decoded && (
        <div className="space-y-3">
          {/* Status */}
          {expired !== null && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${expired ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
              {expired ? <AlertTriangle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
              {expired ? "Token is expired" : "Token is valid (expiration check only)"}
            </div>
          )}

          {/* Header */}
          <details className="border rounded-lg" open>
            <summary className="p-3 font-medium text-sm cursor-pointer bg-zinc-50 rounded-t-lg">
              Header
            </summary>
            <pre className="p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </details>

          {/* Payload */}
          <details className="border rounded-lg" open>
            <summary className="p-3 font-medium text-sm cursor-pointer bg-zinc-50 rounded-t-lg">
              Payload
            </summary>
            <pre className="p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(decoded.payload, (key, value) => {
                // Format timestamps
                if (
                  (key === "exp" || key === "iat" || key === "nbf") &&
                  typeof value === "number"
                ) {
                  return `${value} (${formatJwtTimestamp(value)})`;
                }
                return value;
              }, 2)}
            </pre>
          </details>

          {/* Signature */}
          <details className="border rounded-lg">
            <summary className="p-3 font-medium text-sm cursor-pointer bg-zinc-50 rounded-t-lg">
              Signature (raw)
            </summary>
            <pre className="p-3 text-xs font-mono text-zinc-500 break-all whitespace-pre-wrap">
              {decoded.signature}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
