import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-zinc-50 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 mb-3">Image Tools</h3>
            <ul className="space-y-2">
              <li><Link href="/tools/heic-to-jpg" className="text-sm text-zinc-600 hover:text-zinc-900">HEIC to JPG</Link></li>
              <li><Link href="/tools/webp-to-jpg" className="text-sm text-zinc-600 hover:text-zinc-900">WebP to JPG</Link></li>
              <li><Link href="/tools/image-compressor" className="text-sm text-zinc-600 hover:text-zinc-900">Image Compressor</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 mb-3">Markdown Tools</h3>
            <ul className="space-y-2">
              <li><Link href="/tools/markdown-editor" className="text-sm text-zinc-600 hover:text-zinc-900">Markdown Editor</Link></li>
              <li><Link href="/tools/markdown-to-html" className="text-sm text-zinc-600 hover:text-zinc-900">MD to HTML</Link></li>
              <li><Link href="/tools/markdown-table-generator" className="text-sm text-zinc-600 hover:text-zinc-900">Table Generator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 mb-3">PDF Tools</h3>
            <ul className="space-y-2">
              <li><Link href="/tools/jpg-to-pdf" className="text-sm text-zinc-600 hover:text-zinc-900">JPG to PDF</Link></li>
              <li><Link href="/tools/pdf-to-jpg" className="text-sm text-zinc-600 hover:text-zinc-900">PDF to JPG</Link></li>
              <li><Link href="/tools/merge-pdf" className="text-sm text-zinc-600 hover:text-zinc-900">Merge PDF</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 mb-3">Dev Tools</h3>
            <ul className="space-y-2">
              <li><Link href="/tools/json-formatter" className="text-sm text-zinc-600 hover:text-zinc-900">JSON Formatter</Link></li>
              <li><Link href="/tools/base64-encode-decode" className="text-sm text-zinc-600 hover:text-zinc-900">Base64</Link></li>
              <li><Link href="/tools/uuid-generator" className="text-sm text-zinc-600 hover:text-zinc-900">UUID Generator</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t text-center text-sm text-zinc-500">
          <p>All tools run in your browser. Your files are never uploaded to any server.</p>
          <p className="mt-1">© {new Date().getFullYear()} ToolKit. Free online tools for everyone.</p>
        </div>
      </div>
    </footer>
  );
}
