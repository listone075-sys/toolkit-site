export interface JwtHeader {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

export interface JwtPayload {
  [key: string]: unknown;
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}

export interface DecodedJwt {
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
  isValidStructure: boolean;
}

/**
 * Decode a JWT token without verification.
 * Returns the decoded header, payload, and raw signature.
 */
export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");

  if (parts.length !== 3) {
    return {
      header: {},
      payload: {},
      signature: "",
      isValidStructure: false,
    };
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    return {
      header,
      payload,
      signature: parts[2],
      isValidStructure: true,
    };
  } catch {
    return {
      header: {},
      payload: {},
      signature: "",
      isValidStructure: false,
    };
  }
}

/**
 * Decode a base64url-encoded string.
 */
function base64UrlDecode(str: string): string {
  // Replace URL-safe chars and pad
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
  } catch {
    // Fallback: try without decodeURIComponent for binary content
    return atob(base64);
  }
}

/**
 * Format a Unix timestamp to a human-readable date string.
 */
export function formatJwtTimestamp(ts: number): string {
  const date = new Date(ts * 1000);
  return date.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC");
}

/**
 * Check if a JWT token is expired based on the 'exp' claim.
 */
export function isJwtExpired(payload: JwtPayload): boolean {
  if (!payload.exp) return false;
  return payload.exp * 1000 < Date.now();
}
