export interface RegexMatch {
  index: number;
  text: string;
  groups: string[];
}

/**
 * Test a regex pattern against input text and return all matches.
 */
export function testRegex(input: string, pattern: string, flags: string): RegexMatch[] {
  if (!pattern) return [];

  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];
    let match: RegExpExecArray | null;

    if (flags.includes("g")) {
      while ((match = regex.exec(input)) !== null) {
        matches.push({
          index: match.index,
          text: match[0],
          groups: match.slice(1),
        });
        // Prevent infinite loop on zero-length matches
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
    } else {
      match = regex.exec(input);
      if (match) {
        matches.push({
          index: match.index,
          text: match[0],
          groups: match.slice(1),
        });
      }
    }

    return matches;
  } catch {
    return [];
  }
}

/**
 * Validate a regex pattern and return error message if invalid.
 */
export function validateRegex(pattern: string): string | null {
  if (!pattern) return null;
  try {
    new RegExp(pattern);
    return null;
  } catch (e) {
    return (e as Error).message;
  }
}
