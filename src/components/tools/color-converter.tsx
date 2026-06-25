"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  hexToRgb, rgbToHex, rgbToHsl, hslToRgb, hslToHex, hexToHsl,
  parseRgbString, parseHslString,
} from "@/lib/tools/dev/color-converter";
import type { RgbColor, HslColor } from "@/lib/tools/dev/color-converter";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { Copy, Check } from "lucide-react";

export function ColorConverter() {
  const t = useTranslations("components");
  const [hexInput, setHexInput] = useState("");
  const [rgbInput, setRgbInput] = useState("");
  const [hslInput, setHslInput] = useState("");
  const [hex, setHex] = useState("");
  const [rgb, setRgb] = useState<RgbColor | null>(null);
  const [hsl, setHsl] = useState<HslColor | null>(null);
  const [previewColor, setPreviewColor] = useState("#6366f1");
  const [error, setError] = useState<string | null>(null);

  const updateFromHex = useCallback((value: string) => {
    setHexInput(value);
    setError(null);
    const parsed = hexToRgb(value);
    if (parsed) {
      setHex(value.startsWith("#") ? value : `#${value}`);
      setRgb(parsed);
      setHsl(rgbToHsl(parsed));
      setPreviewColor(value.startsWith("#") ? value : `#${value}`);
    }
  }, []);

  const updateFromRgb = useCallback((value: string) => {
    setRgbInput(value);
    setError(null);
    const parsed = parseRgbString(value);
    if (parsed && parsed.r <= 255 && parsed.g <= 255 && parsed.b <= 255) {
      const hexVal = rgbToHex(parsed);
      setHex(hexVal);
      setRgb(parsed);
      setHsl(rgbToHsl(parsed));
      setPreviewColor(hexVal);
    }
  }, []);

  const updateFromHsl = useCallback((value: string) => {
    setHslInput(value);
    setError(null);
    const parsed = parseHslString(value);
    if (parsed) {
      const rgbVal = hslToRgb(parsed);
      const hexVal = rgbToHex(rgbVal);
      setHex(hexVal);
      setRgb(rgbVal);
      setHsl(parsed);
      setPreviewColor(hexVal);
    }
  }, []);

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
  };

  return (
    <div className="space-y-4">
      {/* Color preview */}
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <div
          className="w-16 h-16 rounded-lg border shadow-sm shrink-0"
          style={{ backgroundColor: previewColor }}
        />
        <div className="space-y-1 text-sm">
          {hex && <p><span className="text-zinc-500">{t("colorConverter.hex")}:</span> <code className="font-mono">{hex}</code></p>}
          {rgb && <p><span className="text-zinc-500">{t("colorConverter.rgb")}:</span> <code className="font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</code></p>}
          {hsl && <p><span className="text-zinc-500">{t("colorConverter.hsl")}:</span> <code className="font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code></p>}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-1">{t("colorConverter.hex")}</label>
          <Input
            value={hexInput}
            onChange={(e) => updateFromHex(e.target.value)}
            placeholder="#1a2b3c"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-1">{t("colorConverter.rgb")}</label>
          <Input
            value={rgbInput}
            onChange={(e) => updateFromRgb(e.target.value)}
            placeholder="rgb(255, 128, 0)"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-1">{t("colorConverter.hsl")}</label>
          <Input
            value={hslInput}
            onChange={(e) => updateFromHsl(e.target.value)}
            placeholder="hsl(200, 80%, 50%)"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Copy buttons */}
      {(hex || rgb || hsl) && (
        <div className="flex flex-wrap gap-2">
          {hex && (
            <Button size="sm" variant="outline" onClick={() => handleCopy(hex)}>
              <Copy className="h-3 w-3 mr-1" /> {t("colorConverter.copyHex")}
            </Button>
          )}
          {rgb && (
            <Button size="sm" variant="outline" onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}>
              <Copy className="h-3 w-3 mr-1" /> {t("colorConverter.copyRgb")}
            </Button>
          )}
          {hsl && (
            <Button size="sm" variant="outline" onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}>
              <Copy className="h-3 w-3 mr-1" /> {t("colorConverter.copyHsl")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
