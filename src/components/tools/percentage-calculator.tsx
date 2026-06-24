"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { percentOf, isWhatPercent, percentChange, addPercent, subtractPercent } from "@/lib/tools/calculator/percentage";

function ResultBox({ label, value, unit = "" }: { label: string; value: string; unit?: string }) {
  return (
    <div className="bg-blue-50 rounded-lg p-3 text-center">
      <p className="text-xs text-blue-600 font-medium mb-1">{label}</p>
      <p className="text-xl font-bold text-blue-800">{value}{unit}</p>
    </div>
  );
}

export function PercentageCalculator() {
  const t = useTranslations("components");
  // Tab state
  const [tab, setTab] = useState<"percentOf" | "isWhatPercent" | "change" | "addSub">("percentOf");
  const [calcError, setCalcError] = useState<string | null>(null);

  // Percent of
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  // Is what percent
  const [w1, setW1] = useState("");
  const [w2, setW2] = useState("");

  // Change
  const [c1, setC1] = useState("");
  const [c2, setC2] = useState("");

  // Add/sub
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [aMode, setAMode] = useState<"add" | "sub">("add");

  const tabs = [
    { key: "percentOf" as const, label: t("percentageCalculator.percentOf") },
    { key: "isWhatPercent" as const, label: t("percentageCalculator.isWhatPercent") },
    { key: "change" as const, label: t("percentageCalculator.percentChange") },
    { key: "addSub" as const, label: t("percentageCalculator.addSubtract") },
  ];

  let result: { label: string; value: string; unit: string } | null = null;

  if (tab === "percentOf" && p1 && p2) {
    const val = percentOf(Number(p1), Number(p2));
    if (isNaN(val)) {
      setCalcError(t("percentageCalculator.error"));
      result = null;
    } else {
      setCalcError(null);
      result = { label: `${p1}% of ${p2}`, value: val.toLocaleString(), unit: "" };
    }
  } else if (tab === "isWhatPercent" && w1 && w2) {
    try {
      result = { label: `${w1} is what % of ${w2}`, value: isWhatPercent(Number(w1), Number(w2)).toFixed(2), unit: "%" };
      setCalcError(null);
    } catch (e) {
      setCalcError((e as Error).message);
      result = null;
    }
  } else if (tab === "change" && c1 && c2) {
    try {
      const r = percentChange(Number(c1), Number(c2));
      result = {
        label: `From ${c1} to ${c2}`,
        value: `${r.direction === "increase" ? "+" : "−"}${r.percent.toFixed(2)}`,
        unit: "%",
      };
      setCalcError(null);
    } catch (e) {
      setCalcError((e as Error).message);
      result = null;
    }
  } else if (tab === "addSub" && a1 && a2) {
    const val = aMode === "add" ? addPercent(Number(a1), Number(a2)) : subtractPercent(Number(a1), Number(a2));
    if (isNaN(val)) {
      setCalcError(t("percentageCalculator.error"));
      result = null;
    } else {
      setCalcError(null);
      result = { label: `${a1} ${aMode === "add" ? "+" : "−"} ${a2}%`, value: val.toFixed(2), unit: "" };
    }
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100 rounded-lg p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setCalcError(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === t.key ? "bg-white shadow text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
        {tab === "percentOf" && (
          <>
            <div>
              <label className="text-sm text-zinc-600 block mb-1">{t("percentageCalculator.percent")}</label>
              <Input value={p1} onChange={(e) => setP1(e.target.value)} placeholder="e.g. 20" type="number" />
            </div>
            <div>
              <label className="text-sm text-zinc-600 block mb-1">{t("percentageCalculator.ofTotal")}</label>
              <Input value={p2} onChange={(e) => setP2(e.target.value)} placeholder="e.g. 150" type="number" />
            </div>
          </>
        )}
        {tab === "isWhatPercent" && (
          <>
            <div>
              <label className="text-sm text-zinc-600 block mb-1">{t("percentageCalculator.part")}</label>
              <Input value={w1} onChange={(e) => setW1(e.target.value)} placeholder="e.g. 30" type="number" />
            </div>
            <div>
              <label className="text-sm text-zinc-600 block mb-1">{t("percentageCalculator.ofTotal")}</label>
              <Input value={w2} onChange={(e) => setW2(e.target.value)} placeholder="e.g. 150" type="number" />
            </div>
          </>
        )}
        {tab === "change" && (
          <>
            <div>
              <label className="text-sm text-zinc-600 block mb-1">{t("percentageCalculator.from")}</label>
              <Input value={c1} onChange={(e) => setC1(e.target.value)} placeholder="e.g. 100" type="number" />
            </div>
            <div>
              <label className="text-sm text-zinc-600 block mb-1">{t("percentageCalculator.to")}</label>
              <Input value={c2} onChange={(e) => setC2(e.target.value)} placeholder="e.g. 120" type="number" />
            </div>
          </>
        )}
        {tab === "addSub" && (
          <>
            <div>
              <label className="text-sm text-zinc-600 block mb-1">{t("percentageCalculator.baseValue")}</label>
              <Input value={a1} onChange={(e) => setA1(e.target.value)} placeholder="e.g. 150" type="number" />
            </div>
            <div>
              <label className="text-sm text-zinc-600 block mb-1">{t("percentageCalculator.percent")}</label>
              <div className="flex gap-2">
                <Input value={a2} onChange={(e) => setA2(e.target.value)} placeholder="e.g. 20" type="number" />
                <button
                  onClick={() => setAMode(aMode === "add" ? "sub" : "add")}
                  className={`shrink-0 px-3 text-sm font-medium rounded-md border ${
                    aMode === "add" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {aMode === "add" ? "+" : "−"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Error */}
      {calcError && <p className="text-sm text-red-500 text-center">{calcError}</p>}

      {/* Result */}
      {result && <ResultBox label={result.label} value={result.value} unit={result.unit} />}
    </div>
  );
}
