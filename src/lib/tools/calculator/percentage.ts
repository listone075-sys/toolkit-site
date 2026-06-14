/**
 * Calculate what is X% of Y
 * e.g. What is 20% of 150? → 30
 */
export function percentOf(percent: number, total: number): number {
  return (percent / 100) * total;
}

/**
 * Calculate X is what percent of Y
 * e.g. 30 is what percent of 150? → 20%
 */
export function isWhatPercent(part: number, total: number): number {
  if (total === 0) throw new Error("Total cannot be zero");
  return (part / total) * 100;
}

/**
 * Calculate percentage increase/decrease
 * e.g. From 100 to 120 → +20%
 */
export function percentChange(from: number, to: number): { percent: number; direction: "increase" | "decrease" } {
  if (from === 0) throw new Error("Original value cannot be zero");
  const change = ((to - from) / Math.abs(from)) * 100;
  return {
    percent: Math.abs(change),
    direction: change >= 0 ? "increase" : "decrease",
  };
}

/**
 * Add X% to a value
 * e.g. 150 + 20% → 180
 */
export function addPercent(base: number, percent: number): number {
  return base * (1 + percent / 100);
}

/**
 * Subtract X% from a value
 * e.g. 150 - 20% → 120
 */
export function subtractPercent(base: number, percent: number): number {
  return base * (1 - percent / 100);
}

/**
 * Calculate the original price before discount
 * e.g. Price after 20% off is 80, what was original? → 100
 */
export function originalBeforeDiscount(finalPrice: number, discountPercent: number): number {
  if (discountPercent >= 100) throw new Error("Discount cannot be 100% or more");
  return finalPrice / (1 - discountPercent / 100);
}
