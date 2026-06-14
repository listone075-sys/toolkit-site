import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-3xl font-bold text-zinc-900 mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold text-zinc-900 mt-6 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold text-zinc-900 mt-4 mb-2">{children}</h3>,
    p: ({ children }) => <p className="text-zinc-700 leading-relaxed mb-4">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-zinc-700 mb-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-zinc-700 mb-4">{children}</ol>,
    code: ({ children }) => (
      <code className="bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm mb-4">{children}</pre>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-blue-600 hover:underline">{children}</a>
    ),
    ...components,
  };
}
