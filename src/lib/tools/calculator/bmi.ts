export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  minHealthyWeight: number;
  maxHealthyWeight: number;
}

export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

/**
 * Calculate BMI from weight (kg) and height (cm).
 * BMI = weight / (height/100)²
 */
export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  if (heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: "normal", minHealthyWeight: 0, maxHealthyWeight: 0 };
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  let category: BmiCategory;
  if (bmi < 18.5) {
    category = "underweight";
  } else if (bmi < 25) {
    category = "normal";
  } else if (bmi < 30) {
    category = "overweight";
  } else {
    category = "obese";
  }

  // Calculate healthy weight range for this height
  const minHealthyWeight = 18.5 * heightM * heightM;
  const maxHealthyWeight = 24.9 * heightM * heightM;

  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    minHealthyWeight: Math.round(minHealthyWeight * 10) / 10,
    maxHealthyWeight: Math.round(maxHealthyWeight * 10) / 10,
  };
}

/**
 * Get human-readable name for BMI category.
 */
export function getBmiCategoryLabel(category: BmiCategory): string {
  switch (category) {
    case "underweight": return "Underweight";
    case "normal": return "Normal Weight";
    case "overweight": return "Overweight";
    case "obese": return "Obese";
  }
}
