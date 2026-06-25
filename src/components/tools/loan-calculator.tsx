"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateLoan } from "@/lib/tools/calculator/loan";
import type { LoanResult } from "@/lib/tools/calculator/loan";
import { RefreshCw } from "lucide-react";

export function LoanCalculator() {
  const t = useTranslations("components");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<LoanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const p = Number(amount);
    const r = Number(rate);
    const y = Number(years);
    if (!p || p <= 0 || isNaN(r) || r < 0 || !y || y <= 0) {
      setError("Please enter valid loan details.");
      setResult(null);
      return;
    }
    setResult(calculateLoan({ amount: p, annualRate: r, termYears: y }));
  };

  const handleReset = () => {
    setAmount("");
    setRate("");
    setYears("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">Loan Amount ($)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 250000"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">Annual Rate (%)</label>
          <Input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g. 5.5"
            step="0.1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">Term (Years)</label>
          <Input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="e.g. 30"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={handleCalculate}>Calculate</Button>
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-1" /> Reset
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-800">${result.monthlyPayment.toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-1">Monthly Payment</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-800">${result.totalInterest.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">Total Interest</p>
            </div>
            <div className="bg-zinc-50 rounded-lg p-4 text-center border">
              <p className="text-2xl font-bold text-zinc-800">${result.totalPayment.toLocaleString()}</p>
              <p className="text-sm text-zinc-600 mt-1">Total Payment</p>
            </div>
          </div>

          {/* Amortization table (first year summary) */}
          {result.schedule.length > 0 && (
            <details className="border rounded-lg">
              <summary className="p-3 font-medium text-sm cursor-pointer bg-zinc-50 rounded-t-lg">
                Amortization Schedule (First 12 Months)
              </summary>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-zinc-50">
                      <th className="p-2 text-left">Month</th>
                      <th className="p-2 text-right">Payment</th>
                      <th className="p-2 text-right">Principal</th>
                      <th className="p-2 text-right">Interest</th>
                      <th className="p-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.slice(0, 12).map((row) => (
                      <tr key={row.month} className="border-b">
                        <td className="p-2">{row.month}</td>
                        <td className="p-2 text-right">${row.payment.toLocaleString()}</td>
                        <td className="p-2 text-right">${row.principal.toLocaleString()}</td>
                        <td className="p-2 text-right">${row.interest.toLocaleString()}</td>
                        <td className="p-2 text-right">${row.remainingBalance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
