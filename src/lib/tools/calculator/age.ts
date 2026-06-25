export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  totalWeeks: number;
  nextBirthday: Date;
  daysUntilBirthday: number;
}

/**
 * Calculate precise age from a birth date to a given date (defaults to today).
 */
export function calculateAge(birthDate: Date, toDate: Date = new Date()): AgeResult {
  // Normalize to midnight for accurate day counting
  const birth = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  const to = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

  if (birth > to) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalMonths: 0,
      totalWeeks: 0,
      nextBirthday: birth,
      daysUntilBirthday: 0,
    };
  }

  // Years
  let years = to.getFullYear() - birth.getFullYear();

  // Months
  let months = to.getMonth() - birth.getMonth();
  if (months < 0 || (months === 0 && to.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  if (to.getDate() < birth.getDate()) {
    months--;
  }

  // Days since last monthiversary
  const lastMonthiversary = new Date(to.getFullYear(), to.getMonth(), birth.getDate());
  if (lastMonthiversary > to) {
    lastMonthiversary.setMonth(lastMonthiversary.getMonth() - 1);
  }
  const days = Math.floor((to.getTime() - lastMonthiversary.getTime()) / (1000 * 60 * 60 * 24));

  // Total days
  const totalDays = Math.floor((to.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

  // Total months
  const totalMonths = years * 12 + months;

  // Total weeks
  const totalWeeks = Math.floor(totalDays / 7);

  // Next birthday
  const nextBirthday = new Date(to.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday <= to) {
    nextBirthday.setFullYear(to.getFullYear() + 1);
  }
  const daysUntilBirthday = Math.floor(
    (nextBirthday.getTime() - to.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    years,
    months,
    days,
    totalDays,
    totalMonths,
    totalWeeks,
    nextBirthday,
    daysUntilBirthday,
  };
}
