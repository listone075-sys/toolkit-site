"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateQrCode } from "@/lib/tools/dev/qrcode";
import { downloadFile } from "@/lib/utils/file";
import { QrCode, Download } from "lucide-react";

export function QrCodeGenerator() {
  const t = useTranslations("components");
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) { setError(t("qrCodeGenerator.errorEmpty")); return; }
    setLoading(true); setError(null);
    try {
      const url = await generateQrCode({ text: text.trim() });
      setQrDataUrl(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [text]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    fetch(qrDataUrl).then(r => r.blob()).then(b => downloadFile(b, "qrcode.png", "image/png"));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border">
        <Input
          placeholder={t("qrCodeGenerator.placeholder")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          className="flex-1"
        />
        <Button onClick={handleGenerate} disabled={loading} className="shrink-0 gap-2">
          <QrCode className="h-4 w-4" />
          {loading ? t("qrCodeGenerator.generating") : t("qrCodeGenerator.generate")}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="border rounded-lg p-6 flex items-center justify-center min-h-[320px] bg-white">
        {qrDataUrl ? (
          <div className="text-center space-y-4">
            <img src={qrDataUrl} alt="QR Code" className="max-w-[280px] mx-auto border rounded" />
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" /> {t("qrCodeGenerator.download")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <QrCode className="h-16 w-16 text-zinc-200 mx-auto mb-3" />
            <p className="text-sm text-zinc-400">{t("qrCodeGenerator.emptyState")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
