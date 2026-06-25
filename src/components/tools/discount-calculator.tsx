"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { calcDiscountedPrice } from "@/lib/tools/calculator/discount";

function ResultCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-3 text-center border ${highlight ? "bg-green-50 border-green-200" : "bg-zinc-50"}`}>
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${highlight ? "text-green-700" : "text-zinc-900"}`}>{value}</p>
    </div>
  );
}

export function DiscountCalculator() {
  const t = useTranslations("components");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const result =
    originalPrice && discountPercent
      ? calcDiscountedPrice(Number(originalPrice), Number(discountPercent))
      : null;

  // Validate inputs
  if (result && (isNaN(result.finalPrice) || Number(originalPrice) <= 0)) {
    if (!error) setError(t("discountCalculator.invalidInput"));
  } else if (error && result && !isNaN(result.finalPrice)) {
    setError(null);
  }

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">
            {t("discountCalculator.originalPrice")}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">$</span>
            <Input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="e.g. 100"
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">
            {t("discountCalculator.discountPercent")}
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="e.g. 20"
              className="flex-1"
            />
            <span className="text-sm text-zinc-500">%</span>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Results */}
      {result && !isNaN(result.finalPrice) && Number(originalPrice) > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ResultCard
            label={t("discountCalculator.youSave")}
            value={`$${result.discountAmount.toFixed(2)}`}
          />
          <ResultCard
            label={t("discountCalculator.finalPrice")}
            value={`$${result.finalPrice.toFixed(2)}`}
            highlight
          />
          <ResultCard
            label={t("discountCalculator.savingsPercent")}
            value={`${result.savingsPercent}%`}
          />
        </div>
      )}
    </div>
  );
}
