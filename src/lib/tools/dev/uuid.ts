/**
 * Generate a single UUID v4
 */
export function generateUuidV4(): string {
  return crypto.randomUUID();
}

/**
 * Generate multiple UUIDs
 */
export function generateUuids(count: number): string[] {
  return Array.from({ length: Math.min(count, 1000) }, () => crypto.randomUUID());
}

/**
 * Validate a UUID string
 */
export function isValidUuid(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}
