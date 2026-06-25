"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculateAge } from "@/lib/tools/calculator/age";
import { Calendar, RefreshCw } from "lucide-react";

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-blue-50 rounded-lg p-3 text-center">
      <p className="text-xs text-blue-600 font-medium mb-1">{label}</p>
      <p className="text-xl font-bold text-blue-800">{value}</p>
    </div>
  );
}

export function AgeCalculator() {
  const t = useTranslations("components");
  const [birthDate, setBirthDate] = useState("");
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [result, setResult] = useState<ReturnType<typeof calculateAge> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    if (!birthDate) {
      setError(t("ageCalculator.enterDate"));
      setResult(null);
      return;
    }
    const birth = new Date(birthDate);
    const to = new Date(toDate);
    if (isNaN(birth.getTime()) || isNaN(to.getTime())) {
      setError(t("ageCalculator.invalidDate"));
      setResult(null);
      return;
    }
    if (birth > to) {
      setError(t("ageCalculator.futureDate"));
      setResult(null);
      return;
    }
    setResult(calculateAge(birth, to));
  };

  const handleReset = () => {
    setBirthDate("");
    setToDate(new Date().toISOString().split("T")[0]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            {t("ageCalculator.birthDate")}
          </label>
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={toDate}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            {t("ageCalculator.toDate")}
          </label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button onClick={handleCalculate}>
          {t("ageCalculator.calculate")}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-1" /> {t("ageCalculator.reset")}
        </Button>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Results */}
      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <ResultCard label={t("ageCalculator.years")} value={`${result.years}`} />
            <ResultCard label={t("ageCalculator.months")} value={`${result.months}`} />
            <ResultCard label={t("ageCalculator.days")} value={`${result.days}`} />
            <ResultCard label={t("ageCalculator.totalDays")} value={result.totalDays.toLocaleString()} />
            <ResultCard label={t("ageCalculator.totalMonths")} value={result.totalMonths.toLocaleString()} />
            <ResultCard label={t("ageCalculator.totalWeeks")} value={result.totalWeeks.toLocaleString()} />
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-100">
            <p className="text-sm text-amber-700">
              🎂 {t("ageCalculator.nextBirthday")}:{" "}
              <strong>{result.nextBirthday.toLocaleDateString()}</strong>
              {" "}({result.daysUntilBirthday} {t("ageCalculator.daysAway")})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
