# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js 16 Breaking Changes

This project uses Next.js 16.2 with significant API changes from older versions. Before writing any code, check the docs at `node_modules/next/dist/docs/`. Key differences:
- `params` is a `Promise<T>` — use `await params` in server components, `use(params)` in client components
- Turbopack is the default bundler
- Tailwind CSS v4 with `@tailwindcss/postcss`

## Commands

```bash
npm run dev          # Start dev server (default port 3000)
npm run build        # Production build (TypeScript + Turbopack)
npm run start        # Start production server
npm run lint         # ESLint
npm test             # Run unit tests (Vitest, 31 tests)
npm run test:watch   # Vitest watch mode
npm run test:e2e     # Playwright E2E tests
npm run format       # Prettier format all files
npm run format:check # Prettier check only
```

## Architecture

### Core principle: logic/view separation

```
src/lib/tools/     ← Pure functions, zero UI dependency, testable in Node.js
src/components/    ← React UI components, browser-only
```

Every tool follows this pattern: a pure function in `lib/tools/<category>/<name>.ts` that does the actual work, and a React component in `components/tools/<name>.tsx` that handles UI state (file upload, progress, download).

### Tool registration

Tools are registered in `src/lib/tools/index.ts` as `ToolConfig` objects. This single registry drives:
- The homepage tool grid (`src/app/page.tsx`)
- The dynamic route `/tools/[slug]` (`src/app/tools/[slug]/page.tsx`)
- SEO metadata generation (`src/lib/seo/metadata.ts`)
- Sitemap generation (`src/app/sitemap.ts`)

To add a new tool: (1) add a `ToolConfig` entry, (2) create the UI component, (3) map it in `src/components/tools/tool-loader.tsx`.

### Tool page rendering

Dynamic tool pages use a split architecture to avoid Next.js 16 client/server boundary errors:
- `src/app/tools/[slug]/page.tsx` — Server Component: renders SEO (heading, FAQs, structured data JSON-LD) and delegates tool UI to...
- `src/components/tools/tool-renderer.tsx` — Client Component: calls `getToolComponent(slug)` and renders the tool

The `tool-loader.tsx` uses `next/dynamic` for lazy-loading each tool component.

### Client-side processing

All 12 tools run entirely in the browser. Key libraries:
- Image: `heic2any`, Canvas API
- PDF: `pdfjs-dist` (render), `pdf-lib` (create/merge). Note: pdfjs-dist v6 requires `{ canvas, canvasContext, viewport }` in render params.
- Markdown: `marked` (MD→HTML), `turndown` (HTML→MD), `mammoth` (DOCX→HTML, same lib MarkItDown uses)
- Dev: `prettier` standalone, `diff`

### Blog

MDX blog at `src/content/blog/*.mdx`. Static generation via `generateStaticParams` in `src/app/blog/[slug]/page.tsx`. Each MDX file exports a `meta` object with title, description, date, and category.

### Testing

- Unit tests: `tests/unit/` — test `src/lib/tools/` pure functions with Vitest + jsdom
- E2E tests: `tests/e2e/` — Playwright against `http://localhost:3000`

### Shadcn/ui v4

This project uses shadcn/ui v4 with `@base-ui/react` (not Radix). Import components from `@/components/ui/<name>`. The Button component does NOT support `asChild` — use plain HTML with Tailwind classes for polymorphic rendering.

## Key files

| File | Purpose |
|------|---------|
| `src/lib/tools/index.ts` | Tool registry — add new tools here |
| `src/lib/tools/types.ts` | `ToolConfig` type definition |
| `src/components/tools/tool-loader.tsx` | Map tool slugs to lazy-loaded components |
| `src/components/tools/tool-renderer.tsx` | Client boundary for tool rendering |
| `src/app/tools/[slug]/page.tsx` | Dynamic tool page (SEO + tool UI) |
| `src/mdx-components.tsx` | MDX styling for blog posts |
| `src/app/sitemap.ts` | Auto-generated sitemap with all tools + blog |
| `vitest.config.ts` | Vitest config (jsdom + path aliases) |
