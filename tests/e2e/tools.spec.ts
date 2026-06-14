import { test, expect } from "@playwright/test";

const tools = [
  { slug: "heic-to-jpg", title: "HEIC to JPG" },
  { slug: "webp-to-jpg", title: "WebP to JPG" },
  { slug: "image-compressor", title: "Image Compressor" },
  { slug: "markdown-editor", title: "Markdown Editor" },
  { slug: "markdown-to-html", title: "Markdown to HTML" },
  { slug: "markdown-table-generator", title: "Markdown Table Generator" },
  { slug: "json-formatter", title: "JSON Formatter" },
  { slug: "base64-encode-decode", title: "Base64" },
  { slug: "uuid-generator", title: "UUID Generator" },
];

test.describe("Tool pages", () => {
  for (const tool of tools) {
    test(`${tool.slug} — should load and show title`, async ({ page }) => {
      const response = await page.goto(`/tools/${tool.slug}`);
      expect(response?.status()).toBe(200);

      // Check page title
      await expect(page).toHaveTitle(new RegExp(tool.title, "i"));

      // Check heading
      const heading = page.locator("h1");
      await expect(heading).toContainText(tool.title);
    });

    test(`${tool.slug} — should have FAQ section`, async ({ page }) => {
      await page.goto(`/tools/${tool.slug}`);
      const faq = page.locator("details");
      const count = await faq.count();
      expect(count).toBeGreaterThan(0);
    });

    test(`${tool.slug} — should have structured data`, async ({ page }) => {
      await page.goto(`/tools/${tool.slug}`);
      const schema = page.locator('script[type="application/ld+json"]');
      const count = await schema.count();
      expect(count).toBeGreaterThan(0);

      // Verify it's valid JSON-LD
      const content = await schema.first().innerHTML();
      const parsed = JSON.parse(content);
      expect(parsed["@graph"]).toBeDefined();
    });
  }
});

test.describe("Homepage", () => {
  test("should load and show all tools", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/ToolKit/);

    // Should have tool cards
    const cards = page.locator("a[href^='/tools/']");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  test("should navigate to a tool from the homepage", async ({ page }) => {
    await page.goto("/");
    await page.locator("a[href='/tools/markdown-editor']").first().click();
    await expect(page).toHaveURL(/\/tools\/markdown-editor/);
  });
});

test.describe("SEO", () => {
  test("homepage should have meta description", async ({ page }) => {
    await page.goto("/");
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content", /./);
  });

  test("tool page should have canonical URL", async ({ page }) => {
    await page.goto("/tools/markdown-to-html");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /\/tools\/markdown-to-html/);
  });
});
