import type { ToolConfig } from "../types";

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
    slug: "png-to-jpg",
    title: "PNG to JPG Converter",
    description:
      "Convert PNG images to JPG format online for free. Reduce file size while maintaining quality. All processing in your browser.",
    category: "image",
    keywords: ["png to jpg", "convert png to jpg", "png converter", "png to jpg online free", "png to jpeg"],
    searchVolume: "~150K/mo",
    isClientSide: true,
    icon: "Image",
    howToUse: [
      "Upload your PNG image by clicking or dragging",
      "The conversion runs instantly in your browser",
      "Preview the converted JPG image",
      "Download as JPG — typically 50-80% smaller than PNG",
    ],
    faqs: [
      {
        question: "Why convert PNG to JPG?",
        answer:
          "PNG files are often much larger than JPG because they support transparency and lossless compression. If you don't need transparency, converting to JPG can reduce file size by 50-80%.",
      },
      {
        question: "Will I lose quality?",
        answer:
          "We convert at high quality (92%). For photos and complex images, the quality difference is barely noticeable while the file size reduction is significant. For graphics with sharp edges and text, consider keeping PNG format.",
      },
      {
        question: "Is my file secure?",
        answer:
          "Yes. All processing is done client-side in your browser. Your files are never uploaded to any server.",
      },
    ],
  },
  {
    slug: "image-cropper",
    title: "Image Cropper",
    description:
      "Crop images online for free. Select any area, preview instantly, and download. All processing in your browser.",
    category: "image",
    keywords: ["image cropper", "crop image", "crop photo", "image crop online", "photo cropper"],
    searchVolume: "~200K/mo",
    isClientSide: true,
    icon: "Crop",
    howToUse: [
      "Upload your image by clicking or dragging",
      "Click and drag on the image to select the crop area",
      "Click Crop to apply",
      "Preview and download the cropped image",
    ],
    faqs: [
      {
        question: "What output formats are supported?",
        answer:
          "The cropped image downloads as JPG by default. This provides a good balance of quality and file size.",
      },
      {
        question: "Is my image secure?",
        answer:
          "Yes. All cropping happens in your browser. Your image is never uploaded to any server.",
      },
    ],
  },
  {
    slug: "image-to-base64",
    title: "Image to Base64 Converter",
    description:
      "Convert images to Base64 data URLs online. Embed images directly in HTML, CSS, or JSON. No uploads needed.",
    category: "image",
    keywords: ["image to base64", "convert image to base64", "base64 image", "image to data url", "base64 encoder image"],
    searchVolume: "~60K/mo",
    isClientSide: true,
    icon: "FileCode",
    howToUse: [
      "Upload your image by clicking or dragging",
      "The Base64 data URL is generated instantly",
      "Copy the Base64 string to clipboard",
      "Use it in your HTML <img> tag or CSS background",
    ],
    faqs: [
      {
        question: "What is Base64 image encoding used for?",
        answer:
          "Base64-encoded images can be embedded directly in HTML or CSS without needing a separate file. This reduces HTTP requests for small images like icons, but increases the HTML size by ~33%.",
      },
      {
        question: "Are there file size limits?",
        answer:
          "Since processing is client-side, there's no server limit. However, Base64 encoding increases file size by ~33%, so it's best for small images under 100KB.",
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
  {
    slug: "image-resizer",
    title: "Image Resizer",
    description:
      "Resize images online for free. Set exact dimensions, maintain aspect ratio. All processing in your browser.",
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
        answer:
          "Downsizing (making smaller) preserves quality well. Upsizing (making larger) may result in some blur. We render at high quality to minimize quality loss.",
      },
      {
        question: "What aspect ratio lock does",
        answer:
          "When locked, changing width automatically adjusts height (and vice versa) to maintain the original proportions. Unlock to set width and height independently.",
      },
    ],
  },
  {
    slug: "gif-maker",
    title: "GIF Maker",
    description:
      "Create animated GIFs from multiple images online for free. Set frame delay, arrange order, and download. All processing in your browser.",
    category: "image",
    keywords: ["gif maker", "make gif", "create gif", "animated gif maker", "gif creator", "image to gif"],
    searchVolume: "~100K/mo",
    isClientSide: true,
    icon: "Film",
    howToUse: [
      "Upload 2 or more images",
      "Arrange frames in the desired order",
      "Set the frame delay (animation speed)",
      "Click Create GIF and download",
    ],
    faqs: [
      {
        question: "How many frames can I use?",
        answer:
          "There's no hard limit, but for best results keep it under 50 frames. Very large GIFs may be slow to generate and result in large file sizes.",
      },
      {
        question: "What controls the animation speed?",
        answer:
          "The frame delay (in milliseconds) controls how long each frame is shown. Lower values create faster animations. The default 500ms shows each frame for half a second.",
      },
    ],
  },
  {
    slug: "svg-to-png",
    title: "SVG to PNG Converter",
    description:
      "Convert SVG images to PNG format online for free. Upload SVG files or paste code directly. Renders at 2x resolution for retina quality.",
    category: "image",
    keywords: ["svg to png", "convert svg to png", "svg converter", "svg to png online", "svg to bitmap"],
    searchVolume: "~80K/mo",
    isClientSide: true,
    icon: "Image",
    howToUse: [
      "Upload an SVG file or paste your SVG code",
      "Click Convert to PNG",
      "Preview the rendered PNG output",
      "Download the PNG file (rendered at 2x for sharp quality)",
    ],
    faqs: [
      {
        question: "Does it support complex SVGs?",
        answer:
          "Yes, we render SVGs using the browser's native SVG engine at 2x resolution. Inline styles, gradients, and basic animations (static first frame) are supported.",
      },
      {
        question: "What is the output quality?",
        answer:
          "PNGs are rendered at 2x the original SVG dimensions for sharp, retina-quality output. The output is a standard PNG with transparent background preserved.",
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
  {
    slug: "compress-pdf",
    title: "Compress PDF",
    description:
      "Compress PDF files online for free. Reduce file size while maintaining quality. All processing happens in your browser.",
    category: "pdf",
    keywords: ["compress pdf", "reduce pdf size", "pdf compressor", "compress pdf online", "pdf size reducer"],
    searchVolume: "~2M/mo",
    isClientSide: true,
    icon: "FileArchive",
    howToUse: [
      "Upload your PDF file by clicking or dragging",
      "Click Compress PDF",
      "See the size reduction percentage",
      "Download the compressed PDF",
    ],
    faqs: [
      {
        question: "How much can PDFs be compressed?",
        answer:
          "Results vary depending on the PDF content. PDFs with many images may see 10-30% reduction. Text-heavy PDFs may see 20-50% size savings by removing unused objects and optimizing structure.",
      },
      {
        question: "Will the quality be affected?",
        answer:
          "Our compression optimizes the PDF structure without altering the visible content. Text, images, and formatting remain identical to the original.",
      },
    ],
  },
  {
    slug: "split-pdf",
    title: "Split PDF",
    description:
      "Split PDF files into individual pages online for free. Extract specific page ranges or split all pages. Browser-based, no uploads.",
    category: "pdf",
    keywords: ["split pdf", "extract pdf pages", "pdf splitter", "separate pdf pages", "split pdf online"],
    searchVolume: "~500K/mo",
    isClientSide: true,
    icon: "Scissors",
    howToUse: [
      "Upload your PDF file",
      "Click Split All Pages to get each page as a separate PDF",
      "Or enter a page range (e.g., 1-5) to extract specific pages",
      "Download individual pages or the extracted range",
    ],
    faqs: [
      {
        question: "Can I extract specific pages?",
        answer:
          "Yes! Use the page range input to extract any range (e.g., 3-7). Each page is also available for individual download after splitting.",
      },
      {
        question: "Is my PDF secure?",
        answer:
          "Yes. All splitting happens in your browser. Your PDF files are never uploaded to any server.",
      },
    ],
  },
  {
    slug: "rotate-pdf",
    title: "Rotate PDF",
    description:
      "Rotate PDF pages online for free. Choose 90°, 180°, or 270° rotation. All processing in your browser — no file uploads needed.",
    category: "pdf",
    keywords: ["rotate pdf", "rotate pdf pages", "pdf rotation", "turn pdf", "rotate pdf online"],
    searchVolume: "~100K/mo",
    isClientSide: true,
    icon: "RotateCw",
    howToUse: [
      "Upload your PDF file",
      "Choose rotation: 90° clockwise, 180°, or 270° (90° counter-clockwise)",
      "Click to apply rotation to all pages",
      "Download the rotated PDF",
    ],
    faqs: [
      {
        question: "Does it rotate all pages?",
        answer:
          "Yes, rotation is applied to every page in the PDF. Choose from 90° clockwise, 180°, or 270° (90° counter-clockwise).",
      },
      {
        question: "Can I rotate only specific pages?",
        answer:
          "Currently, rotation applies to all pages. For page-specific rotation, split the PDF first, rotate individual pages, then merge them back.",
      },
    ],
  },
  {
    slug: "pdf-reorder",
    title: "PDF Page Reorder",
    description:
      "Rearrange PDF pages online for free. Drag and drop to reorder pages, reverse page order, or customize page sequence.",
    category: "pdf",
    keywords: ["reorder pdf pages", "rearrange pdf", "pdf page order", "reverse pdf", "pdf page sorter"],
    searchVolume: "~30K/mo",
    isClientSide: true,
    icon: "GripVertical",
    howToUse: [
      "Upload your PDF",
      "Drag and drop page tags to reorder them",
      "Use Reverse for instant page order reversal",
      "Click Apply Order and download the rearranged PDF",
    ],
    faqs: [
      {
        question: "How does page reordering work?",
        answer:
          "After uploading, you'll see each page as a draggable tag. Drag pages to your desired order, click Apply Order, and the PDF is rebuilt with the new page sequence.",
      },
      {
        question: "Can I remove pages while reordering?",
        answer:
          "Currently, reordering rearranges existing pages. To remove pages, use the Split PDF tool to extract the pages you want to keep.",
      },
    ],
  },

  // ── Markdown Tools ───────────────────────────────────────
  {
    slug: "markdown",
    title: "Markdown Workbench — Online Editor & Converter",
    description:
      "All-in-one Markdown tool: edit with live preview, export to HTML/DOCX/PPTX/PDF, beautify formatting, and import from URL/HTML/DOCX. Free, browser-based, no uploads required.",
    category: "markdown",
    keywords: [
      "markdown editor",
      "markdown converter",
      "markdown to html",
      "markdown to pdf",
      "markdown to docx",
      "markdown formatter",
      "html to markdown",
      "online markdown editor",
      "free markdown editor",
      "markdown to pptx",
      "url to markdown",
    ],
    searchVolume: "~400K/mo",
    isClientSide: true,
    icon: "Edit3",
    howToUse: [
      "Write or paste Markdown in the Edit tab for live preview",
      "Switch to Export to download as HTML, DOCX, PPTX, or PDF",
      "Use Beautify to clean up and normalize Markdown formatting",
      "Import content from URLs, HTML code, or Word documents in the Import tab",
    ],
    faqs: [
      {
        question: "What Markdown flavors are supported?",
        answer:
          "We support GitHub Flavored Markdown (GFM) including tables, task lists, strikethrough, code blocks, and auto-links.",
      },
      {
        question: "Can I export my Markdown to Word or PowerPoint?",
        answer:
          "Yes! The Export tab has one-click download buttons for DOCX (Word), PPTX (PowerPoint), PDF, and self-contained HTML. All conversion happens in your browser.",
      },
      {
        question: "Can I convert AI chat outputs to formatted documents?",
        answer:
          "Yes! ChatGPT, Claude, Gemini, and other AI tools output Markdown by default. Paste it directly into the workbench to preview, beautify, and export to any format you need.",
      },
      {
        question: "Can I import from web pages?",
        answer:
          "Yes, the Import tab lets you fetch any URL and convert the page content to clean Markdown. You can also paste HTML directly or upload a Word document (.docx).",
      },
      {
        question: "Does the formatter change my content?",
        answer:
          "No content is changed — only formatting and spacing. The Beautify tab normalizes heading spacing, fixes list indentation, removes trailing whitespace, and standardizes code fences.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Yes. All processing happens entirely in your browser. Nothing is ever uploaded to any server. Your files and text stay on your device.",
      },
      {
        question: "Can I use it offline?",
        answer:
          "Yes, once loaded the workbench works fully in your browser. You can write, preview, format, and export Markdown without an internet connection.",
      },
    ],
  },
  {
    slug: "markdown-to-html",
    hidden: true,
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
          "We support GitHub Flavored Markdown (GFM) including tables, task lists, strikethrough, code blocks, and auto-links.",
      },
      {
        question: "Can I convert AI chat outputs?",
        answer:
          "Yes! ChatGPT, Claude, Gemini, and other AI tools output Markdown by default. Paste it directly into our converter to get clean, safe HTML.",
      },
      {
        question: "Does the HTML output include styling?",
        answer:
          "Yes, the downloaded HTML file includes built-in CSS styling for typography, code blocks, tables, and blockquotes — so your document looks polished without any external stylesheets.",
      },
      {
        question: "Can I export to other formats?",
        answer:
          "Yes! The editor also lets you download as DOCX (Word document) or PPTX (PowerPoint), so you can convert your Markdown to the format you need.",
      },
    ],
  },
  {
    slug: "markdown-editor",
    hidden: true,
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
      "Use the tabs to switch between preview and raw HTML view",
      "Export as HTML, DOCX, PPTX, or copy to clipboard",
    ],
    faqs: [
      {
        question: "Can I export my Markdown to Word or PowerPoint?",
        answer:
          "Yes! The editor has built-in export buttons for DOCX (Word) and PPTX (PowerPoint). Just write or paste your Markdown and click the format you need.",
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
    hidden: true,
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
  {
    slug: "markdown-to-docx",
    hidden: true,
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
    hidden: true,
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
    hidden: true,
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
  {
    slug: "html-to-markdown",
    hidden: true,
    title: "HTML to Markdown Converter",
    description:
      "Convert HTML code to clean Markdown instantly. Paste any HTML and get well-formatted Markdown output. Free, fast, browser-based.",
    category: "markdown",
    keywords: ["html to markdown", "html to md", "convert html to markdown", "html markdown converter"],
    searchVolume: "~80K/mo",
    isClientSide: true,
    icon: "FileCode",
    howToUse: [
      "Paste your HTML code in the input panel",
      "Click Convert to transform it to Markdown",
      "Review the Markdown output",
      "Copy the result or use it directly",
    ],
    faqs: [
      {
        question: "What HTML elements are supported?",
        answer:
          "Most common elements are supported: headings, paragraphs, lists, links, images, tables, code blocks, blockquotes, and inline formatting (bold, italic). Complex nested structures are flattened to reasonable Markdown.",
      },
      {
        question: "Is my HTML data safe?",
        answer: "Yes, all processing happens in your browser. Your HTML never leaves your device.",
      },
    ],
  },
  {
    slug: "markdown-formatter",
    hidden: true,
    title: "Markdown Formatter & Beautifier",
    description:
      "Format and beautify messy Markdown. Fix spacing, normalize headings, clean up lists, and make your Markdown readable in one click.",
    category: "markdown",
    keywords: ["markdown formatter", "markdown beautifier", "format markdown", "prettify markdown", "markdown tidy"],
    searchVolume: "~40K/mo",
    isClientSide: true,
    icon: "Sparkles",
    howToUse: [
      "Paste your Markdown text in the input panel",
      "Click Format to normalize spacing and structure",
      "Review the cleaned-up Markdown output",
      "Copy the result or paste it back into your editor",
    ],
    faqs: [
      {
        question: "What does the formatter fix?",
        answer:
          "It normalizes heading spacing, fixes list indentation, ensures blank lines between sections, removes trailing whitespace, and standardizes code fences (~~~ → ```).",
      },
      {
        question: "Will it change my Markdown content?",
        answer:
          "No content is changed — only formatting and spacing. Your headings, lists, links, and text remain exactly the same, just better organized.",
      },
    ],
  },
  {
    slug: "markdown-to-pdf",
    hidden: true,
    title: "Markdown to PDF Converter",
    description:
      "Convert Markdown to PDF with professional styling. Live preview, print-to-PDF, and HTML download. Free, instant, browser-based.",
    category: "markdown",
    keywords: ["markdown to pdf", "md to pdf", "convert markdown to pdf", "markdown pdf export"],
    searchVolume: "~100K/mo",
    isClientSide: true,
    icon: "FileText",
    howToUse: [
      "Paste or write your Markdown in the editor",
      "Click Preview to see the rendered document",
      "Click Print to PDF to save as a PDF file",
      "Or download as a styled HTML file",
    ],
    faqs: [
      {
        question: "How does Markdown to PDF work?",
        answer:
          "Your Markdown is rendered to a professionally styled HTML document. You can preview it, then use your browser's Print → Save as PDF feature to create the final PDF file.",
      },
      {
        question: "Can I customize the PDF styling?",
        answer:
          "The default styling includes clean typography, code highlighting, and print-friendly formatting. For advanced customization, you can download the HTML file and modify the CSS.",
      },
    ],
  },
  {
    slug: "url-to-markdown",
    hidden: true,
    title: "URL to Markdown Converter",
    description:
      "Convert any webpage to clean Markdown. Paste a URL and get the main content as well-formatted Markdown. Perfect for research and note-taking.",
    category: "markdown",
    keywords: ["url to markdown", "webpage to markdown", "convert url to markdown", "website to markdown", "html to markdown url"],
    searchVolume: "~60K/mo",
    isClientSide: true,
    icon: "Globe",
    howToUse: [
      "Paste a webpage URL in the input field",
      "Click Fetch to download and convert the page",
      "Review the extracted Markdown content",
      "Copy or download the Markdown file",
    ],
    faqs: [
      {
        question: "Why does it fail for some URLs?",
        answer:
          "Some websites block cross-origin requests (CORS policy). If a URL fails, try pasting the page's HTML source into our HTML to Markdown converter instead.",
      },
      {
        question: "Is the conversion accurate?",
        answer:
          "We extract the main content area (<main>, <article>, or <body>) and convert it to Markdown. Navigation, scripts, and styles are stripped. Most articles and documentation pages convert cleanly.",
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
    slug: "url-encode-decode",
    title: "URL Encoder / Decoder",
    description:
      "Encode text to URL-safe format or decode URL-encoded strings back to plain text. Fast and entirely browser-based.",
    category: "dev",
    keywords: ["url encoder", "url decoder", "url encode decode", "url percent encoding", "encode url online"],
    searchVolume: "~100K/mo",
    isClientSide: true,
    icon: "Link",
    howToUse: [
      "Paste your text or URL-encoded string in the input area",
      "Click Encode to convert text → URL-safe format",
      "Click Decode to convert URL-encoded string → plain text",
      "Copy the result to clipboard",
    ],
    faqs: [
      {
        question: "What is URL encoding used for?",
        answer:
          "URL encoding converts special characters (spaces, symbols, non-ASCII) into a format safe for URLs. For example, spaces become %20. It's essential for passing data in query strings and form submissions.",
      },
      {
        question: "What's the difference between encodeURI and encodeURIComponent?",
        answer:
          "We use encodeURIComponent which encodes all special characters including / ? & = #. This is the safest method for encoding individual query parameter values.",
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
    slug: "case-converter",
    title: "Case Converter",
    description:
      "Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, kebab-case, and more. Instant results.",
    category: "dev",
    keywords: ["case converter", "text case converter", "uppercase to lowercase", "title case converter", "change case online"],
    searchVolume: "~80K/mo",
    isClientSide: true,
    icon: "CaseSensitive",
    howToUse: [
      "Paste your text in the input area",
      "Click a case style button: UPPER, lower, Title, Sentence, camelCase, kebab-case, or iNVERT",
      "See the converted result instantly in the output panel",
      "Copy to clipboard",
    ],
    faqs: [
      {
        question: "What text cases are supported?",
        answer:
          "We support UPPERCASE, lowercase, Title Case (Each Word Capitalized), Sentence case, camelCase (for coding), kebab-case (for URLs/CSS), and inverted case.",
      },
      {
        question: "Does it handle multilingual text?",
        answer:
          "Yes, the converter works with any text that uses standard Unicode letter casing rules. Most Latin-based languages work perfectly.",
      },
    ],
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description:
      "Test regular expressions online with real-time match highlighting. Supports all JS regex flags. Instant feedback.",
    category: "dev",
    keywords: ["regex tester", "regex test", "regular expression tester", "regex online", "regex matcher"],
    searchVolume: "~60K/mo",
    isClientSide: true,
    icon: "Regex",
    howToUse: [
      "Type your regex pattern between the slashes",
      "Toggle flags: g (global), i (case-insensitive), m (multiline), s (dotall), u (unicode)",
      "Paste or type your test text below",
      "Matches are highlighted in yellow — see match details on the right",
    ],
    faqs: [
      {
        question: "What regex flavor is used?",
        answer:
          "We use JavaScript's built-in RegExp engine. This matches what you'd use in Node.js, browser JavaScript, and most online code editors.",
      },
      {
        question: "Why am I getting no matches?",
        answer:
          "Check the pattern for typos. Use the global flag (g) to find all matches. The dotall flag (s) makes . match newlines. See the error message if the pattern syntax is invalid.",
      },
    ],
  },
  {
    slug: "css-formatter",
    title: "CSS Formatter & Minifier",
    description:
      "Beautify or minify CSS online. Format messy CSS with proper indentation or compress for production. Free and instant.",
    category: "dev",
    keywords: ["css formatter", "css beautifier", "css minifier", "format css", "css prettify", "minify css online"],
    searchVolume: "~40K/mo",
    isClientSide: true,
    icon: "Paintbrush",
    howToUse: [
      "Paste your CSS in the input panel",
      "Click Beautify to format with indentation, or Minify to compress",
      "The result appears in the output panel",
      "Copy to clipboard",
    ],
    faqs: [
      {
        question: "What CSS syntax is supported?",
        answer:
          "We support standard CSS3 syntax including media queries, keyframes, and pseudo-selectors. Preprocessor syntax (SCSS, Less) may not format correctly — use a dedicated tool for those.",
      },
      {
        question: "Will minifying break my CSS?",
        answer:
          "No. Minification only removes whitespace and comments — it doesn't change the CSS logic. Always keep the original unminified version for editing.",
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
    slug: "html-entity-encode-decode",
    title: "HTML Entity Encoder / Decoder",
    description:
      "Encode text to HTML entities or decode HTML entities back to plain text. Supports named, decimal, and hex entities. Free online tool.",
    category: "dev",
    keywords: ["html entity encoder", "html entity decoder", "html entities", "html escape", "html unescape", "encode html"],
    searchVolume: "~80K/mo",
    isClientSide: true,
    icon: "Code",
    howToUse: [
      "Paste your text in the input panel",
      "Click Encode to convert special characters to HTML entities",
      "Or click Decode to convert HTML entities back to plain text",
      "Copy the result or swap input/output",
    ],
    faqs: [
      {
        question: "What are HTML entities used for?",
        answer:
          "HTML entities represent special characters in HTML. For example, &lt; displays as '<'. They're essential for safely embedding user-generated content in web pages and preventing XSS attacks.",
      },
      {
        question: "Does this prevent all XSS?",
        answer:
          "Encoding &, <, >, and \" as HTML entities is a key part of XSS prevention but not the complete solution. Always use proper security headers and Content Security Policy alongside encoding.",
      },
    ],
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description:
      "Decode JWT (JSON Web Token) headers and payloads online. Inspect token claims, check expiration, and view formatted timestamps. No verification — inspection only.",
    category: "dev",
    keywords: ["jwt decoder", "decode jwt", "jwt token decoder", "json web token", "jwt parser", "jwt inspector"],
    searchVolume: "~50K/mo",
    isClientSide: true,
    icon: "Key",
    howToUse: [
      "Paste your JWT token in the input area",
      "Click Decode JWT",
      "View the decoded header, payload, and signature",
      "Check if the token is expired based on the 'exp' claim",
    ],
    faqs: [
      {
        question: "Is this secure? Can anyone see my token?",
        answer:
          "All decoding happens in your browser — your token is never sent to any server. However, JWT tokens can be decoded by anyone who has them, so never share tokens or expose them in public places.",
      },
      {
        question: "Does this verify the token signature?",
        answer:
          "No, this tool only decodes the token contents. It does not verify signatures. For signature verification, use a JWT library in your application with the proper secret or public key.",
      },
    ],
  },
  {
    slug: "color-converter",
    title: "Color Converter",
    description:
      "Convert colors between HEX, RGB, and HSL formats online. Live preview, instant conversion in all three formats.",
    category: "dev",
    keywords: ["color converter", "hex to rgb", "rgb to hsl", "color picker", "hex to hsl", "color format converter"],
    searchVolume: "~200K/mo",
    isClientSide: true,
    icon: "Palette",
    howToUse: [
      "Enter a color in any format: HEX (#1a2b3c), RGB (rgb(26, 43, 60)), or HSL (hsl(210, 40%, 17%))",
      "See the color preview box update instantly",
      "Get the converted values in all three formats",
      "Copy any format to clipboard",
    ],
    faqs: [
      {
        question: "What color formats are supported?",
        answer:
          "We support HEX (3/4/6 digit), RGB, and HSL formats. Any valid input in one format is instantly converted to the other two.",
      },
      {
        question: "What is the difference between HSL and RGB?",
        answer:
          "RGB defines colors by mixing Red, Green, and Blue channels (how screens work). HSL describes colors by Hue (the color), Saturation (intensity), and Lightness (how bright). HSL is often more intuitive for designers.",
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
  {
    slug: "word-counter",
    title: "Word Counter",
    description:
      "Count words, characters, lines, sentences, and paragraphs in your text. Real-time stats as you type.",
    category: "calculator",
    keywords: ["word counter", "character counter", "word count online", "text statistics", "character count"],
    searchVolume: "~150K/mo",
    isClientSide: true,
    icon: "Text",
    howToUse: [
      "Paste or type your text in the text area",
      "View real-time statistics: words, characters, lines, sentences, paragraphs",
      "Copy your text or clear to start over",
    ],
    faqs: [
      {
        question: "How are words counted?",
        answer:
          "Words are counted by splitting text on whitespace (spaces, tabs, newlines). Empty lines are excluded. This matches how most word processors count words.",
      },
      {
        question: "Is my text private?",
        answer:
          "Yes. All counting happens in your browser. Your text is never uploaded to any server.",
      },
    ],
  },
  {
    slug: "age-calculator",
    title: "Age Calculator",
    description:
      "Calculate your exact age in years, months, and days. Find total days, weeks, and countdown to your next birthday.",
    category: "calculator",
    keywords: ["age calculator", "calculate age", "birthday calculator", "age in days", "how old am i"],
    searchVolume: "~800K/mo",
    isClientSide: true,
    icon: "Calendar",
    howToUse: [
      "Enter your birth date",
      "Optionally set a different end date (defaults to today)",
      "Click Calculate",
      "See your exact age in years, months, days plus total days, weeks, and next birthday countdown",
    ],
    faqs: [
      {
        question: "How is age calculated?",
        answer:
          "We calculate age precisely accounting for leap years and varying month lengths. The calculation shows the completed years, months, and days since birth.",
      },
      {
        question: "Can I calculate age between any two dates?",
        answer:
          "Yes! Change the 'To Date' field to any date to calculate the age/duration between any two dates. Useful for calculating work anniversaries or event countdowns.",
      },
    ],
  },
  {
    slug: "bmi-calculator",
    title: "BMI Calculator",
    description:
      "Calculate your Body Mass Index (BMI) instantly. See your category, healthy weight range, and visual BMI scale.",
    category: "calculator",
    keywords: ["bmi calculator", "body mass index", "bmi checker", "healthy weight calculator", "bmi chart"],
    searchVolume: "~600K/mo",
    isClientSide: true,
    icon: "Heart",
    howToUse: [
      "Enter your height in centimeters",
      "Enter your weight in kilograms",
      "Click Calculate",
      "See your BMI score, category, and healthy weight range for your height",
    ],
    faqs: [
      {
        question: "What do the BMI categories mean?",
        answer:
          "Underweight: BMI < 18.5. Normal: 18.5–24.9. Overweight: 25–29.9. Obese: ≥ 30. BMI is a screening tool, not a diagnosis. Consult a healthcare professional for a full assessment.",
      },
      {
        question: "Is BMI accurate for everyone?",
        answer:
          "BMI doesn't distinguish between muscle and fat, so very muscular people may be classified as overweight. It's a general guideline — not a substitute for professional medical advice.",
      },
    ],
  },
  {
    slug: "discount-calculator",
    title: "Discount Calculator",
    description:
      "Calculate sale prices instantly. Enter the original price and discount percentage to see your savings and final price.",
    category: "calculator",
    keywords: ["discount calculator", "sale price calculator", "percent off calculator", "price calculator", "savings calculator"],
    searchVolume: "~300K/mo",
    isClientSide: true,
    icon: "Tag",
    howToUse: [
      "Enter the original price (e.g. $100)",
      "Enter the discount percentage (e.g. 20%)",
      "See your savings amount, final price, and savings percentage instantly",
    ],
    faqs: [
      {
        question: "Can I calculate stacked discounts?",
        answer:
          "For multiple discounts, apply them one at a time. For example, a 20% off + extra 10% off: calculate 20% off first, then use that result as the new original price for the 10% discount.",
      },
      {
        question: "Does it work for any currency?",
        answer:
          "Yes! Just use the $ symbol as a placeholder. The math is the same for any currency.",
      },
    ],
  },
  {
    slug: "loan-calculator",
    title: "Loan Calculator",
    description:
      "Calculate monthly loan payments, total interest, and view amortization schedule. Free online loan calculator with full payment breakdown.",
    category: "calculator",
    keywords: ["loan calculator", "mortgage calculator", "amortization calculator", "loan payment", "interest calculator", "monthly payment calculator"],
    searchVolume: "~500K/mo",
    isClientSide: true,
    icon: "Calculator",
    howToUse: [
      "Enter the loan amount (principal)",
      "Enter the annual interest rate (e.g., 5.5 for 5.5%)",
      "Enter the loan term in years",
      "Click Calculate to see monthly payment, total interest, and amortization schedule",
    ],
    faqs: [
      {
        question: "What is amortization?",
        answer:
          "Amortization is the process of paying off a loan with fixed, regular payments. Each payment covers both interest and principal. Early payments are mostly interest, while later payments are mostly principal.",
      },
      {
        question: "Does this include taxes and insurance?",
        answer:
          "No, this calculator shows principal and interest only. For a full monthly housing payment estimate, add property taxes, homeowners insurance, and possibly PMI to the calculated monthly payment.",
      },
    ],
  },
  {
    slug: "tip-calculator",
    title: "Tip Calculator",
    description:
      "Calculate tips instantly. Choose from common tip rates, split the bill among friends, and see per-person amounts. Free online tool.",
    category: "calculator",
    keywords: ["tip calculator", "gratuity calculator", "restaurant tip", "split bill calculator", "tip percentage", "tip amount"],
    searchVolume: "~200K/mo",
    isClientSide: true,
    icon: "Calculator",
    howToUse: [
      "Enter the bill amount",
      "Select a tip percentage or enter a custom amount",
      "Optionally set the number of people to split the bill",
      "See the tip amount, total, and per-person breakdown",
    ],
    faqs: [
      {
        question: "What is the standard tip percentage?",
        answer:
          "In the US and Canada, 15-20% is standard for restaurant service. Other countries have different customs — Japan rarely tips, while the UK often includes a 10-12.5% service charge.",
      },
      {
        question: "How is the per-person split calculated?",
        answer:
          "The tip amount and total bill are divided equally among the number of people you specify. For uneven splits, calculate each person's share individually.",
      },
    ],
  },
  {
    slug: "image-upscaler",
    title: "AI Image Upscaler",
    description:
      "Upscale images by 2x, 3x, or 4x with high-quality interpolation. Enhance resolution without losing quality. Free, instant, browser-based.",
    category: "image",
    keywords: ["image upscaler", "upscale image", "ai upscale", "increase resolution", "image enlarger", "super resolution", "2x upscale"],
    searchVolume: "~300K/mo",
    isClientSide: true,
    isAi: true,
    icon: "Maximize2",
    howToUse: [
      "Upload or drag & drop your image",
      "Select the desired scale factor (2x, 3x, or 4x)",
      "Toggle sharpening for edge enhancement",
      "Download the upscaled image in PNG, JPEG, or WebP format",
    ],
    faqs: [
      {
        question: "How does image upscaling work?",
        answer:
          "Our upscaler uses the browser's high-quality Lanczos/bicubic interpolation and optional unsharp mask sharpening to enlarge images while preserving detail. Processing happens entirely in your browser.",
      },
      {
        question: "Will upscaling reduce image quality?",
        answer:
          "Upscaling always adds pixels that weren't in the original. Our high-quality interpolation minimizes blur and artifacts. The optional sharpening pass enhances edges for a crisper result.",
      },
      {
        question: "What's the maximum upscale?",
        answer:
          "You can upscale images by up to 4x. For example, a 500×500 image becomes 2000×2000. Keep in mind that larger scales will result in larger file sizes.",
      },
    ],
  },
  {
    slug: "remove-background",
    title: "AI Background Remover",
    description:
      "Remove image backgrounds instantly with AI. 100% free, no upload required — all processing happens locally in your browser. Privacy-first.",
    category: "image",
    keywords: ["remove background", "background remover", "ai background removal", "remove bg", "transparent background", "free background remover"],
    searchVolume: "~2M/mo",
    isClientSide: true,
    isAi: true,
    icon: "Sparkles",
    howToUse: [
      "Upload or drag & drop your image",
      "The AI model downloads once (~40MB, cached for future visits)",
      "Wait a few seconds while the AI processes your image",
      "Download the result with transparent background",
    ],
    faqs: [
      {
        question: "Is this really free?",
        answer:
          "Yes, completely free with no limits. All AI processing runs locally in your browser using ONNX runtime — your images never leave your device.",
      },
      {
        question: "How does the AI background removal work?",
        answer:
          "We use the ISNet (Image Segmentation Network) model running in your browser via WebAssembly. It detects the main subject in your image and separates it from the background with pixel-level accuracy.",
      },
      {
        question: "Will my image quality be preserved?",
        answer:
          "Yes, the output is a PNG with lossless quality and a transparent background. You can also choose JPEG or WebP format with adjustable quality if you need a smaller file.",
      },
      {
        question: "How long does it take?",
        answer:
          "The first use downloads the AI model (~40MB, cached after that). Processing takes 2-10 seconds depending on image size and your device. GPU acceleration is used when available.",
      },
    ],
  },
];
