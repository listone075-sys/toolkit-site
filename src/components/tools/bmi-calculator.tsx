"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculateBmi, getBmiCategoryLabel } from "@/lib/tools/calculator/bmi";
import type { BmiCategory, BmiResult } from "@/lib/tools/calculator/bmi";
import { RefreshCw } from "lucide-react";

const CATEGORY_COLORS: Record<BmiCategory, string> = {
  underweight: "bg-amber-100 text-amber-800 border-amber-200",
  normal: "bg-green-100 text-green-800 border-green-200",
  overweight: "bg-orange-100 text-orange-800 border-orange-200",
  obese: "bg-red-100 text-red-800 border-red-200",
};

const CATEGORY_BAR: { cat: BmiCategory; max: number; label: string }[] = [
  { cat: "underweight", max: 18.5, label: "< 18.5" },
  { cat: "normal", max: 25, label: "18.5–24.9" },
  { cat: "overweight", max: 30, label: "25–29.9" },
  { cat: "obese", max: 40, label: "≥ 30" },
];

export function BmiCalculator() {
  const t = useTranslations("components");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<BmiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w || h <= 0 || w <= 0) {
      setError(t("bmiCalculator.invalidInput"));
      setResult(null);
      return;
    }
    setResult(calculateBmi(w, h));
  };

  const handleReset = () => {
    setHeight("");
    setWeight("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">
            {t("bmiCalculator.height")}
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 170"
              className="flex-1"
            />
            <span className="text-sm text-zinc-500 shrink-0">cm</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">
            {t("bmiCalculator.weight")}
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 65"
              className="flex-1"
            />
            <span className="text-sm text-zinc-500 shrink-0">kg</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button onClick={handleCalculate}>{t("bmiCalculator.calculate")}</Button>
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-1" /> {t("bmiCalculator.reset")}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Result */}
      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-800">{result.bmi}</p>
              <p className="text-sm text-blue-600 mt-1">{t("bmiCalculator.yourBmi")}</p>
            </div>
            <div className={`rounded-lg p-4 text-center border ${CATEGORY_COLORS[result.category]}`}>
              <p className="text-2xl font-bold">{t(`bmiCalculator.${result.category}`)}</p>
              <p className="text-sm mt-1">{getBmiCategoryLabel(result.category)}</p>
            </div>
            <div className="bg-zinc-50 rounded-lg p-4 text-center border">
              <p className="text-sm text-zinc-600">
                {result.minHealthyWeight} – {result.maxHealthyWeight} kg
              </p>
              <p className="text-xs text-zinc-500 mt-1">{t("bmiCalculator.healthyRange")}</p>
            </div>
          </div>

          {/* Scale bar */}
          <div className="bg-zinc-100 rounded-full h-4 overflow-hidden flex">
            {CATEGORY_BAR.map(({ cat, max }) => (
              <div
                key={cat}
                className={`h-full transition-all ${CATEGORY_COLORS[cat].split(" ")[0]}`}
                style={{ width: `${((max - (cat === "underweight" ? 0 : CATEGORY_BAR[CATEGORY_BAR.findIndex(b => b.cat === cat) - 1]?.max ?? 0)) / 40) * 100}%` }}
              />
            ))}
            {/* Marker */}
            <div
              className="relative h-full w-0.5 bg-zinc-900"
              style={{ marginLeft: `${Math.min((result.bmi / 40) * 100, 100)}%`, position: "absolute" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
