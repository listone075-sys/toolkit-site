"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Generic hook for persisting state in localStorage.
 * SSR-safe — returns defaultValue during server render, hydrates on mount.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch {
      // Corrupt data or quota exceeded — keep default
    }
    setHydrated(true);
  }, [key]);

  const set = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof newValue === "function"
            ? (newValue as (prev: T) => T)(prev)
            : newValue;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Quota exceeded — silently fail (state still updates in-memory)
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set, hydrated] as const;
}
