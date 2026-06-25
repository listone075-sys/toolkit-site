/**
 * HTML Entity encode/decode with support for named entities, decimal, and hex entities.
 */

// Security-critical characters always encoded in every mode
const SECURITY_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

// Additional common named HTML entities (used in named mode and encodeAll)
const NAMED_ENTITIES: Record<string, string> = {
  ...SECURITY_ENTITIES,
  "`": "&#96;",
  "¢": "&cent;",
  "£": "&pound;",
  "¥": "&yen;",
  "€": "&euro;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "—": "&mdash;",
  "–": "&ndash;",
  "•": "&bull;",
  "…": "&hellip;",
  "″": "&Prime;",
  "′": "&prime;",
  "‹": "&lsaquo;",
  "›": "&rsaquo;",
  "«": "&laquo;",
  "»": "&raquo;",
  "¡": "&iexcl;",
  "¿": "&iquest;",
  "§": "&sect;",
  "¶": "&para;",
  "°": "&deg;",
  "±": "&plusmn;",
  "÷": "&divide;",
  "×": "&times;",
  "≠": "&ne;",
  "≤": "&le;",
  "≥": "&ge;",
  "≈": "&asymp;",
  "∞": "&infin;",
  "←": "&larr;",
  "→": "&rarr;",
  "↑": "&uarr;",
  "↓": "&darr;",
  "↔": "&harr;",
  "♠": "&spades;",
  "♣": "&clubs;",
  "♥": "&hearts;",
  "♦": "&diams;",
  "★": "&starf;",
  "☆": "&star;",
};

// Reverse lookup for decoding
const ENTITY_TO_CHAR: Record<string, string> = {};
for (const [char, entity] of Object.entries(NAMED_ENTITIES)) {
  ENTITY_TO_CHAR[entity] = char;
}

/**
 * Encode text to HTML entities.
 * Options:
 * - mode: "named" (use named entities where available), "decimal" (&#xxx;), "hex" (&#xXX;)
 * - encodeAll: encode all characters, not just special ones
 */
export function encodeHtmlEntities(
  text: string,
  options?: { mode?: "named" | "decimal" | "hex"; encodeAll?: boolean },
): string {
  const mode = options?.mode ?? "named";
  const encodeAll = options?.encodeAll ?? false;

  if (encodeAll) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (mode === "named" && NAMED_ENTITIES[char]) {
        result += NAMED_ENTITIES[char];
      } else if (mode === "hex") {
        result += `&#x${char.codePointAt(0)!.toString(16).toUpperCase()};`;
      } else {
        result += `&#${char.codePointAt(0)};`;
      }
    }
    return result;
  }

  // Encode HTML-sensitive characters (OWASP-recommended: & < > " ')
  // Always encode security-critical chars regardless of mode
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (SECURITY_ENTITIES[char]) {
      result += SECURITY_ENTITIES[char];
    } else if (mode === "named" && NAMED_ENTITIES[char]) {
      result += NAMED_ENTITIES[char];
    } else {
      result += char;
    }
  }
  return result;
}

/**
 * Decode HTML entities back to plain text.
 * Supports named entities, decimal (&#xxx;), and hex (&#xXX;) entities.
 */
function safeCodePoint(code: number): string {
  try {
    return String.fromCodePoint(code);
  } catch {
    return `&#${code};`; // Preserve invalid entity as-is
  }
}

export function decodeHtmlEntities(text: string): string {
  // Hex entities &#xXX;
  let result = text.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    safeCodePoint(parseInt(hex, 16)),
  );

  // Decimal entities &#xxx;
  result = result.replace(/&#(\d+);/g, (_, dec) =>
    safeCodePoint(parseInt(dec, 10)),
  );

  // Named entities &xxx;
  for (const [entity, char] of Object.entries(ENTITY_TO_CHAR)) {
    result = result.split(entity).join(char);
  }

  return result;
}
