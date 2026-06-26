export interface ShareState {
  tool: string;
  params: Record<string, string | number | boolean>;
}

export interface ShareConfig {
  toolSlug: string;
  shareText: string;
  shareParams?: Record<string, string | number | boolean>;
  /** If the output is an image, Pinterest share is enabled */
  isImage?: boolean;
}
