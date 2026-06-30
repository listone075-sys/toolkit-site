# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js 16 Breaking Changes

This project uses Next.js 16.2 with significant API changes from older versions. Key differences:
- `params` is a `Promise<T>` — use `await params` in server components, `use(params)` in client components
- Turbopack is the default bundler
- Tailwind CSS v4 with `@tailwindcss/postcss`

## Commands

```bash
npm run dev          # Start dev server (default port 3000)
npm run build        # Production build (TypeScript + Turbopack)
npm run start        # Start production server
npm run lint         # ESLint
npm test             # Run unit tests (Vitest)
npm run test:watch   # Vitest watch mode
npx vitest path/to/file.test.ts  # Run a single test file
npm run test:e2e     # Playwright E2E tests (requires dev server on :3000)
npm run test:e2e:ui  # Playwright with UI mode
npm run format       # Prettier format all files
npm run format:check # Prettier check only
```

## Architecture

### Core principle: logic/view separation

```
src/lib/tools/     ← Pure functions, zero UI dependency, testable in Node.js
src/components/    ← React UI components, browser-only
```

Every tool follows this pattern: a pure function in `lib/tools/<category>/<name>.ts` that does the actual work, and a React component in `components/tools/<name>.tsx` that handles UI state (upload, progress, download).

### Subdomain multi-site architecture

The same Next.js app powers the main domain **and** per-category subdomains:
- `toolcraftbox.com` — full homepage with all tools
- `image.toolcraftbox.com` — image tools only
- `pdf.toolcraftbox.com` — PDF tools only
- `markdown.toolcraftbox.com` — markdown tools only
- `dev.toolcraftbox.com` — developer tools only

The homepage (`src/app/page.tsx`) reads the `Host` header via `headers()` and detects the subdomain. When a subdomain is detected, it renders a focused category landing page filtered by `getToolsByCategory()`. The `Breadcrumb` component also links to subdomain URLs via hardcoded `categoryUrls`.

### Tool registration

Tools are registered in `src/lib/tools/index.ts` as `ToolConfig` objects. This single registry drives:
- The homepage tool grid (`src/app/page.tsx`)
- The dynamic route `/tools/[slug]` (`src/app/tools/[slug]/page.tsx`)
- SEO metadata generation (`src/lib/seo/metadata.ts`)
- Sitemap generation (`src/app/sitemap.ts`)

**Gotcha:** The sitemap has a hardcoded `toolSlugs` array — when adding a new tool, update both `toolRegistry` AND the sitemap's slug list.

To add a new tool: (1) add a `ToolConfig` entry to `toolRegistry`, (2) create the UI component, (3) map it in `src/components/tools/tool-loader.tsx`, (4) add the slug to the sitemap array.

### Tool page rendering

Dynamic tool pages use a split architecture to avoid Next.js 16 client/server boundary errors:
- `src/app/tools/[slug]/page.tsx` — Server Component: renders SEO (heading, FAQs, Breadcrumb, structured data JSON-LD) and delegates tool UI to...
- `src/components/tools/tool-renderer.tsx` — Client Component: calls `getToolComponent(slug)` and renders the tool

The `tool-loader.tsx` uses `next/dynamic` for lazy-loading each tool component. Some tools share a common component (e.g., `heic-to-jpg` and `webp-to-jpg` both use `ImageConverter` with different props).

### Reusable ToolShell component

`src/components/tools/tool-shell.tsx` provides the standard input/output panel layout used by most tools. Props: `inputPanel`, `outputPanel`, `optionsBar` (optional), and `direction` ("horizontal" | "vertical").

### SEO / structured data

Three layers of structured data across the site:
- **Site-level:** `SiteSchema` component (`src/components/seo/site-schema.tsx`) — Organization schema in the root layout
- **Tool pages:** Inline JSON-LD in `[slug]/page.tsx` — HowTo, FAQPage, and SoftwareApplication schemas
- **Breadcrumbs:** `Breadcrumb` component (`src/components/seo/breadcrumb.tsx`) — BreadcrumbList JSON-LD + visual nav

