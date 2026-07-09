import type { ToolConfig } from "../types";

export const toolRegistry: ToolConfig[] = [
  // ── 图片工具 ──────────────────────────────────────────
  {
    slug: "heic-to-jpg",
    title: "HEIC 转 JPG 转换器",
    description:
      "在线免费将 HEIC 图片转换为 JPG 格式。无需上传——所有处理均在浏览器中完成。",
    category: "image",
    keywords: ["heic转jpg", "heic转换器", "heic转jpg在线", "免费heic转换", "苹果照片转换"],
    searchVolume: "~500K/mo",
    isClientSide: true,
    icon: "Image",
    howToUse: [
      "点击上传区域或拖放您的 HEIC 文件",
      "等待转换完成（大多数文件即时完成）",
      "预览转换后的 JPG 图片",
      "点击下载将 JPG 文件保存到您的设备",
    ],
    faqs: [
      {
        question: "什么是 HEIC 文件？",
        answer:
          "HEIC（高效图像容器）是 Apple 自 iOS 11 以来在 iPhone 和 iPad 上使用的现代图像格式。它比 JPEG 提供更好的压缩率，但兼容性较差。",
      },
      {
        question: "转换是免费的吗？",
        answer:
          "是的，我们的 HEIC 转 JPG 转换器完全免费。所有处理均在您的浏览器中完成——您的文件不会离开您的设备。",
      },
      {
        question: "会损失图片质量吗？",
        answer:
          "我们默认以最高质量转换。生成的 JPG 将尽可能保留原始 HEIC 文件的细节。",
      },
    ],
  },
  {
    slug: "png-to-jpg",
    title: "PNG 转 JPG 转换器",
    description:
      "在线免费将 PNG 图片转换为 JPG 格式。在保持质量的同时减小文件体积。所有处理均在浏览器中完成。",
    category: "image",
    keywords: ["png转jpg", "png转换器", "png转jpeg", "png转jpg在线", "免费png转换"],
    searchVolume: "~150K/mo",
    isClientSide: true,
    icon: "Image",
    howToUse: [
      "通过点击或拖放上传您的 PNG 图片",
      "转换在浏览器中即时运行",
      "预览转换后的 JPG 图片",
      "下载为 JPG — 通常比 PNG 小 50-80%",
    ],
    faqs: [
      {
        question: "为什么要将 PNG 转换为 JPG？",
        answer:
          "PNG 文件通常比 JPG 大得多，因为它们支持透明通道和无损压缩。如果您不需要透明背景，转换为 JPG 可以将文件大小减少 50-80%。",
      },
      {
        question: "会损失质量吗？",
        answer:
          "我们以高质量（92%）进行转换。对于照片和复杂图片，质量差异几乎不可察觉，而文件大小的减小非常显著。对于有锐利边缘和文字的图形，建议保留 PNG 格式。",
      },
      {
        question: "我的文件安全吗？",
        answer:
          "安全。所有处理均在浏览器端完成。您的文件永远不会上传到任何服务器。",
      },
    ],
  },
  {
    slug: "image-cropper",
    title: "图片裁剪器",
    description:
      "在线免费裁剪图片。选择任意区域，即时预览并下载。所有处理均在浏览器中完成。",
    category: "image",
    keywords: ["图片裁剪", "裁剪照片", "在线裁剪图片", "图片裁切", "照片裁剪器"],
    searchVolume: "~200K/mo",
    isClientSide: true,
    icon: "Crop",
    howToUse: [
      "通过点击或拖放上传您的图片",
      "在图片上点击并拖动以选择裁剪区域",
      "点击裁剪应用",
      "预览并下载裁剪后的图片",
    ],
    faqs: [
      {
        question: "支持哪些输出格式？",
        answer:
          "裁剪后的图片默认下载为 JPG 格式，在质量和文件大小之间取得良好平衡。",
      },
      {
        question: "我的图片安全吗？",
        answer:
          "安全。所有裁剪操作均在浏览器中完成。您的图片不会被上传到任何服务器。",
      },
    ],
  },
  {
    slug: "image-to-base64",
    title: "图片转 Base64 转换器",
    description:
      "在线将图片转换为 Base64 数据 URL。可直接嵌入 HTML、CSS 或 JSON。无需上传。",
    category: "image",
    keywords: ["图片转base64", "base64图片", "图片转数据url", "base64编码图片", "在线图片base64"],
    searchVolume: "~60K/mo",
    isClientSide: true,
    icon: "FileCode",
    howToUse: [
      "通过点击或拖放上传您的图片",
      "Base64 数据 URL 即时生成",
      "将 Base64 字符串复制到剪贴板",
      "用于 HTML <img> 标签或 CSS 背景",
    ],
    faqs: [
      {
        question: "Base64 图片编码有什么用途？",
        answer:
          "Base64 编码的图片可以直接嵌入 HTML 或 CSS 中，无需单独的文件。对于小图标这类小图片，可以减少 HTTP 请求数量，但会使 HTML 大小增加约 33%。",
      },
      {
        question: "有文件大小限制吗？",
        answer:
          "由于处理在客户端完成，没有服务器限制。但 Base64 编码会增加约 33% 的文件大小，因此最适合 100KB 以下的小图片。",
      },
    ],
  },
  {
    slug: "webp-to-jpg",
    title: "WebP 转 JPG 转换器",
    description:
      "在线免费将 WebP 图片转换为 JPG 格式。基于浏览器的转换，无需上传文件。",
    category: "image",
    keywords: ["webp转jpg", "webp转换器", "webp转jpg在线", "免费webp转换", "图片格式转换"],
    searchVolume: "~200K/mo",
    isClientSide: true,
    icon: "Image",
    howToUse: [
      "通过点击或拖放上传您的 WebP 图片",
      "转换在浏览器中即时运行",
      "预览结果",
      "下载为 JPG",
    ],
    faqs: [
      {
        question: "为什么要将 WebP 转换为 JPG？",
        answer:
          "虽然 WebP 提供了出色的压缩率，但 JPG 在所有设备、应用和平台上都得到普遍支持。",
      },
      {
        question: "我的文件安全吗？",
        answer:
          "安全。所有处理均在浏览器端完成。您的文件永远不会上传到任何服务器。",
      },
    ],
  },
  {
    slug: "image-compressor",
    title: "图片压缩器",
    description:
      "在线免费压缩图片。在不损失质量的情况下减小文件大小。所有处理均在浏览器中完成。",
    category: "image",
    keywords: [
      "图片压缩",
      "压缩图片",
      "减小图片大小",
      "在线压缩图片",
      "图片大小缩小器",
    ],
    searchVolume: "~1.5M/mo",
    isClientSide: true,
    icon: "Image",
    howToUse: [
      "通过点击或拖放上传您的图片",
      "调整质量滑块来控制压缩程度",
      "预览压缩结果和文件大小节省情况",
      "下载优化后的图片",
    ],
    faqs: [
      {
        question: "会损失图片质量吗？",
        answer:
          "我们的智能压缩技术可平衡质量和文件大小。使用质量滑块找到合适的平衡点——建议照片使用 80% 的质量。",
      },
      {
        question: "支持哪些图片格式？",
        answer:
          "我们支持 JPEG、PNG、WebP 和大多数常见图片格式。输出格式默认与输入格式一致。",
      },
      {
        question: "我的图片安全吗？",
        answer:
          "安全。所有压缩均在您的浏览器中完成。您的图片永远不会上传到任何服务器。",
      },
    ],
  },
  {
    slug: "image-resizer",
    title: "图片尺寸调整器",
    description:
      "在线免费调整图片尺寸。设置精确尺寸，保持宽高比。所有处理均在浏览器中完成。",
    category: "image",
    keywords: ["图片调整大小", "调整图片尺寸", "图片缩放", "修改图片大小", "照片调整"],
    searchVolume: "~300K/mo",
    isClientSide: true,
    icon: "Crop",
    howToUse: [
      "上传您的图片",
      "输入新的宽度和/或高度",
      "开启/关闭宽高比锁定",
      "预览并下载调整后的图片",
    ],
    faqs: [
      {
        question: "调整大小会降低质量吗？",
        answer:
          "缩小尺寸能很好地保持质量。放大可能会导致一些模糊。我们以高质量渲染以尽量减少质量损失。",
      },
      {
        question: "宽高比锁定的作用是什么？",
        answer:
          "锁定后，更改宽度会自动调整高度（反之亦然）以保持原始比例。解锁后可独立设置宽度和高度。",
      },
    ],
  },
  {
    slug: "gif-maker",
    title: "GIF 制作器",
    description:
      "在线免费将多张图片制作成动画 GIF。设置帧延迟、调整顺序并下载。所有处理均在浏览器中完成。",
    category: "image",
    keywords: ["gif制作", "制作gif", "动画gif", "图片转gif", "gif生成器", "在线gif制作"],
    searchVolume: "~100K/mo",
    isClientSide: true,
    icon: "Film",
    howToUse: [
      "上传 2 张或更多图片",
      "按所需顺序排列帧",
      "设置帧延迟（动画速度）",
      "点击创建 GIF 并下载",
    ],
    faqs: [
      {
        question: "最多能使用多少帧？",
        answer:
          "没有硬性限制，但为获得最佳效果，建议保持在 50 帧以内。帧数过多可能导致生成缓慢且文件较大。",
      },
      {
        question: "如何控制动画速度？",
        answer:
          "帧延迟（毫秒）控制每帧显示的时间。数值越低动画越快。默认的 500ms 每帧显示半秒。",
      },
    ],
  },
  {
    slug: "svg-to-png",
    title: "SVG 转 PNG 转换器",
    description:
      "在线免费将 SVG 图片转换为 PNG 格式。上传 SVG 文件或直接粘贴代码。以 2 倍分辨率渲染，获得清晰输出。",
    category: "image",
    keywords: ["svg转png", "svg转换器", "svg转png在线", "svg转位图", "免费svg转换"],
    searchVolume: "~80K/mo",
    isClientSide: true,
    icon: "Image",
    howToUse: [
      "上传 SVG 文件或粘贴 SVG 代码",
      "点击转换为 PNG",
      "预览渲染后的 PNG 输出",
      "下载 PNG 文件（2 倍分辨率渲染，画质清晰）",
    ],
    faqs: [
      {
        question: "支持复杂的 SVG 吗？",
        answer:
          "是的，我们使用浏览器的原生 SVG 引擎以 2 倍分辨率渲染 SVG。支持内联样式、渐变和基本动画（静态首帧）。",
      },
      {
        question: "输出质量如何？",
        answer:
          "PNG 以原始 SVG 尺寸的 2 倍渲染，获得清晰的视网膜级别输出。输出为标准 PNG，保留透明背景。",
      },
    ],
  },

  // ── PDF 工具 ────────────────────────────────────────────
  {
    slug: "jpg-to-pdf",
    title: "JPG 转 PDF 转换器",
    description:
      "在线免费将 JPG 图片转换为 PDF。可将多张图片合并为单个 PDF 文档。完全基于浏览器。",
    category: "pdf",
    keywords: ["jpg转pdf", "图片转pdf", "jpg转pdf在线", "图片合并pdf", "免费jpg转pdf"],
    searchVolume: "~6.9M/mo",
    isClientSide: true,
    icon: "FileText",
    howToUse: [
      "点击或拖放上传您的 JPG 或 PNG 图片",
      "按照您希望在 PDF 中的顺序排列图片",
      "选择您偏好的页面尺寸（A4、Letter 等）",
      "点击转换并下载您的 PDF",
    ],
    faqs: [
      {
        question: "可以将多张图片合并为一个 PDF 吗？",
        answer:
          "可以！上传多张图片，它们将按您排列的顺序合并为一个 PDF，每张图片一页。",
      },
      {
        question: "支持哪些图片格式？",
        answer: "我们支持 JPEG 和 PNG 图片。每张图片在生成的 PDF 中占据一页。",
      },
      {
        question: "有文件大小限制吗？",
        answer:
          "所有处理均在浏览器中完成，因此限制取决于您设备的内存。为获得最佳效果，请将单张图片保持在 20MB 以下。",
      },
    ],
  },
  {
    slug: "pdf-to-jpg",
    title: "PDF 转 JPG 转换器",
    description:
      "在线免费将 PDF 页面转换为 JPG 图片。提取所有页面或选择特定页面。无需上传文件。",
    category: "pdf",
    keywords: ["pdf转jpg", "pdf转图片", "pdf转jpg在线", "免费pdf转换", "提取pdf页面"],
    searchVolume: "~9.9M/mo",
    isClientSide: true,
    icon: "FileText",
    howToUse: [
      "点击或拖放上传您的 PDF 文件",
      "等待页面渲染（通常即时完成）",
      "预览所有提取的页面",
      "将单个页面下载为 JPG 或一次性下载全部",
    ],
    faqs: [
      {
        question: "JPG 输出中的文字会清晰吗？",
        answer:
          "会的，我们以 2 倍分辨率渲染 PDF 页面，确保生成的 JPG 图片中文字和图形清晰锐利。",
      },
      {
        question: "可以只转换特定页面吗？",
        answer:
          "目前我们转换所有页面。您可以从结果网格中选择要下载的页面。",
      },
    ],
  },
  {
    slug: "merge-pdf",
    title: "PDF 合并工具",
    description:
      "在线免费将多个 PDF 文件合并为一个文档。拖放以调整顺序。",
    category: "pdf",
    keywords: ["pdf合并", "合并pdf", "pdf合并在线", "免费pdf合并", "pdf文件合并"],
    searchVolume: "~3M/mo",
    isClientSide: true,
    icon: "FileText",
    howToUse: [
      "上传您要合并的所有 PDF 文件",
      "按正确顺序排列它们",
      "点击合并 PDF",
      "下载合并后的 PDF 文件",
    ],
    faqs: [
      {
        question: "合并 PDF 的数量有限制吗？",
        answer:
          "没有硬性限制——所有处理均在浏览器中完成。但非常大量或很大的 PDF 可能会拖慢您的设备。",
      },
      {
        question: "格式会被保留吗？",
        answer:
          "是的！我们使用 PDF-lib，它能保留原始 PDF 中的所有内容、字体和格式。",
      },
    ],
  },
  {
    slug: "compress-pdf",
    title: "压缩 PDF",
    description:
      "在线免费压缩 PDF 文件。在保持质量的同时减小文件体积。所有处理均在浏览器中完成。",
    category: "pdf",
    keywords: ["压缩pdf", "减小pdf大小", "pdf压缩器", "在线压缩pdf", "pdf体积减小"],
    searchVolume: "~2M/mo",
    isClientSide: true,
    icon: "FileArchive",
    howToUse: [
      "点击或拖放上传 PDF 文件",
      "点击压缩 PDF",
      "查看体积缩减百分比",
      "下载压缩后的 PDF",
    ],
    faqs: [
      {
        question: "PDF 能压缩多少？",
        answer:
          "取决于 PDF 内容。包含大量图片的 PDF 可减少 10-30%。文本为主的 PDF 通过移除未使用对象和优化结构，可节省 20-50% 的空间。",
      },
      {
        question: "会影响质量吗？",
        answer:
          "我们的压缩优化 PDF 结构而不改变可见内容。文本、图片和格式与原始文件完全一致。",
      },
    ],
  },
  {
    slug: "split-pdf",
    title: "分割 PDF",
    description:
      "在线免费将 PDF 分割为单独页面。提取特定页码范围或分割全部页面。基于浏览器，无需上传。",
    category: "pdf",
    keywords: ["分割pdf", "提取pdf页面", "pdf分割器", "分离pdf页面", "在线分割pdf"],
    searchVolume: "~500K/mo",
    isClientSide: true,
    icon: "Scissors",
    howToUse: [
      "上传您的 PDF 文件",
      "点击「分割全部页面」将每页提取为单独的 PDF",
      "或输入页码范围（如 1-5）提取特定页面",
      "下载单页或提取的页码范围",
    ],
    faqs: [
      {
        question: "可以提取特定页面吗？",
        answer:
          "可以！使用页码范围输入框提取任意范围（如 3-7）。分割后每页也可单独下载。",
      },
      {
        question: "我的 PDF 安全吗？",
        answer:
          "安全。所有分割操作均在浏览器中完成，您的 PDF 文件不会上传到任何服务器。",
      },
    ],
  },
  {
    slug: "rotate-pdf",
    title: "旋转 PDF",
    description:
      "在线免费旋转 PDF 页面。选择 90°、180° 或 270° 旋转。所有处理在浏览器中完成——无需上传文件。",
    category: "pdf",
    keywords: ["旋转pdf", "旋转pdf页面", "pdf旋转", "翻转pdf", "在线旋转pdf"],
    searchVolume: "~100K/mo",
    isClientSide: true,
    icon: "RotateCw",
    howToUse: [
      "上传您的 PDF 文件",
      "选择旋转角度：顺时针 90°、180° 或 270°（逆时针 90°）",
      "点击对所有页面应用旋转",
      "下载旋转后的 PDF",
    ],
    faqs: [
      {
        question: "会旋转所有页面吗？",
        answer:
          "是的，旋转应用于 PDF 中的每一页。可选择顺时针 90°、180° 或 270°（逆时针 90°）。",
      },
      {
        question: "能否只旋转特定页面？",
        answer:
          "目前旋转应用于所有页面。如需仅旋转特定页面，请先分割 PDF，单独旋转页面，再合并。",
      },
    ],
  },
  {
    slug: "pdf-reorder",
    title: "PDF 页面重排",
    description:
      "在线免费重排 PDF 页面顺序。拖放调整页面顺序、反转页面顺序或自定义页面排列。",
    category: "pdf",
    keywords: ["重排pdf页面", "调整pdf", "pdf页面顺序", "反转pdf", "pdf页面排序"],
    searchVolume: "~30K/mo",
    isClientSide: true,
    icon: "GripVertical",
    howToUse: [
      "上传您的 PDF",
      "拖放页面标签调整顺序",
      "使用「反转」按钮快速反转页面顺序",
      "点击「应用排序」并下载重排后的 PDF",
    ],
    faqs: [
      {
        question: "页面重排是如何工作的？",
        answer:
          "上传后，您会看到每个页面显示为可拖动的标签。将页面拖动到所需顺序，点击「应用排序」，PDF 将按新顺序重新构建。",
      },
      {
        question: "重排时可以删除页面吗？",
        answer:
          "目前重排功能调整现有页面顺序。如需删除页面，请使用分割 PDF 工具提取想要保留的页面。",
      },
    ],
  },

  // ── Markdown 工具 ───────────────────────────────────────
  {
    slug: "markdown",
    title: "Markdown 工作台 — 在线编辑器与转换器",
    description:
      "一体化 Markdown 工具：实时预览编辑、导出为 HTML/DOCX/PPTX/PDF、格式化美化、从 URL/HTML/DOCX 导入。免费、基于浏览器、无需上传。",
    category: "markdown",
    keywords: [
      "markdown编辑器",
      "markdown转换器",
      "markdown转html",
      "markdown转pdf",
      "markdown格式化",
      "html转markdown",
      "在线markdown编辑器",
      "免费markdown编辑器",
      "markdown转word",
    ],
    searchVolume: "~400K/mo",
    isClientSide: true,
    icon: "Edit3",
    howToUse: [
      "在编辑标签中编写或粘贴 Markdown，实时预览",
      "切换到导出标签，下载为 HTML、DOCX、PPTX 或 PDF",
      "使用美化标签清理和规范化 Markdown 格式",
      "在导入标签中从 URL、HTML 代码或 Word 文档导入内容",
    ],
    faqs: [
      {
        question: "支持哪些 Markdown 风格？",
        answer:
          "我们支持 GitHub 风格的 Markdown（GFM），包括表格、任务列表、删除线、代码块和自动链接。",
      },
      {
        question: "可以将 Markdown 导出为 Word 或 PowerPoint 吗？",
        answer:
          "可以！导出标签提供一键下载 DOCX（Word）、PPTX（PowerPoint）、PDF 和自包含 HTML 的按钮。所有转换均在浏览器中完成。",
      },
      {
        question: "可以将 AI 聊天输出转换为格式化文档吗？",
        answer:
          "是的！ChatGPT、Claude、Gemini 和其他 AI 工具默认输出 Markdown。直接粘贴到工作台即可预览、美化并导出为任何格式。",
      },
      {
        question: "可以从网页导入吗？",
        answer:
          "可以，导入标签支持输入任意 URL 并将页面内容转换为干净的 Markdown。也可以直接粘贴 HTML 或上传 Word 文档（.docx）。",
      },
      {
        question: "格式化功能会改变我的内容吗？",
        answer:
          "不会改变内容——只调整格式和间距。美化标签会规范化标题间距、修复列表缩进、删除尾部空格并统一代码块标记。",
      },
      {
        question: "我的数据安全吗？",
        answer:
          "安全。所有处理完全在您的浏览器中进行。任何内容都不会上传到服务器。您的文件仅保留在您的设备上。",
      },
    ],
  },
  {
    slug: "markdown-to-html",
    hidden: true,
    title: "Markdown 转 HTML 转换器",
    description:
      "即时将 Markdown 转换为 HTML。非常适合将 AI 聊天输出、README 文件和文档转换为干净的 HTML。",
    category: "markdown",
    keywords: [
      "markdown转html",
      "md转html",
      "markdown在线转换",
      "markdown编辑器",
      "免费markdown转换",
    ],
    searchVolume: "~50K/mo",
    isClientSide: true,
    icon: "FileCode",
    howToUse: [
      "在左侧面板粘贴您的 Markdown 文本",
      "在右侧查看实时 HTML 预览",
      "切换到 HTML 选项卡查看或复制原始 HTML",
      "点击复制到剪贴板或下载为 .html 文件",
    ],
    faqs: [
      {
        question: "支持哪些 Markdown 风格？",
        answer:
          "我们支持 GitHub Flavored Markdown (GFM)，包括表格、任务列表、删除线、代码块和自动链接。",
      },
      {
        question: "可以转换 AI 聊天输出吗？",
        answer:
          "可以！ChatGPT、Claude、Gemini 和其他 AI 工具默认输出 Markdown。直接粘贴到我们的转换器即可获得干净、安全的 HTML。",
      },
      {
        question: "HTML 输出包含样式吗？",
        answer:
          "是的，下载的 HTML 文件包含内置的 CSS 样式，适用于排版、代码块、表格和引用块——让您的文档看起来精致，无需外部样式表。",
      },
      {
        question: "可以导出为其他格式吗？",
        answer:
          "可以！编辑器还支持下载为 DOCX（Word 文档）或 PPTX（PowerPoint），方便您将 Markdown 转换为所需的格式。",
      },
    ],
  },
  {
    slug: "markdown-editor",
    hidden: true,
    title: "在线 Markdown 编辑器",
    description:
      "免费的在线 Markdown 编辑器，支持实时预览。编写、预览和导出 Markdown，支持语法高亮和 GitHub Flavored Markdown。",
    category: "markdown",
    keywords: [
      "markdown在线编辑器",
      "在线markdown编辑",
      "markdown预览",
      "免费markdown编辑器",
      "md编辑器",
    ],
    searchVolume: "~60K/mo",
    isClientSide: true,
    icon: "Edit3",
    howToUse: [
      "在左侧编辑面板中编写 Markdown",
      "在右侧查看实时渲染预览",
      "使用选项卡在预览和原始 HTML 视图之间切换",
      "导出为 HTML、DOCX、PPTX 或复制到剪贴板",
    ],
    faqs: [
      {
        question: "可以将 Markdown 导出为 Word 或 PowerPoint 吗？",
        answer:
          "可以！编辑器内置了 DOCX（Word）和 PPTX（PowerPoint）导出按钮。只需编写或粘贴 Markdown，然后点击您需要的格式即可。",
      },
      {
        question: "可以离线使用吗？",
        answer:
          "可以，加载后编辑器可完全在浏览器中运行。您可以在没有网络连接的情况下编写和预览 Markdown。",
      },
    ],
  },
  {
    slug: "markdown-table-generator",
    hidden: true,
    title: "Markdown 表格生成器",
    description:
      "可视化生成 Markdown 表格。通过类似电子表格的界面构建表格，并即时复制 Markdown 输出。",
    category: "markdown",
    keywords: [
      "markdown表格生成器",
      "markdown表格",
      "md表格生成",
      "创建markdown表格",
      "在线制表",
    ],
    searchVolume: "~20K/mo",
    isClientSide: true,
    icon: "Table",
    howToUse: [
      "设置您需要的行数和列数",
      "填写表格单元格",
      "Markdown 输出实时更新",
      "复制或下载 Markdown 表格代码",
    ],
    faqs: [
      {
        question: "可以为列添加对齐吗？",
        answer:
          "可以，您可以使用对齐控件为每列设置左对齐、居中或右对齐。",
      },
      {
        question: "支持 GitHub Flavored Markdown 表格吗？",
        answer: "支持，生成的表格遵循 GFM 语法，适用于 GitHub、GitLab 和大多数 Markdown 渲染器。",
      },
    ],
  },
  {
    slug: "markdown-to-docx",
    hidden: true,
    title: "Markdown 转 DOCX 转换器",
    description:
      "在线免费将 Markdown 转换为 Word 文档（DOCX）。保留标题、表格、代码块和格式。完全基于浏览器。",
    category: "markdown",
    keywords: [
      "markdown转docx",
      "md转word",
      "markdown转word在线",
      "免费md转docx",
      "markdown文档转换",
    ],
    searchVolume: "~20K/mo",
    isClientSide: true,
    icon: "FileText",
    howToUse: [
      "在输入区域粘贴您的 Markdown 文本",
      "点击转换为 DOCX",
      "等待转换（通常即时完成）",
      "将 .docx 文件下载到您的设备",
    ],
    faqs: [
      {
        question: "会保留 Markdown 的格式吗？",
        answer:
          "是的！标题、加粗、斜体、代码、表格、列表和链接都会在 DOCX 输出中保留，并配有合适的 Word 样式。",
      },
      {
        question: "真的是免费的吗？",
        answer:
          "是的，完全免费。所有转换均在浏览器中完成——无需将文件上传到任何服务器。",
      },
      {
        question: "可以转换大型 Markdown 文件吗？",
        answer:
          "可以，没有文件大小限制，因为处理是在本地完成的。非常大的文档（100+ 页）可能需要几秒钟时间。",
      },
    ],
  },
  {
    slug: "markdown-to-pptx",
    hidden: true,
    title: "Markdown 转 PPTX 转换器",
    description:
      "在线免费将 Markdown 转换为 PowerPoint 演示文稿（PPTX）。每个标题成为一张新幻灯片。基于浏览器，无需上传。",
    category: "markdown",
    keywords: [
      "markdown转pptx",
      "md转ppt",
      "markdown转powerpoint",
      "免费md转pptx",
      "markdown演示文稿",
    ],
    searchVolume: "~8K/mo",
    isClientSide: true,
    icon: "Presentation",
    howToUse: [
      "在输入区域粘贴您的 Markdown",
      "使用 ## 标题来定义幻灯片分隔",
      "点击转换为 PPTX",
      "下载 .pptx 演示文稿",
    ],
    faqs: [
      {
        question: "幻灯片是如何创建的？",
        answer:
          "顶级标题（# 标题）成为标题幻灯片。每个 ## 标题成为一张新幻灯片，包含其内容、列表和表格。",
      },
      {
        question: "可以包含图片吗？",
        answer:
          "Markdown 中的图片引用（![alt](url)）会在演示文稿中标注为占位符。如需完整图片支持，请在导出后手动嵌入到 PowerPoint 中。",
      },
      {
        question: "可以创建多少张幻灯片？",
        answer:
          "没有硬性限制——所有处理均在浏览器中完成。包含 50+ 张幻灯片的演示文稿可能需要一点时间生成。",
      },
    ],
  },
  {
    slug: "docx-to-markdown",
    hidden: true,
    title: "DOCX 转 Markdown 转换器",
    description:
      "在线免费将 Word 文档（DOCX）转换为 Markdown。从 Word 文件中提取文本、标题和格式，生成干净的 Markdown。",
    category: "markdown",
    keywords: [
      "docx转markdown",
      "word转markdown",
      "docx转md",
      "免费word转md",
      "word文档转换",
    ],
    searchVolume: "~15K/mo",
    isClientSide: true,
    icon: "FileText",
    howToUse: [
      "点击或拖放上传您的 .docx 文件",
      "等待转换（大多数文件即时完成）",
      "预览提取的 Markdown",
      "复制到剪贴板或下载为 .md 文件",
    ],
    faqs: [
      {
        question: "会保留所有格式吗？",
        answer:
          "我们会保留标题、加粗、斜体、列表、链接和表格。复杂的 Word 格式如文本框和嵌入图表可能无法完美转换。",
      },
      {
        question: "我的文档安全吗？",
        answer:
          "安全。您的 DOCX 文件完全在浏览器中处理。不会上传任何内容到服务器。",
      },
    ],
  },
  {
    slug: "html-to-markdown",
    hidden: true,
    title: "HTML 转 Markdown 转换器",
    description:
      "将 HTML 代码即时转换为干净的 Markdown。粘贴任意 HTML 即可获取格式良好的 Markdown 输出。免费、快速、浏览器端处理。",
    category: "markdown",
    keywords: ["html 转 markdown", "html 转 md", "html markdown 转换", "html 转 markdown 在线"],
    searchVolume: "~80K/mo",
    isClientSide: true,
    icon: "FileCode",
    howToUse: [
      "在输入面板中粘贴您的 HTML 代码",
      "点击转换按钮将其转为 Markdown",
      "查看输出的 Markdown",
      "复制结果或直接使用",
    ],
    faqs: [
      {
        question: "支持哪些 HTML 元素？",
        answer:
          "支持大多数常见元素：标题、段落、列表、链接、图片、表格、代码块、引用块和内联格式（加粗、斜体）。复杂的嵌套结构会被展平为合理的 Markdown。",
      },
      {
        question: "我的 HTML 数据安全吗？",
        answer: "安全。所有处理均在浏览器中完成。您的 HTML 不会离开您的设备。",
      },
    ],
  },
  {
    slug: "markdown-formatter",
    hidden: true,
    title: "Markdown 格式化与美化器",
    description:
      "格式化和美化凌乱的 Markdown。一键修复间距、规范化标题、清理列表，让 Markdown 变得整洁易读。",
    category: "markdown",
    keywords: ["markdown 格式化", "markdown 美化", "格式化 markdown", "markdown 排版"],
    searchVolume: "~40K/mo",
    isClientSide: true,
    icon: "Sparkles",
    howToUse: [
      "在输入面板中粘贴您的 Markdown 文本",
      "点击格式化以规范间距和结构",
      "查看清理后的 Markdown 输出",
      "复制结果或粘贴回您的编辑器中",
    ],
    faqs: [
      {
        question: "格式化器修复什么？",
        answer:
          "它规范标题间距、修复列表缩进、确保段落间的空行、移除尾部空格，并将代码围栏标准化（~~~ → ```）。",
      },
      {
        question: "会改变我的 Markdown 内容吗？",
        answer:
          "不会改变内容——仅调整格式和间距。标题、列表、链接和文本保持完全不变，只是更有条理。",
      },
    ],
  },
  {
    slug: "markdown-to-pdf",
    hidden: true,
    title: "Markdown 转 PDF 转换器",
    description:
      "将 Markdown 转换为专业排版的 PDF。实时预览、打印为 PDF 和 HTML 下载。免费、即时、浏览器端处理。",
    category: "markdown",
    keywords: ["markdown 转 pdf", "md 转 pdf", "markdown pdf 转换", "markdown 导出 pdf"],
    searchVolume: "~100K/mo",
    isClientSide: true,
    icon: "FileText",
    howToUse: [
      "在编辑器中粘贴或编写 Markdown",
      "点击预览查看渲染后的文档",
      "点击打印为 PDF 保存为 PDF 文件",
      "或下载为带样式的 HTML 文件",
    ],
    faqs: [
      {
        question: "Markdown 转 PDF 如何工作？",
        answer:
          "您的 Markdown 会被渲染为专业排版的 HTML 文档。您可以预览，然后使用浏览器的「打印 → 另存为 PDF」功能生成最终的 PDF 文件。",
      },
      {
        question: "可以自定义 PDF 样式吗？",
        answer:
          "默认样式包含清晰的排版、代码高亮和友好的打印格式。如需高级自定义，可下载 HTML 文件并修改 CSS。",
      },
    ],
  },
  {
    slug: "url-to-markdown",
    hidden: true,
    title: "URL 转 Markdown 转换器",
    description:
      "将任何网页转换为干净的 Markdown。粘贴 URL，即可将主要内容提取为格式良好的 Markdown。非常适合研究和笔记。",
    category: "markdown",
    keywords: ["url 转 markdown", "网页转 markdown", "网址转 markdown", "网站转 markdown"],
    searchVolume: "~60K/mo",
    isClientSide: true,
    icon: "Globe",
    howToUse: [
      "在输入框中粘贴网页 URL",
      "点击获取以下载并转换页面",
      "查看提取的 Markdown 内容",
      "复制或下载 Markdown 文件",
    ],
    faqs: [
      {
        question: "为什么有些 URL 会失败？",
        answer:
          "部分网站阻止跨域请求（CORS 策略）。如果某个 URL 转换失败，请尝试将页面 HTML 源码粘贴到我们的 HTML 转 Markdown 工具中。",
      },
      {
        question: "转换准确吗？",
        answer:
          "我们会提取主要内容区域（<main>、<article> 或 <body>）并转换为 Markdown。导航、脚本和样式会被剥离。大多数文章和文档页面都能干净地转换。",
      },
    ],
  },

  // ── 开发者工具 ──────────────────────────────────────
  {
    slug: "json-formatter",
    title: "JSON 格式化与验证器",
    description:
      "在线格式化、验证和美化 JSON。支持树形视图、语法高亮和错误检测——全部在浏览器中完成。",
    category: "dev",
    keywords: [
      "json格式化",
      "json验证器",
      "json美化",
      "在线格式化json",
      "json编辑器",
    ],
    searchVolume: "~250K/mo",
    isClientSide: true,
    icon: "Braces",
    howToUse: [
      "在输入区域粘贴您的 JSON 字符串",
      "点击格式化美化，或点击压缩精简",
      "树形视图让您探索复杂的 JSON 结构",
      "复制格式化后的输出或下载为 .json 文件",
    ],
    faqs: [
      {
        question: "能修复无效的 JSON 吗？",
        answer:
          "我们的验证器会高亮显示错误的具体位置和问题所在。您需要修复源代码，但我们可以帮您轻松找到问题。",
      },
      {
        question: "我的 JSON 数据安全吗？",
        answer: "安全，所有处理均在浏览器中完成。您的数据不会离开您的设备。",
      },
    ],
  },
  {
    slug: "base64-encode-decode",
    title: "Base64 编码 / 解码器",
    description:
      "将文本编码为 Base64 或将 Base64 解码回文本。简单、快速、完全基于浏览器。",
    category: "dev",
    keywords: [
      "base64编码",
      "base64解码",
      "base64转换器",
      "在线base64",
      "编码解码工具",
    ],
    searchVolume: "~120K/mo",
    isClientSide: true,
    icon: "Binary",
    howToUse: [
      "在输入区域粘贴您的文本或 Base64 字符串",
      "点击编码将文本转换为 Base64",
      "点击解码将 Base64 转换回文本",
      "将结果复制到剪贴板",
    ],
    faqs: [
      {
        question: "Base64 编码有什么用途？",
        answer:
          "Base64 编码将二进制数据转换为 ASCII 文本。常用于在 HTML/CSS 中嵌入图片、API 认证令牌和数据 URL。",
      },
      {
        question: "Base64 是加密吗？",
        answer: "不是，Base64 是编码而非加密。它可以轻松还原。绝不要用它来存储密码等敏感数据。",
      },
    ],
  },
  {
    slug: "url-encode-decode",
    title: "URL 编码 / 解码器",
    description:
      "将文本编码为 URL 安全格式，或将 URL 编码的字符串解码回纯文本。快速、完全基于浏览器。",
    category: "dev",
    keywords: ["url编码", "url解码", "url百分号编码", "在线url编码", "url转码"],
    searchVolume: "~100K/mo",
    isClientSide: true,
    icon: "Link",
    howToUse: [
      "在输入区域粘贴您的文本或 URL 编码字符串",
      "点击编码将文本转换为 URL 安全格式",
      "点击解码将 URL 编码字符串转换回纯文本",
      "将结果复制到剪贴板",
    ],
    faqs: [
      {
        question: "URL 编码有什么用途？",
        answer:
          "URL 编码将特殊字符（空格、符号、非 ASCII 字符）转换为 URL 安全的格式。例如，空格变成 %20。这对于在查询字符串和表单提交中传递数据至关重要。",
      },
      {
        question: "encodeURI 和 encodeURIComponent 有什么区别？",
        answer:
          "我们使用 encodeURIComponent，它会对所有特殊字符（包括 / ? & = #）进行编码。这是编码单个查询参数值的最安全方法。",
      },
    ],
  },
  {
    slug: "uuid-generator",
    title: "UUID 生成器",
    description: "在线生成随机 UUID（v4）。一次性批量生成多个 UUID——免费且快速。",
    category: "dev",
    keywords: ["uuid生成器", "uuid v4生成", "生成uuid", "guid生成器", "随机uuid"],
    searchVolume: "~100K/mo",
    isClientSide: true,
    icon: "Fingerprint",
    howToUse: [
      "选择您需要的 UUID 数量（1–100）",
      "点击生成",
      "UUID 使用密码学级别的强随机性生成",
      "复制单个 UUID 或下载全部为文本文件",
    ],
    faqs: [
      {
        question: "生成的是哪个版本的 UUID？",
        answer: "我们生成 UUID v4，基于随机数。这是最常用的 UUID 版本。",
      },
      {
        question: "UUID 真的是唯一的吗？",
        answer: "UUID v4 使用 122 位的随机性。碰撞概率极低——您需要连续数十年每秒生成数十亿个才有机会碰撞。",
      },
    ],
  },
  {
    slug: "qr-code-generator",
    title: "二维码生成器",
    description: "在线免费生成二维码。为 URL、文本等内容创建二维码。可下载为 PNG。",
    category: "dev",
    keywords: ["二维码生成", "qr码生成器", "免费二维码", "在线二维码", "qr码制作"],
    searchVolume: "~300K/mo",
    isClientSide: true,
    icon: "QrCode",
    howToUse: [
      "输入 URL 或文本",
      "点击生成",
      "预览您的二维码",
      "下载为 PNG 图片",
    ],
    faqs: [
      {
        question: "二维码生成是免费的吗？",
        answer: "是的，完全免费。二维码在浏览器中生成——不会发送任何数据到服务器。",
      },
      {
        question: "二维码里可以放什么内容？",
        answer: "URL、纯文本、电话号码、电子邮件地址等。大多数智能手机可以扫描并自动打开内容。",
      },
    ],
  },
  {
    slug: "password-generator",
    title: "密码生成器",
    description: "在线生成强安全密码。选择长度和字符类型。使用密码学级别的随机性。",
    category: "dev",
    keywords: ["密码生成器", "强密码", "随机密码", "安全密码生成", "密码制作"],
    searchVolume: "~200K/mo",
    isClientSide: true,
    icon: "Key",
    howToUse: [
      "设置密码长度（6–64 个字符）",
      "选择字符类型：大写、小写、数字、符号",
      "点击生成",
      "复制密码或重新生成",
    ],
    faqs: [
      {
        question: "密码应该有多强？",
        answer: "建议至少 12 个字符，混合使用大写、小写、数字和符号。我们的强度指示器可帮助您评估安全性。",
      },
      {
        question: "生成的密码会被存储吗？",
        answer: "不会。密码在浏览器中使用密码学级别的强随机性（crypto.getRandomValues）生成。永远不会被存储或传输。",
      },
    ],
  },
  {
    slug: "case-converter",
    title: "大小写转换器",
    description:
      "在 大写、小写、首字母大写、句子大小写、驼峰命名、短横线命名等之间转换文本。即时出结果。",
    category: "dev",
    keywords: ["大小写转换", "文本大小写", "大写转小写", "标题大小写", "在线大小写转换"],
    searchVolume: "~80K/mo",
    isClientSide: true,
    icon: "CaseSensitive",
    howToUse: [
      "在输入区域粘贴您的文本",
      "点击大小写风格按钮：大写、小写、首字母大写、句子、驼峰、短横线或翻转",
      "在输出面板即时查看转换结果",
      "复制到剪贴板",
    ],
    faqs: [
      {
        question: "支持哪些文本大小写风格？",
        answer:
          "我们支持 大写（UPPERCASE）、小写（lowercase）、首字母大写（Title Case）、句子大小写（Sentence case）、驼峰命名（camelCase，用于编程）、短横线命名（kebab-case，用于 URL/CSS）和翻转大小写（iNVERT）。",
      },
      {
        question: "支持多语言文本吗？",
        answer:
          "支持，转换器适用于任何使用标准 Unicode 字母大小写规则的文本。大多数基于拉丁字母的语言都能完美处理。",
      },
    ],
  },
  {
    slug: "regex-tester",
    title: "正则表达式测试器",
    description:
      "在线测试正则表达式，实时匹配高亮显示。支持所有 JavaScript 正则标志。即时反馈。",
    category: "dev",
    keywords: ["正则测试", "正则表达式测试", "regex在线", "正则匹配", "在线正则"],
    searchVolume: "~60K/mo",
    isClientSide: true,
    icon: "Regex",
    howToUse: [
      "在斜杠之间输入您的正则表达式模式",
      "切换标志：g（全局）、i（忽略大小写）、m（多行）、s（点匹配换行）、u（Unicode）",
      "在下方粘贴或输入测试文本",
      "匹配项以黄色高亮显示——右侧可见匹配详情",
    ],
    faqs: [
      {
        question: "使用哪种正则引擎？",
        answer:
          "我们使用 JavaScript 内置的 RegExp 引擎。这与 Node.js、浏览器 JavaScript 和大多数在线代码编辑器中使用的引擎一致。",
      },
      {
        question: "为什么没有匹配结果？",
        answer:
          "请检查模式是否有拼写错误。使用全局标志（g）查找所有匹配项。点匹配换行标志（s）使 . 可以匹配换行符。如果模式语法无效，将显示错误信息。",
      },
    ],
  },
  {
    slug: "css-formatter",
    title: "CSS 格式化与压缩器",
    description:
      "在线美化或压缩 CSS。用合适的缩进格式化混乱的 CSS，或压缩用于生产环境。免费、即时。",
    category: "dev",
    keywords: ["css格式化", "css美化", "css压缩", "格式化css", "css排版", "在线压缩css"],
    searchVolume: "~40K/mo",
    isClientSide: true,
    icon: "Paintbrush",
    howToUse: [
      "在输入面板粘贴您的 CSS",
      "点击美化以缩进格式化，或点击压缩以精简",
      "结果将在输出面板显示",
      "复制到剪贴板",
    ],
    faqs: [
      {
        question: "支持哪些 CSS 语法？",
        answer:
          "我们支持标准的 CSS3 语法，包括媒体查询、关键帧和伪选择器。预处理器语法（SCSS、Less）可能无法正确格式化——请使用专用工具。",
      },
      {
        question: "压缩会破坏我的 CSS 吗？",
        answer:
          "不会。压缩仅删除空白字符和注释——不会改变 CSS 逻辑。请始终保留未压缩的原始版本用于编辑。",
      },
    ],
  },
  {
    slug: "text-diff-checker",
    title: "文本差异对比器",
    description: "在线比较两段文本并找出差异。逐行对比，高亮显示新增、删除和未更改的内容。",
    category: "dev",
    keywords: ["文本对比", "diff对比", "文本比较", "差异对比", "代码对比工具"],
    searchVolume: "~20K/mo",
    isClientSide: true,
    icon: "GitCompare",
    howToUse: [
      "在左侧面板粘贴原始文本",
      "在右侧面板粘贴修改后的文本",
      "点击对比",
      "查看高亮的差异——绿色为新增，红色为删除",
    ],
    faqs: [
      {
        question: "文本差异对比是如何工作的？",
        answer: "它使用 diff 算法逐行比较两段文本。仅在修改文本中出现的行高亮为绿色（新增），仅在原始文本中出现的行高亮为红色（删除）。",
      },
      {
        question: "可以比较代码吗？",
        answer: "可以！差异对比器适用于任何纯文本：代码、配置文件、文章或数据。",
      },
    ],
  },
  {
    slug: "html-entity-encode-decode",
    title: "HTML 实体编解码器",
    description:
      "将文本编码为 HTML 实体或将 HTML 实体解码回纯文本。支持命名实体、十进制和十六进制实体。免费在线工具。",
    category: "dev",
    keywords: ["html实体编码", "html实体解码", "html实体", "html转义", "html反转义", "html编码"],
    searchVolume: "~80K/mo",
    isClientSide: true,
    icon: "Code",
    howToUse: [
      "在输入面板粘贴文本",
      "点击「编码」将特殊字符转换为 HTML 实体",
      "或点击「解码」将 HTML 实体转回纯文本",
      "复制结果或交换输入/输出",
    ],
    faqs: [
      {
        question: "HTML 实体有什么用途？",
        answer:
          "HTML 实体用于在 HTML 中表示特殊字符。例如，&lt; 显示为 '<'。它们在安全嵌入用户生成内容和防止 XSS 攻击方面至关重要。",
      },
      {
        question: "这能防止所有 XSS 吗？",
        answer:
          "将 &、<、> 和 \" 编码为 HTML 实体是 XSS 防护的关键部分，但不是完整解决方案。始终配合使用适当的安全头和内容安全策略。",
      },
    ],
  },
  {
    slug: "jwt-decoder",
    title: "JWT 解码器",
    description:
      "在线解码 JWT（JSON Web Token）的头部和负载。检查令牌声明、验证过期时间、查看格式化时间戳。仅解析，不验证签名。",
    category: "dev",
    keywords: ["jwt解码", "解码jwt", "jwt令牌解码", "json web token", "jwt解析", "jwt查看"],
    searchVolume: "~50K/mo",
    isClientSide: true,
    icon: "Key",
    howToUse: [
      "在输入区粘贴您的 JWT 令牌",
      "点击「解码 JWT」",
      "查看解码后的头部、负载和签名",
      "根据 'exp' 声明检查令牌是否过期",
    ],
    faqs: [
      {
        question: "这安全吗？别人能看到我的令牌吗？",
        answer:
          "所有解码均在浏览器中完成——您的令牌不会发送到任何服务器。但 JWT 令牌本身可被任何人解码，所以绝不要分享令牌或在公开场合暴露它们。",
      },
      {
        question: "会验证令牌签名吗？",
        answer:
          "不会，此工具仅解码令牌内容，不验证签名。如需验证签名，请在您的应用中使用 JWT 库配合正确的密钥或公钥。",
      },
    ],
  },
  {
    slug: "color-converter",
    title: "颜色转换器",
    description:
      "在线转换 HEX、RGB 和 HSL 颜色格式。实时预览，三种格式即时转换。",
    category: "dev",
    keywords: ["颜色转换器", "hex转rgb", "rgb转hsl", "颜色选择器", "hex转hsl", "颜色格式转换"],
    searchVolume: "~200K/mo",
    isClientSide: true,
    icon: "Palette",
    howToUse: [
      "输入任意格式的颜色：HEX（#1a2b3c）、RGB（rgb(26, 43, 60)）或 HSL（hsl(210, 40%, 17%)）",
      "实时查看颜色预览框更新",
      "获取三种格式的转换值",
      "复制任意格式到剪贴板",
    ],
    faqs: [
      {
        question: "支持哪些颜色格式？",
        answer:
          "我们支持 HEX（3/4/6 位）、RGB 和 HSL 格式。任意一种格式的有效输入会立即转换为其他两种格式。",
      },
      {
        question: "HSL 和 RGB 有什么区别？",
        answer:
          "RGB 通过混合红、绿、蓝通道来定义颜色（屏幕的工作方式）。HSL 通过色相（颜色）、饱和度（强度）和亮度（明暗）来描述颜色。设计师通常觉得 HSL 更直观。",
      },
    ],
  },

  // ── 计算器工具 ──────────────────────────────────────
  {
    slug: "percentage-calculator",
    title: "百分比计算器",
    description: "免费的在线百分比计算器。计算数字的百分比、百分比变化、百分比增减。即时出结果。",
    category: "calculator",
    keywords: ["百分比计算器", "百分数计算", "百分比变化", "求百分比", "在线计算器"],
    searchVolume: "~1M/mo",
    isClientSide: true,
    icon: "Calculator",
    howToUse: [
      "选择计算模式：求百分比、是百分之几、百分比变化 或 加减百分比",
      "输入您的数字",
      "即时查看结果",
    ],
    faqs: [
      {
        question: "百分比的公式是什么？",
        answer: "百分比 = （部分 / 总数）× 100。例如，30 是 150 的 20%，因为 (30/150) × 100 = 20。",
      },
      {
        question: "如何计算百分比增长？",
        answer: "使用「百分比变化」选项卡。公式：((新值 − 旧值) / 旧值) × 100。输入旧值和新值即可查看变化。",
      },
    ],
  },
  {
    slug: "word-counter",
    title: "字数统计器",
    description:
      "统计文本中的字数、字符数、行数、句子数和段落数。实时统计，随输入更新。",
    category: "calculator",
    keywords: ["字数统计", "字符统计", "在线字数统计", "文本统计", "数字数"],
    searchVolume: "~150K/mo",
    isClientSide: true,
    icon: "Text",
    howToUse: [
      "在文本区域粘贴或输入您的文本",
      "查看实时统计：字数、字符数、行数、句子数、段落数",
      "复制文本或清除以重新开始",
    ],
    faqs: [
      {
        question: "字数是怎样计算的？",
        answer:
          "字数通过按空白字符（空格、制表符、换行符）分割文本来计算。空行不计入。这与大多数文字处理器的计数方式一致。",
      },
      {
        question: "我的文本隐私安全吗？",
        answer:
          "安全。所有统计均在浏览器中完成。您的文本永远不会上传到任何服务器。",
      },
    ],
  },
  {
    slug: "age-calculator",
    title: "年龄计算器",
    description:
      "精确计算您的年龄，以年、月、日显示。还可查看总天数、总周数以及距离下一个生日的倒计时。",
    category: "calculator",
    keywords: ["年龄计算器", "计算年龄", "生日计算器", "年龄计算", "在线年龄计算"],
    searchVolume: "~800K/mo",
    isClientSide: true,
    icon: "Calendar",
    howToUse: [
      "输入您的出生日期",
      "可选设置不同的截止日期（默认为今天）",
      "点击计算",
      "查看精确年龄（年、月、日）以及总天数、总周数和下一个生日倒计时",
    ],
    faqs: [
      {
        question: "年龄是如何计算的？",
        answer:
          "我们精确计算年龄，考虑闰年和不同月份的天数差异。计算结果显示了自出生以来已完成的年、月、日数。",
      },
      {
        question: "可以计算任意两个日期之间的年龄/时长吗？",
        answer:
          "可以！将「截止日期」更改为任意日期，即可计算两个日期之间的年龄/时长。适用于计算工作周年纪念日或活动倒计时。",
      },
    ],
  },
  {
    slug: "bmi-calculator",
    title: "BMI 计算器",
    description:
      "即时计算您的身体质量指数（BMI）。查看分类、健康体重范围和可视化 BMI 标尺。",
    category: "calculator",
    keywords: ["bmi计算器", "身体质量指数", "bmi检测", "健康体重计算", "bmi图表"],
    searchVolume: "~600K/mo",
    isClientSide: true,
    icon: "Heart",
    howToUse: [
      "输入您的身高（厘米）",
      "输入您的体重（公斤）",
      "点击计算",
      "查看您的 BMI 分数、分类以及适合您身高的健康体重范围",
    ],
    faqs: [
      {
        question: "BMI 分类代表什么？",
        answer:
          "偏瘦：BMI < 18.5。正常：18.5–24.9。超重：25–29.9。肥胖：≥ 30。BMI 是一个筛查工具，不能替代医学诊断。请咨询医疗专业人员获取全面评估。",
      },
      {
        question: "BMI 对所有人都准确吗？",
        answer:
          "BMI 无法区分肌肉和脂肪，因此肌肉发达的人可能被归类为超重。它只是一般性指导原则，不能替代专业医疗建议。",
      },
    ],
  },
  {
    slug: "discount-calculator",
    title: "折扣计算器",
    description:
      "即时计算折扣价格。输入原价和折扣百分比，查看节省金额和最终价格。",
    category: "calculator",
    keywords: ["折扣计算器", "优惠价格计算", "百分比折扣计算", "价格计算器", "省钱计算"],
    searchVolume: "~300K/mo",
    isClientSide: true,
    icon: "Tag",
    howToUse: [
      "输入原价（例如 $100）",
      "输入折扣百分比（例如 20%）",
      "即时查看节省金额、最终价格和折扣百分比",
    ],
    faqs: [
      {
        question: "能计算叠加折扣吗？",
        answer:
          "对于多重折扣，请逐个应用。例如，8 折后再打 9 折：先计算 8 折，然后将结果作为新原价计算 9 折。",
      },
      {
        question: "适用于任何货币吗？",
        answer:
          "可以！只需将 $ 符号视为占位符。计算方法对任何货币都一样。",
      },
    ],
  },
  {
    slug: "loan-calculator",
    title: "贷款计算器",
    description:
      "计算每月贷款还款额、总利息并查看还款计划表。免费在线贷款计算器，提供完整的还款明细。",
    category: "calculator",
    keywords: ["贷款计算器", "房贷计算器", "还款计算器", "贷款还款", "利息计算器", "月供计算器"],
    searchVolume: "~500K/mo",
    isClientSide: true,
    icon: "Calculator",
    howToUse: [
      "输入贷款金额（本金）",
      "输入年利率（如 5.5 表示 5.5%）",
      "输入贷款期限（年）",
      "点击计算查看月供、总利息和还款计划表",
    ],
    faqs: [
      {
        question: "什么是等额本息还款？",
        answer:
          "等额本息是用固定金额按期还款的方式。每期还款同时覆盖利息和本金。前期还款中利息占比大，后期本金占比大。",
      },
      {
        question: "包含税费和保险吗？",
        answer:
          "不包含，此计算器仅显示本金和利息。如需估算完整的月度住房支出，请将房产税、房主保险和可能的按揭保险费加到计算的月供中。",
      },
    ],
  },
  {
    slug: "tip-calculator",
    title: "小费计算器",
    description:
      "即时计算小费。选择常用小费比例，与朋友分摊账单，查看每人应付金额。免费在线工具。",
    category: "calculator",
    keywords: ["小费计算器", "服务费计算器", "餐厅小费", "分摊账单", "小费比例", "小费金额"],
    searchVolume: "~200K/mo",
    isClientSide: true,
    icon: "Calculator",
    howToUse: [
      "输入账单金额",
      "选择小费比例或输入自定义比例",
      "可选设置分摊人数",
      "查看小费金额、总金额和人均明细",
    ],
    faqs: [
      {
        question: "标准小费比例是多少？",
        answer:
          "在美国和加拿大，餐厅服务标准小费为 15-20%。其他国家的习惯不同——日本通常不给小费，而英国通常包含 10-12.5% 的服务费。",
      },
      {
        question: "人均分摊是如何计算的？",
        answer:
          "小费金额和总账单按您指定的人数平均分配。如需不均等分摊，请分别计算每人的份额。",
      },
    ],
  },
  {
    slug: "image-upscaler",
    title: "AI 图片放大",
    description:
      "将图片放大 2 倍、3 倍或 4 倍，采用高质量插值算法。提升分辨率同时保持画质。免费、即时、浏览器端处理。",
    category: "image",
    keywords: ["图片放大", "AI 放大", "增加分辨率", "图片增强", "超分辨率", "2倍放大"],
    searchVolume: "~300K/mo",
    isClientSide: true,
    isAi: true,
    icon: "Maximize2",
    howToUse: [
      "上传或拖放您的图片",
      "选择放大倍数（2x、3x 或 4x）",
      "可选开启锐化以增强边缘",
      "以 PNG、JPEG 或 WebP 格式下载放大后的图片",
    ],
    faqs: [
      {
        question: "图片放大是如何工作的？",
        answer:
          "我们的放大工具使用浏览器内置的高质量 Lanczos/双三次插值算法和可选的非锐度遮罩锐化来放大图片，同时保留细节。所有处理均在您的浏览器中完成。",
      },
      {
        question: "放大会降低图片质量吗？",
        answer:
          "放大必然会添加原始图片中不存在的像素。我们的高质量插值算法可最大限度减少模糊和伪影。可选的锐化功能可增强边缘，使结果更清晰。",
      },
      {
        question: "最大可以放大多少倍？",
        answer:
          "最多可将图片放大 4 倍。例如，500×500 的图片可变为 2000×2000。请注意，放大倍数越大，文件体积也越大。",
      },
    ],
  },
  {
    slug: "remove-background",
    title: "AI 背景移除",
    description:
      "用 AI 即时移除图片背景。100% 免费，无需上传——所有处理均在您浏览器本地完成。隐私优先。",
    category: "image",
    keywords: ["移除背景", "背景移除", "AI 去背景", "去背景", "透明背景", "免费去背景"],
    searchVolume: "~2M/mo",
    isClientSide: true,
    isAi: true,
    icon: "Sparkles",
    howToUse: [
      "上传或拖放您的图片",
      "AI 模型仅首次下载（~40MB，后续访问自动缓存）",
      "等待几秒钟，AI 处理您的图片",
      "下载透明背景的结果图片",
    ],
    faqs: [
      {
        question: "真的免费吗？",
        answer:
          "是的，完全免费且无限制。所有 AI 处理均通过 ONNX 运行时在您浏览器本地完成——您的图片不会离开您的设备。",
      },
      {
        question: "AI 背景移除是如何工作的？",
        answer:
          "我们使用 ISNet（图像分割网络）模型在您浏览器中通过 WebAssembly 运行。它能检测图片中的主体，并以像素级精度将其与背景分离。",
      },
      {
        question: "图片质量会保留吗？",
        answer:
          "是的，输出为无损质量的 PNG 格式，带透明背景。如需要更小文件，您也可选择 JPEG 或 WebP 格式并调整质量。",
      },
      {
        question: "处理需要多长时间？",
        answer:
          "首次使用时需下载 AI 模型（约 40MB，后续自动缓存）。处理时间根据图片大小和设备性能约为 2-10 秒。支持 GPU 加速。",
      },
    ],
  },

  // ── 开发者工具（续） ─────────────────────────────────
  {
    slug: "claude-session-viewer",
    title: "Claude Code 会话查看器",
    description:
      "在线查看、搜索和导出 Claude Code 会话记录（.jsonl）。解析消息、按角色筛选、导出为 Markdown、Word 或 PDF——全部在浏览器中完成。",
    category: "dev",
    keywords: [
      "claude code 会话查看器",
      "claude 会话解析",
      "jsonl 查看器",
      "claude 对话导出",
      "ai 对话查看器",
      "claude 会话转 markdown",
    ],
    searchVolume: "~5K/mo",
    isClientSide: true,
    icon: "MessageSquare",
    howToUse: [
      "上传您的 Claude Code .jsonl 会话文件（拖放或点击浏览）",
      "文件在浏览器中即时解析——数据不会上传至任何服务器",
      "通过角色标签浏览消息（用户、助手、系统、工具）",
      "按角色筛选，聚焦对话中的特定部分",
      "将会话导出为 Markdown (.md)、HTML、Word (.docx) 或 PDF",
    ],
    faqs: [
      {
        question: "什么是 Claude Code .jsonl 会话文件？",
        answer:
          "Claude Code 将会话记录存储为 JSONL 文件（每行一个 JSON 对象），保存在项目的 .claude/sessions/ 目录中。每行代表编码会话中的一条消息、工具调用或系统事件。",
      },
      {
        question: "我的会话数据安全吗？",
        answer:
          "绝对安全。所有解析和处理均在您的浏览器中使用 JavaScript 完成。您的会话文件永远不会上传至任何服务器——完全保留在您的设备上。",
      },
      {
        question: "支持哪些导出格式？",
        answer:
          "您可以将会话导出为：Markdown (.md) 用于文档记录，HTML 用于网页查看，Word (.docx) 用于报告，或通过浏览器的打印对话框导出 PDF。所有导出均保留对话结构、角色标签和时间戳。",
      },
      {
        question: "可以查看工具调用和结果吗？",
        answer:
          "可以！查看器会自动检测 Anthropic Messages API 格式中的 tool_use 和 tool_result 代码块。工具输入和输出均可展开查看，便于检查。",
      },
      {
        question: "如果文件无法解析怎么办？",
        answer:
          "请确保您的文件是有效的 JSONL 格式——每行应是一个完整的 JSON 对象。Claude Code 原生会话格式和 Anthropic Messages API 格式均受支持。如果仍然报错，请检查文件是否已损坏或被截断。",
      },
    ],
  },
];
