export interface TipInput {
  /** Bill amount */
  billAmount: number;
  /** Tip percentage (e.g., 15 for 15%) */
  tipPercent: number;
  /** Number of people splitting the bill (default 1) */
  people?: number;
}

export interface TipResult {
  /** Tip amount */
  tipAmount: number;
  /** Total bill including tip */
  totalAmount: number;
  /** Tip per person */
  tipPerPerson: number;
  /** Total per person */
  totalPerPerson: number;
  /** Number of people */
  people: number;
}

/**
 * Calculate tip amount and split.
 */
export function calculateTip(input: TipInput): TipResult {
  const people = Math.max(1, input.people ?? 1);

  if (input.billAmount <= 0 || input.tipPercent < 0) {
    return {
      tipAmount: 0,
      totalAmount: 0,
      tipPerPerson: 0,
      totalPerPerson: 0,
      people,
    };
  }

  const tipAmount = input.billAmount * (input.tipPercent / 100);
  const totalAmount = input.billAmount + tipAmount;

  return {
    tipAmount: Math.round(tipAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    tipPerPerson: Math.round((tipAmount / people) * 100) / 100,
    totalPerPerson: Math.round((totalAmount / people) * 100) / 100,
    people,
  };
}

/** Common tip rates by country/region */
export const TIP_RATES: { label: string; rates: number[] }[] = [
  { label: "🇺🇸 United States", rates: [10, 15, 18, 20, 25] },
  { label: "🇨🇦 Canada", rates: [10, 15, 18, 20] },
  { label: "🇬🇧 United Kingdom", rates: [10, 12.5, 15] },
  { label: "🇦🇺 Australia", rates: [5, 10, 15] },
  { label: "🇯🇵 Japan", rates: [0, 5, 10] },
  { label: "🇪🇺 Europe", rates: [5, 10, 15] },
];
