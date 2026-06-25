export interface DiscountResult {
  discountAmount: number;
  finalPrice: number;
  savingsPercent: number;
}

/**
 * Calculate the final price after applying a discount percentage.
 */
export function calcDiscountedPrice(originalPrice: number, discountPercent: number): DiscountResult {
  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - discountAmount;

  return {
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
    savingsPercent: discountPercent,
  };
}

/**
 * Calculate discount percentage given original and final prices.
 */
export function calcDiscountPercent(originalPrice: number, finalPrice: number): DiscountResult {
  const discountAmount = originalPrice - finalPrice;
  const savingsPercent = (discountAmount / originalPrice) * 100;

  return {
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: finalPrice,
    savingsPercent: Math.round(savingsPercent * 100) / 100,
  };
}
