import Link from "next/link";
import { toolRegistry } from "@/lib/tools";
import { ToolCard } from "@/components/layout/tool-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sparkles, Shield, Zap } from "lucide-react";

const categories = [
  { value: "all", label: "All Tools" },
  { value: "image", label: "Image" },
  { value: "pdf", label: "PDF" },
  { value: "markdown", label: "Markdown" },
  { value: "dev", label: "Dev Tools" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
            Free Online Tools
          </h1>
          <p className="text-lg text-zinc-600 mb-8 max-w-xl mx-auto">
            Convert images, edit PDFs, write Markdown, format code — all in your browser.
            No uploads, no sign-ups, 100% free.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-zinc-500 mb-8">
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-500" /> Private & Secure
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" /> Instant Processing
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-500" /> No Sign-up
            </span>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <TabsList>
              {categories.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {toolRegistry.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </TabsContent>

          {categories.slice(1).map((cat) => (
            <TabsContent key={cat.value} value={cat.value} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolRegistry
                  .filter((t) => t.category === cat.value)
                  .map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Trust section */}
      <section className="bg-zinc-50 py-16 px-4 mt-12">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">
            Why ToolKit?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-left">
              <Shield className="h-8 w-8 text-green-500 mb-3" />
              <h3 className="font-semibold text-zinc-900 mb-1">Privacy First</h3>
              <p className="text-sm text-zinc-600">
                All tools run in your browser. Files are never uploaded to any server.
              </p>
            </div>
            <div className="text-left">
              <Zap className="h-8 w-8 text-amber-500 mb-3" />
              <h3 className="font-semibold text-zinc-900 mb-1">Lightning Fast</h3>
              <p className="text-sm text-zinc-600">
                No server round-trips. Processing happens instantly on your device.
              </p>
            </div>
            <div className="text-left">
              <Sparkles className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-semibold text-zinc-900 mb-1">Always Free</h3>
              <p className="text-sm text-zinc-600">
                No usage limits, no premium tiers. All tools are free, forever.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
