import type { ToolConfig } from "./types";

export const toolRegistry: ToolConfig[] = [
  // ── Image Tools ──────────────────────────────────────────
  {
    slug: "heic-to-jpg",
    title: "HEIC to JPG Converter",
    description:
      "Convert HEIC images to JPG format online for free. No upload required — all processing happens in your browser.",
    category: "image",
    keywords: ["heic to jpg", "convert heic to jpg", "heic converter", "heic to jpg online free"],
    searchVolume: "~500K/mo",
    isClientSide: true,
    icon: "Image",
    howToUse: [
      "Click the upload area or drag and drop your HEIC file",
      "Wait for the conversion to complete (instant for most files)",
      "Preview the converted JPG image",
      "Click Download to save the JPG file to your device",
    ],
    faqs: [
      {
        question: "What is a HEIC file?",
        answer:
          "HEIC (High Efficiency Image Container) is Apple's modern image format used by iPhones and iPads since iOS 11. It offers better compression than JPEG but is less widely supported.",
      },
      {
        question: "Is the conversion free?",
        answer:
          "Yes, our HEIC to JPG converter is completely free. All processing happens in your browser — your files never leave your device.",
      },
      {
        question: "Will I lose image quality?",
        answer:
          "We convert at maximum quality by default. The resulting JPG will preserve as much detail as possible from your original HEIC file.",
      },
    ],
  },
  {
    slug: "webp-to-jpg",
    title: "WebP to JPG Converter",
    description:
      "Convert WebP images to JPG format online for free. Browser-based conversion with no file upload needed.",
    category: "image",
    keywords: ["webp to jpg", "convert webp to jpg", "webp converter", "webp to jpg online"],
    searchVolume: "~200K/mo",
    isClientSide: true,
    icon: "Image",
    howToUse: [
      "Upload your WebP image by clicking or dragging",
      "The conversion runs instantly in your browser",
      "Preview the result",
      "Download as JPG",
    ],
    faqs: [
      {
        question: "Why convert WebP to JPG?",
        answer:
          "While WebP offers great compression, JPG is universally supported across all devices, apps, and platforms.",
      },
      {
        question: "Is my file secure?",
        answer:
          "Yes. All processing is done client-side in your browser. Your files are never uploaded to any server.",
      },
    ],
  },

  {
    slug: "image-compressor",
    title: "Image Compressor",
    description:
      "Compress images online for free. Reduce file size without losing quality. All processing happens in your browser.",
    category: "image",
    keywords: [
      "image compressor",
      "compress image",
      "reduce image size",
      "compress image online",
      "image size reducer",
    ],
    searchVolume: "~1.5M/mo",
    isClientSide: true,
    icon: "Image",
    howToUse: [
      "Upload your image by clicking or dragging",
      "Adjust the quality slider to control compression",
      "Preview the compressed result and file size savings",
      "Download the optimized image",
    ],
    faqs: [
      {
        question: "Will I lose image quality?",
        answer:
          "Our smart compression balances quality and file size. Use the quality slider to find the right balance — we recommend 80% for photos.",
      },
      {
        question: "What image formats are supported?",
        answer:
          "We support JPEG, PNG, WebP, and most common image formats. The output format matches your input by default.",
      },
      {
        question: "Is my image secure?",
        answer:
          "Yes. All compression happens in your browser. Your images are never uploaded to any server.",
      },
    ],
  },

  // ── PDF Tools ────────────────────────────────────────────
  {
    slug: "jpg-to-pdf",
    title: "JPG to PDF Converter",
    description:
      "Convert JPG images to PDF online for free. Combine multiple images into a single PDF document. All browser-based.",
    category: "pdf",
    keywords: ["jpg to pdf", "convert jpg to pdf", "image to pdf", "jpg to pdf converter", "images to pdf"],
    searchVolume: "~6.9M/mo",
    isClientSide: true,
    icon: "FileText",
    howToUse: [
      "Upload your JPG or PNG images by clicking or dragging",
      "Arrange the images in the order you want them in the PDF",
      "Select your preferred page size (A4, Letter, etc.)",
      "Click Convert and download your PDF",
    ],
    faqs: [
      {
        question: "Can I combine multiple images into one PDF?",
        answer:
          "Yes! Upload multiple images and they will be combined into a single PDF, one image per page, in the order you arrange them.",
      },
      {
        question: "What image formats are supported?",
        answer: "We support JPEG and PNG images. Each image becomes one page in the resulting PDF.",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "All processing happens in your browser, so the limit is your device's memory. For best results, keep individual images under 20MB.",
      },
    ],
  },
  {
    slug: "pdf-to-jpg",
    title: "PDF to JPG Converter",
    description:
      "Convert PDF pages to JPG images online for free. Extract all pages or select specific ones. No file upload needed.",
    category: "pdf",
    keywords: ["pdf to jpg", "convert pdf to jpg", "pdf to image", "pdf to jpg converter", "extract pdf pages"],
    searchVolume: "~9.9M/mo",
    isClientSide: true,
    icon: "FileText",
    howToUse: [
      "Upload your PDF file by clicking or dragging",
      "Wait for pages to render (usually instant)",
      "Preview all extracted pages",
      "Download individual pages as JPG or download all at once",
    ],
    faqs: [
      {
        question: "Will the text be clear in the JPG output?",
        answer:
          "Yes, we render PDF pages at 2x resolution to ensure text and graphics are crisp in the resulting JPG images.",
      },
      {
        question: "Can I convert only specific pages?",
        answer:
          "Currently we convert all pages. You can pick which pages to download from the results grid.",
      },
    ],
  },
  {
    slug: "merge-pdf",
    title: "Merge PDF Files",
    description:
      "Combine multiple PDF files into one document online for free. Drag and drop to arrange the order.",
    category: "pdf",
    keywords: ["merge pdf", "combine pdf", "merge pdf files", "pdf merger", "combine pdf files online"],
    searchVolume: "~3M/mo",
    isClientSide: true,
    icon: "FileText",
    howToUse: [
      "Upload all the PDF files you want to merge",
      "Arrange them in the correct order",
      "Click Merge PDFs",
      "Download the combined PDF file",
    ],
    faqs: [
      {
        question: "Is there a limit to how many PDFs I can merge?",
        answer:
          "No hard limit — all processing is done in your browser. However, very large or numerous PDFs may slow down your device.",
      },
      {
        question: "Will the formatting be preserved?",
        answer:
          "Yes! We use PDF-lib which preserves all content, fonts, and formatting from your original PDFs.",
      },
    ],
  },

  // ── Markdown Tools ───────────────────────────────────────
  {
    slug: "markdown-to-html",
    title: "Markdown to HTML Converter",
    description:
      "Convert Markdown to HTML instantly. Perfect for turning AI chat outputs, README files, and documentation into clean HTML.",
    category: "markdown",
    keywords: [
      "markdown to html",
      "convert markdown to html",
      "md to html",
      "markdown converter online",
    ],
    searchVolume: "~50K/mo",
    isClientSide: true,
    icon: "FileCode",
    howToUse: [
      "Paste your Markdown text in the left panel",
      "See the live HTML preview on the right",
      "Switch to the HTML tab to view or copy the raw HTML",
      "Click Copy to clipboard or Download as .html file",
    ],
    faqs: [
      {
        question: "What Markdown flavors are supported?",
        answer:
          "We support GitHub Flavored Markdown (GFM) including tables, task lists, strikethrough, and code blocks with syntax highlighting.",
      },
      {
        question: "Can I convert AI chat outputs?",
        answer:
          "Yes! ChatGPT, Claude, Gemini, and other AI tools output Markdown by default. Paste it directly into our converter to get clean HTML.",
      },
    ],
  },
  {
    slug: "markdown-editor",
    title: "Online Markdown Editor",
    description:
      "Free online Markdown editor with live preview. Write, preview, and export Markdown with syntax highlighting and GitHub Flavored Markdown support.",
    category: "markdown",
    keywords: [
      "markdown editor online",
      "online markdown editor",
      "markdown preview",
      "free markdown editor",
    ],
    searchVolume: "~60K/mo",
    isClientSide: true,
    icon: "Edit3",
    howToUse: [
      "Write Markdown in the left editor panel",
      "See the live rendered preview on the right",
      "Use the toolbar for quick formatting",
      "Export as HTML, PDF, or download as .md file",
    ],
    faqs: [
      {
        question: "Does it support Mermaid diagrams?",
        answer:
          "Yes! You can include Mermaid diagrams in your Markdown — they will be rendered in the preview.",
      },
      {
        question: "Can I use it offline?",
        answer:
          "Yes, once loaded the editor works fully in your browser. You can write and preview Markdown without an internet connection.",
      },
    ],
  },
  {
    slug: "markdown-table-generator",
    title: "Markdown Table Generator",
    description:
      "Generate Markdown tables visually. Build tables with a spreadsheet-like interface and copy the Markdown output instantly.",
    category: "markdown",
    keywords: [
      "markdown table generator",
      "markdown table",
      "md table generator",
      "create markdown table",
    ],
    searchVolume: "~20K/mo",
    isClientSide: true,
    icon: "Table",
    howToUse: [
      "Set the number of rows and columns you need",
      "Fill in your table cells",
      "The Markdown output updates in real time",
      "Copy or download the Markdown table code",
    ],
    faqs: [
      {
        question: "Can I add alignment to columns?",
        answer:
          "Yes, you can set left, center, or right alignment for each column using the alignment controls.",
      },
      {
        question: "Does it support GitHub Flavored Markdown tables?",
        answer: "Yes, the generated tables follow GFM syntax and work on GitHub, GitLab, and most Markdown renderers.",
      },
    ],
  },

  // ── More Markdown Tools ────────────────────────────────────
  {
    slug: "markdown-to-docx",
    title: "Markdown to DOCX Converter",
    description:
      "Convert Markdown to Word documents (DOCX) online for free. Preserves headings, tables, code blocks, and formatting. All browser-based.",
    category: "markdown",
    keywords: [
      "markdown to docx",
      "md to docx",
      "markdown to word",
      "convert markdown to word",
      "md to word converter",
    ],
    searchVolume: "~20K/mo",
    isClientSide: true,
    icon: "FileText",
    howToUse: [
      "Paste your Markdown text in the input area",
      "Click Convert to DOCX",
      "Wait for the conversion (usually instant)",
      "Download the .docx file to your device",
    ],
    faqs: [
      {
        question: "Does it preserve Markdown formatting?",
        answer:
          "Yes! Headings, bold, italic, code, tables, lists, and links are all preserved in the DOCX output with proper Word styling.",
      },
      {
        question: "Is it really free?",
        answer:
          "Yes, completely free. All conversion happens in your browser — no file is ever uploaded to any server.",
      },
      {
        question: "Can I convert large Markdown files?",
        answer:
          "Yes, there are no file size limits since processing is done locally. Very large documents (100+ pages) may take a few seconds.",
      },
    ],
  },
  {
    slug: "markdown-to-pptx",
    title: "Markdown to PPTX Converter",
    description:
      "Convert Markdown to PowerPoint presentations (PPTX) online for free. Each heading becomes a new slide. Browser-based, no uploads.",
    category: "markdown",
    keywords: [
      "markdown to pptx",
      "md to pptx",
      "markdown to powerpoint",
      "convert markdown to ppt",
      "md to powerpoint",
    ],
    searchVolume: "~8K/mo",
    isClientSide: true,
    icon: "Presentation",
    howToUse: [
      "Paste your Markdown in the input area",
      "Use ## headings to define slide breaks",
      "Click Convert to PPTX",
      "Download the .pptx presentation",
    ],
    faqs: [
      {
        question: "How are slides created?",
        answer:
          "Top-level headings (# Title) become the title slide. Each ## heading becomes a new slide with its content, lists, and tables.",
      },
      {
        question: "Can I include images?",
        answer:
          "Image references in Markdown (![alt](url)) are noted as placeholders in the presentation. For full image support, embed them manually in PowerPoint after export.",
      },
      {
        question: "How many slides can I create?",
        answer:
          "There's no hard limit — all processing happens in your browser. Presentations with 50+ slides may take a moment to generate.",
      },
    ],
  },
  {
    slug: "docx-to-markdown",
    title: "DOCX to Markdown Converter",
    description:
      "Convert Word documents (DOCX) to Markdown online for free. Extract text, headings, and formatting from Word files into clean Markdown.",
    category: "markdown",
    keywords: [
      "docx to markdown",
      "word to markdown",
      "docx to md",
      "convert word to markdown",
      "word to md",
    ],
    searchVolume: "~15K/mo",
    isClientSide: true,
    icon: "FileText",
    howToUse: [
      "Upload your .docx file by clicking or dragging",
      "Wait for conversion (instant for most files)",
      "Preview the extracted Markdown",
      "Copy to clipboard or download as .md file",
    ],
    faqs: [
      {
        question: "Does it preserve all formatting?",
        answer:
          "We preserve headings, bold, italic, lists, links, and tables. Complex Word formatting like text boxes and embedded charts may not convert perfectly.",
      },
      {
        question: "Is my document secure?",
        answer:
          "Yes. Your DOCX file is processed entirely in your browser. Nothing is uploaded to any server.",
      },
    ],
  },

  // ── Developer Tools ──────────────────────────────────────
  {
    slug: "json-formatter",
    title: "JSON Formatter & Validator",
    description:
      "Format, validate, and beautify JSON online. Tree view, syntax highlighting, and error detection — all in your browser.",
    category: "dev",
    keywords: [
      "json formatter",
      "json validator",
      "json beautifier",
      "format json online",
      "json formatter online",
    ],
    searchVolume: "~250K/mo",
    isClientSide: true,
    icon: "Braces",
    howToUse: [
      "Paste your JSON string in the input area",
      "Click Format to beautify, or Minify to compress",
      "The tree view lets you explore complex JSON structures",
      "Copy the formatted output or download as .json file",
    ],
    faqs: [
      {
        question: "Can it fix invalid JSON?",
        answer:
          "Our validator will highlight exactly where the error is and what's wrong. You'll need to fix the source, but we make it easy to find the issue.",
      },
      {
        question: "Is my JSON data safe?",
        answer: "Yes, all processing happens in your browser. Your data never leaves your device.",
      },
    ],
  },
  {
    slug: "base64-encode-decode",
    title: "Base64 Encoder / Decoder",
    description:
      "Encode text to Base64 or decode Base64 back to text. Simple, fast, and entirely browser-based.",
    category: "dev",
    keywords: [
      "base64 encode",
      "base64 decode",
      "base64 encoder",
      "base64 decoder",
      "base64 converter",
    ],
    searchVolume: "~120K/mo",
    isClientSide: true,
    icon: "Binary",
    howToUse: [
      "Paste your text or Base64 string in the input area",
      "Click Encode to convert text → Base64",
      "Click Decode to convert Base64 → text",
      "Copy the result to clipboard",
    ],
    faqs: [
      {
        question: "What is Base64 encoding used for?",
        answer:
          "Base64 encoding converts binary data to ASCII text. It's commonly used for embedding images in HTML/CSS, API authentication tokens, and data URLs.",
      },
      {
        question: "Is Base64 encryption?",
        answer: "No, Base64 is encoding, not encryption. It can be easily reversed. Never use it to store sensitive data like passwords.",
      },
    ],
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description: "Generate random UUIDs (v4) online. Batch generate multiple UUIDs at once — free and fast.",
    category: "dev",
    keywords: ["uuid generator", "uuid v4 generator", "generate uuid", "guid generator", "random uuid"],
    searchVolume: "~100K/mo",
    isClientSide: true,
    icon: "Fingerprint",
    howToUse: [
      "Select how many UUIDs you need (1–100)",
      "Click Generate",
      "UUIDs are generated using cryptographically strong randomness",
      "Copy individual UUIDs or download all as text",
    ],
    faqs: [
      {
        question: "What version of UUID is generated?",
        answer: "We generate UUID v4, which is based on random numbers. It's the most commonly used UUID version.",
      },
      {
        question: "Are the UUIDs truly unique?",
        answer: "UUID v4 uses 122 bits of randomness. The probability of collision is astronomically low — you'd need to generate billions per second for decades.",
      },
    ],
  },

  // ── Calculator Tools ──────────────────────────────────────
  {
    slug: "percentage-calculator",
    title: "Percentage Calculator",
    description: "Free online percentage calculator. Calculate % of a number, % change, % increase/decrease. Instant results.",
    category: "calculator",
    keywords: ["percentage calculator", "percent calculator", "percentage change", "percent of", "% calculator"],
    searchVolume: "~1M/mo",
    isClientSide: true,
    icon: "Calculator",
    howToUse: [
      "Choose a calculation mode: % of, is what %, % change, or +/− %",
      "Enter your numbers",
      "See the result instantly",
    ],
    faqs: [
      {
        question: "What is the formula for percentage?",
        answer: "Percentage = (Part / Whole) × 100. For example, 30 is 20% of 150 because (30/150) × 100 = 20.",
      },
      {
        question: "How do I calculate percentage increase?",
        answer: "Use the % Change tab. Formula: ((New − Old) / Old) × 100. Enter the old and new values to see the change.",
      },
    ],
  },

  // ── More Developer Tools ──────────────────────────────────
  {
    slug: "qr-code-generator",
    title: "QR Code Generator",
    description: "Generate QR codes online for free. Create QR codes for URLs, text, and more. Download as PNG.",
    category: "dev",
    keywords: ["qr code generator", "qr code", "generate qr code", "free qr code", "qr code maker"],
    searchVolume: "~300K/mo",
    isClientSide: true,
    icon: "QrCode",
    howToUse: [
      "Enter a URL or text",
      "Click Generate",
      "Preview your QR code",
      "Download as PNG image",
    ],
    faqs: [
      {
        question: "Is the QR code generation free?",
        answer: "Yes, completely free. The QR code is generated in your browser — no data is sent to any server.",
      },
      {
        question: "What can I put in a QR code?",
        answer: "URLs, plain text, phone numbers, email addresses, and more. Most smartphones can scan and open the content automatically.",
      },
    ],
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    description: "Generate strong, secure passwords online. Choose length and character types. Cryptographically random.",
    category: "dev",
    keywords: ["password generator", "strong password", "random password", "secure password generator", "password maker"],
    searchVolume: "~200K/mo",
    isClientSide: true,
    icon: "Key",
    howToUse: [
      "Set your password length (6–64 characters)",
      "Choose character types: uppercase, lowercase, numbers, symbols",
      "Click Generate",
      "Copy the password or regenerate",
    ],
    faqs: [
      {
        question: "How strong should my password be?",
        answer: "Aim for at least 12 characters with a mix of uppercase, lowercase, numbers, and symbols. Our strength meter helps you gauge security.",
      },
      {
        question: "Are the passwords stored anywhere?",
        answer: "No. Passwords are generated in your browser using cryptographically strong randomness (crypto.getRandomValues). They are never stored or transmitted.",
      },
    ],
  },
  {
    slug: "text-diff-checker",
    title: "Text Diff Checker",
    description: "Compare two texts and find differences online. Line-by-line diff with added, removed, and unchanged highlighting.",
    category: "dev",
    keywords: ["text diff", "diff checker", "compare text", "text comparison", "find differences", "diff tool"],
    searchVolume: "~20K/mo",
    isClientSide: true,
    icon: "GitCompare",
    howToUse: [
      "Paste the original text in the left panel",
      "Paste the modified text in the right panel",
      "Click Compare",
      "Review highlighted differences — green for added, red for removed",
    ],
    faqs: [
      {
        question: "How does text diff work?",
        answer: "It compares two texts line by line using the diff algorithm. Lines present only in the modified text are highlighted green (added), lines only in the original are red (removed).",
      },
      {
        question: "Can I compare code?",
        answer: "Yes! The diff checker works for any plain text: code, configuration files, prose, or data.",
      },
    ],
  },
  {
    slug: "image-resizer",
    title: "Image Resizer",
    description: "Resize images online for free. Set exact dimensions, maintain aspect ratio. All processing in your browser.",
    category: "image",
    keywords: ["image resizer", "resize image", "image resize", "change image size", "resize photo"],
    searchVolume: "~300K/mo",
    isClientSide: true,
    icon: "Crop",
    howToUse: [
      "Upload your image",
      "Enter new width and/or height",
      "Toggle aspect ratio lock on/off",
      "Preview and download the resized image",
    ],
    faqs: [
      {
        question: "Will resizing reduce quality?",
        answer: "Downsizing (making smaller) preserves quality well. Upsizing (making larger) may result in some blur. We render at high quality to minimize quality loss.",
      },
      {
        question: "What aspect ratio lock does",
        answer: "When locked, changing width automatically adjusts height (and vice versa) to maintain the original proportions. Unlock to set width and height independently.",
      },
    ],
  },
];

/**
 * Get a tool config by slug
 */
export function getToolBySlug(slug: string): ToolConfig | undefined {
  return toolRegistry.find((tool) => tool.slug === slug);
}

/**
 * Get all tool slugs for static generation
 */
export function getAllToolSlugs(): string[] {
  return toolRegistry.map((tool) => tool.slug);
}

/**
 * Get tools filtered by category
 */
export function getToolsByCategory(category: ToolConfig["category"]): ToolConfig[] {
  return toolRegistry.filter((tool) => tool.category === category);
}
