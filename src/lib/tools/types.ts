export type ToolCategory = "image" | "pdf" | "markdown" | "dev" | "calculator";

export interface ToolConfig {
  /** URL path segment, e.g. "heic-to-jpg" */
  slug: string;
  /** Page title, e.g. "HEIC to JPG Converter" */
  title: string;
  /** Meta description for SEO */
  description: string;
  /** Tool category for grouping */
  category: ToolCategory;
  /** Target SEO keywords */
  keywords: string[];
  /** Display-only: estimated monthly search volume */
  searchVolume: string;
  /** Whether this tool runs entirely in the browser (no server cost) */
  isClientSide: boolean;
  /** Icon name from lucide-react to display */
  icon: string;
  /** Steps shown in HowTo structured data */
  howToUse: string[];
  /** FAQ items for structured data */
  faqs: { question: string; answer: string }[];
}

export interface ToolResult {
  success: boolean;
  data?: Blob | string;
  mimeType?: string;
  fileName?: string;
  error?: string;
}

export interface ToolProgress {
  stage: string;
  percent: number;
}