Metadata is generated via `generateToolMetadata()` in `src/lib/seo/metadata.ts`. The root layout metadata template is `"%s | ToolCraft"`.

### Blog

MDX blog at `src/content/blog/*.mdx`. Each file must export a `meta` object:
```js
export const meta = {
  title: "Post Title",
  description: "Meta description",
  date: "2026-06-14",
  category: "Image",
};
```

Static generation via `generateStaticParams` in `src/app/blog/[slug]/page.tsx`. **Gotcha:** Metadata extraction uses `eval()` on the raw file content — keep the `meta` export as a simple object literal on one line. MDX component styling is defined in `src/mdx-components.tsx`.

### Cache headers strategy

Defined in `next.config.ts` via `headers()`:
- **Tool pages** (`/tools/*`): 1h client, 24h CDN, 7d stale-while-revalidate + COEP/COOP headers for cross-origin isolation
- **Blog/legal**: same cache but no COEP/COOP
- **Homepage**: 10min client, 1h CDN

### Client-side processing

All tools run entirely in the browser. Key libraries:
- Image: `heic2any`, Canvas API
- PDF: `pdfjs-dist` (render), `pdf-lib` (create/merge). Note: pdfjs-dist v6 requires `{ canvas, canvasContext, viewport }` in render params.
- Markdown: `marked` (MD→HTML), `turndown` (HTML→MD), `mammoth` (DOCX→HTML)
- Dev: `prettier` standalone, `diff`, `qrcode`

### Testing

- Unit tests: `tests/unit/` — test `src/lib/tools/` pure functions with Vitest + jsdom. Setup file at `tests/vitest.setup.ts` loads `@testing-library/jest-dom` matchers.
- E2E tests: `tests/e2e/` — Playwright against `http://localhost:3000`. Chromium only. The `webServer` config auto-starts the dev server.

### Shadcn/ui v4

This project uses shadcn/ui v4 with `@base-ui/react` (not Radix). Import components from `@/components/ui/<name>`. The Button component does NOT support `asChild` — use plain HTML with Tailwind classes for polymorphic rendering.

### Path aliases

`@/*` maps to `./src/*` (defined in `tsconfig.json` and `vitest.config.ts`).

### Environment variables

No `.env` file is tracked in git. Google Analytics GA4 uses `NEXT_PUBLIC_GA_ID` env var (current: `G-JRNJX5CQ1F`) via the `Analytics` component in `src/components/layout/analytics.tsx`. AdSense ID `ca-pub-5142105226310650` is set via `<meta name="google-adsense-account">` in locale layout.

### Utility modules

| File | Purpose |
|------|---------|
| `src/lib/utils/cn.ts` | `cn()` — clsx + tailwind-merge helper |
| `src/lib/utils/file.ts` | File download/read helpers |
| `src/lib/utils/clipboard.ts` | Clipboard copy utilities |

## Key files

| File | Purpose |
|------|---------|
| `src/lib/tools/index.ts` | Tool registry — add new tools here |
| `src/lib/tools/types.ts` | `ToolConfig` and `ToolResult` type definitions |
| `src/components/tools/tool-loader.tsx` | Map tool slugs to lazy-loaded components |
| `src/components/tools/tool-renderer.tsx` | Client boundary for tool rendering |
| `src/components/tools/tool-shell.tsx` | Reusable input/output panel layout |
| `src/components/tools/file-upload-zone.tsx` | Reusable drag-and-drop file upload zone used by 15+ tools |
| `src/app/tools/[slug]/page.tsx` | Dynamic tool page (SEO + tool UI) |
| `src/app/page.tsx` | Homepage + subdomain category pages |
| `src/app/layout.tsx` | Root layout (fonts, analytics, ads, verification tags) |
| `src/app/sitemap.ts` | Auto-generated sitemap (hardcoded slug list) |
| `src/lib/seo/metadata.ts` | Tool page metadata generator |
| `src/mdx-components.tsx` | MDX styling for blog posts |
| `next.config.ts` | MDX plugin + cache/security headers |
| `vitest.config.ts` | Vitest config (jsdom + path aliases) |
