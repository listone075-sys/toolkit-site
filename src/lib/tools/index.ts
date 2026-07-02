import { toolRegistry as enRegistry } from "./registry/en";
import { toolRegistry as zhRegistry } from "./registry/zh";
import type { ToolConfig } from "./types";

const registries: Record<string, ToolConfig[]> = {
  en: enRegistry,
  zh: zhRegistry,
};

/**
 * Get a tool config by slug (locale-aware)
 */
export function getToolBySlug(slug: string, locale = "en"): ToolConfig | undefined {
  return (registries[locale] ?? registries.en).find((tool) => tool.slug === slug);
}

/**
 * Get all tool slugs (language-agnostic — slugs are the same across locales).
 * Hidden tools (deprecated/redirected) are excluded.
 */
export function getAllToolSlugs(): string[] {
  return registries.en.filter((tool) => !tool.hidden).map((tool) => tool.slug);
}

/**
 * Get tools filtered by category (locale-aware).
 * Hidden tools (deprecated/redirected) are excluded.
 */
export function getToolsByCategory(category: ToolConfig["category"], locale = "en"): ToolConfig[] {
  return (registries[locale] ?? registries.en).filter((tool) => tool.category === category && !tool.hidden);
}

/**
 * Get the full tool registry for a locale.
 * Hidden tools (deprecated/redirected) are excluded.
 */
export function getToolRegistry(locale = "en"): ToolConfig[] {
  return (registries[locale] ?? registries.en).filter((tool) => !tool.hidden);
}

// Default English registry for backward compatibility
export const toolRegistry: ToolConfig[] = enRegistry;
