export interface LoanInput {
  /** Loan amount (principal) */
  amount: number;
  /** Annual interest rate in percent (e.g., 5.5 for 5.5%) */
  annualRate: number;
  /** Loan term in years */
  termYears: number;
}

export interface LoanResult {
  /** Monthly payment */
  monthlyPayment: number;
  /** Total payment over the loan term */
  totalPayment: number;
  /** Total interest paid */
  totalInterest: number;
  /** Monthly interest rate */
  monthlyRate: number;
  /** Total number of payments */
  totalPayments: number;
  /** Amortization schedule */
  schedule: AmortizationRow[];
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

/**
 * Calculate loan details using the amortization formula.
 *
 * Monthly Payment = P × r × (1+r)^n / ((1+r)^n − 1)
 * Where:
 *   P = principal (loan amount)
 *   r = monthly interest rate (annual rate / 12 / 100)
 *   n = total number of payments (years × 12)
 */
export function calculateLoan(input: LoanInput): LoanResult {
  if (input.amount <= 0 || input.annualRate < 0 || input.termYears <= 0) {
    return {
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      monthlyRate: 0,
      totalPayments: 0,
      schedule: [],
    };
  }

  const monthlyRate = input.annualRate / 12 / 100;
  const totalPayments = Math.round(input.termYears * 12);

  // Edge case: 0% interest
  if (monthlyRate === 0) {
    const monthlyPayment = input.amount / totalPayments;
    const schedule = buildSchedule(input.amount, monthlyPayment, 0, totalPayments);
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: input.amount,
      totalInterest: 0,
      monthlyRate: 0,
      totalPayments,
      schedule,
    };
  }

  const powTerm = Math.pow(1 + monthlyRate, totalPayments);
  const monthlyPayment = (input.amount * monthlyRate * powTerm) / (powTerm - 1);
  const totalPayment = monthlyPayment * totalPayments;
  const totalInterest = totalPayment - input.amount;

  const schedule = buildSchedule(input.amount, monthlyPayment, monthlyRate, totalPayments);

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    monthlyRate,
    totalPayments,
    schedule,
  };
}

function buildSchedule(
  principal: number,
  payment: number,
  monthlyRate: number,
  totalPayments: number,
): AmortizationRow[] {
  const schedule: AmortizationRow[] = [];
  let balance = principal;
  const roundedPayment = Math.round(payment * 100) / 100;

  for (let i = 1; i <= totalPayments; i++) {
    const interest = balance * monthlyRate;
    const principalPart = payment - interest;
    balance = Math.max(0, balance - principalPart);

    schedule.push({
      month: i,
      payment: roundedPayment,
      principal: Math.round(principalPart * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      remainingBalance: Math.round(balance * 100) / 100,
    });
  }

  return schedule;
}
