"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateTip, TIP_RATES } from "@/lib/tools/calculator/tip";
import type { TipResult } from "@/lib/tools/calculator/tip";
import { RefreshCw, Users } from "lucide-react";

export function TipCalculator() {
  const t = useTranslations("components");
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState("1");
  const [result, setResult] = useState<TipResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const b = Number(bill);
    if (!b || b <= 0) {
      setError("Please enter a valid bill amount.");
      setResult(null);
      return;
    }
    setResult(
      calculateTip({
        billAmount: b,
        tipPercent,
        people: Math.max(1, parseInt(people) || 1),
      }),
    );
  };

  const handleReset = () => {
    setBill("");
    setTipPercent(15);
    setPeople("1");
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Bill input */}
      <div className="p-4 border rounded-lg space-y-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">Bill Amount ($)</label>
          <Input
            type="number"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            placeholder="e.g. 85.50"
            step="0.01"
          />
        </div>

        {/* Tip percentage quick select */}
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">Tip Percentage</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {[10, 15, 18, 20, 25].map((pct) => (
              <Button
                key={pct}
                variant={tipPercent === pct ? "default" : "outline"}
                size="sm"
                onClick={() => setTipPercent(pct)}
              >
                {pct}%
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={tipPercent}
              onChange={(e) => setTipPercent(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-zinc-500">% custom</span>
          </div>
        </div>

        {/* People split */}
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">
            <Users className="h-4 w-4 inline mr-1" /> Split Among
          </label>
          <Input
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            min="1"
            className="w-24"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={handleCalculate}>Calculate Tip</Button>
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-1" /> Reset
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Results */}
      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-800">${result.tipAmount.toFixed(2)}</p>
              <p className="text-sm text-blue-600 mt-1">Tip Amount</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-800">${result.totalAmount.toFixed(2)}</p>
              <p className="text-sm text-green-600 mt-1">Total Bill</p>
            </div>
            <div className="bg-zinc-50 rounded-lg p-4 text-center border">
              <p className="text-2xl font-bold text-zinc-800">${result.tipPerPerson.toFixed(2)}</p>
              <p className="text-sm text-zinc-600 mt-1">Tip / Person</p>
            </div>
            <div className="bg-zinc-50 rounded-lg p-4 text-center border">
              <p className="text-2xl font-bold text-zinc-800">${result.totalPerPerson.toFixed(2)}</p>
              <p className="text-sm text-zinc-600 mt-1">Total / Person</p>
            </div>
          </div>

          {/* Country reference */}
          <details className="border rounded-lg">
            <summary className="p-3 font-medium text-sm cursor-pointer bg-zinc-50 rounded-t-lg">
              Common Tip Rates by Country
            </summary>
            <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-2">
              {TIP_RATES.map((country) => (
                <div key={country.label} className="text-sm">
                  <span className="font-medium">{country.label}</span>
                  <span className="text-zinc-500 ml-1">
                    {country.rates.map((r) => `${r}%`).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
