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

  // ── Markdown 工具 ───────────────────────────────────────
  {
    slug: "markdown-to-html",
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
];
