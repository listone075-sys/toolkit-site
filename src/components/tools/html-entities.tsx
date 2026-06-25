"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { encodeHtmlEntities, decodeHtmlEntities } from "@/lib/tools/dev/html-entities";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { ArrowLeftRight, Copy, Check, X } from "lucide-react";

export function HtmlEntities() {
  const t = useTranslations("components");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    if (mode === "encode") {
      setOutput(encodeHtmlEntities(input, { mode: "named" }));
    } else {
      setOutput(decodeHtmlEntities(input));
    }
  };

  const handleSwap = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(output);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1500); }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setCopied(false);
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button onClick={() => { setMode("encode"); setOutput(""); }} variant={mode === "encode" ? "default" : "outline"} size="sm">
          {t("htmlEntities.encode")}
        </Button>
        <Button onClick={() => { setMode("decode"); setOutput(""); }} variant={mode === "decode" ? "default" : "outline"} size="sm">
          {t("htmlEntities.decode")}
        </Button>
        <Button onClick={handleSwap} variant="ghost" size="sm" title={t("htmlEntities.swap")}>
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button onClick={handleProcess} size="sm">{mode === "encode" ? t("htmlEntities.encode") : t("htmlEntities.decode")}</Button>
        <Button onClick={handleClear} variant="ghost" size="sm">
          <X className="h-4 w-4 mr-1" /> {t("htmlEntities.clear")}
        </Button>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-600 mb-2">{mode === "encode" ? t("htmlEntities.plainText") : t("htmlEntities.encodedString")}</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? t("htmlEntities.encodePlaceholder") : t("htmlEntities.decodePlaceholder")}
            className="w-full h-48 p-3 text-sm font-mono border rounded-lg resize-y"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-zinc-600">{mode === "encode" ? t("htmlEntities.encodedOutput") : t("htmlEntities.decodedText")}</p>
            <Button size="sm" variant="ghost" onClick={handleCopy} disabled={!output}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={mode === "encode" ? t("htmlEntities.encodeOutputPlaceholder") : t("htmlEntities.decodeOutputPlaceholder")}
            className="w-full h-48 p-3 text-sm font-mono border rounded-lg resize-y bg-zinc-50"
          />
        </div>
      </div>
    </div>
  );
}
