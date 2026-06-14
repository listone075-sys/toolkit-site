export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const CHARS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

/**
 * Generate a secure random password
 */
export function generatePassword(options: PasswordOptions): string {
  const { length, uppercase, lowercase, numbers, symbols } = options;

  const selected = [
    ...(uppercase ? [CHARS.uppercase] : []),
    ...(lowercase ? [CHARS.lowercase] : []),
    ...(numbers ? [CHARS.numbers] : []),
    ...(symbols ? [CHARS.symbols] : []),
  ];

  if (selected.length === 0) throw new Error("Select at least one character type");

  const pool = selected.join("");
  const randomValues = crypto.getRandomValues(new Uint32Array(length));

  let result = "";
  for (let i = 0; i < length; i++) {
    result += pool[randomValues[i] % pool.length];
  }

  return result;
}

/**
 * Estimate password strength
 */
export function estimateStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 5) return { score, label: "Very Strong", color: "text-green-600" };
  if (score >= 4) return { score, label: "Strong", color: "text-green-500" };
  if (score >= 3) return { score, label: "Moderate", color: "text-amber-500" };
  return { score, label: "Weak", color: "text-red-500" };
}
