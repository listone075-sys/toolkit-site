import { toolRegistry as enRegistry } from "./registry/en";
import { toolRegistry as zhRegistry } from "./registry/zh";
import type { ToolConfig } from "./types";

const registries: Record<string, ToolConfig[]> = {
  en: enRegistry,
  zh: zhRegistry,
};

/**
 * Get a tool config by slug (locale-aware).
 * Unlike the list-oriented getters, this does NOT filter hidden tools —
 * it's used by the dynamic tool page route which may need to resolve
 * deprecated slugs before the Next.js redirect kicks in.
 */
export function getToolBySlug(slug: string, locale = "en"): ToolConfig | undefined {
  return (registries[locale] ?? registries.en).find((tool) => tool.slug === slug);
}

/**
 * Map of deprecated/redirected tool slugs to their replacement.
 * Used by favorites, recent, and continue-working sections to migrate
 * user bookmarks and history from old standalone tools to the new workbench.
 */
const DEPRECATED_SLUG_MAP: Record<string, string> = {
  "markdown-to-html": "markdown",
  "markdown-editor": "markdown",
  "markdown-table-generator": "markdown",
  "markdown-to-docx": "markdown",
  "markdown-to-pptx": "markdown",
  "docx-to-markdown": "markdown",
  "html-to-markdown": "markdown",
  // "markdown-formatter" — now a visible standalone AI cleanup tool
  // "markdown-to-pdf" — now a visible standalone tool
  "url-to-markdown": "markdown",
};

/**
 * Resolve a slug that may be deprecated into its current replacement.
 * Non-deprecated slugs are returned unchanged.
 */
export function resolveDeprecatedSlug(slug: string): string {
  return DEPRECATED_SLUG_MAP[slug] ?? slug;
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
