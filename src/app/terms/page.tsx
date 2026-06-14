import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ToolCraft",
  description: "ToolCraft Terms of Service — usage terms and conditions.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Terms of Service</h1>
      <p className="text-sm text-zinc-500 mb-8">Last updated: June 14, 2026</p>

      <div className="prose prose-zinc max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">1. Acceptance of Terms</h2>
          <p className="text-zinc-700 leading-relaxed">
            By using ToolCraft ("the Service"), you agree to these Terms of Service. If you do not agree,
            please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">2. Description of Service</h2>
          <p className="text-zinc-700 leading-relaxed">
            ToolCraft provides free online tools for image conversion, PDF manipulation, Markdown editing,
            and developer utilities. All tools run in your browser — files are processed locally on your device.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">3. Acceptable Use</h2>
          <p className="text-zinc-700 leading-relaxed">You agree not to:</p>
          <ul className="list-disc list-inside text-zinc-700 space-y-1 mt-2">
            <li>Use the Service for any illegal purpose</li>
            <li>Attempt to disrupt or overload the Service</li>
            <li>Reverse engineer or scrape the Service</li>
            <li>Use automated tools to access the Service without permission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">4. Intellectual Property</h2>
          <p className="text-zinc-700 leading-relaxed">
            The ToolCraft website, code, and design are protected by copyright. The tools process your files
            locally — we do not claim ownership of your content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">5. Disclaimer of Warranties</h2>
          <p className="text-zinc-700 leading-relaxed">
            The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service
            will be error-free, uninterrupted, or meet all your requirements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">6. Limitation of Liability</h2>
          <p className="text-zinc-700 leading-relaxed">
            ToolCraft shall not be liable for any damages arising from the use or inability to use the Service.
            As all file processing is done locally in your browser, we cannot be responsible for data loss or
            file corruption.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">7. Changes to Terms</h2>
          <p className="text-zinc-700 leading-relaxed">
            We reserve the right to modify these terms at any time. Continued use of the Service after changes
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">8. Contact</h2>
          <p className="text-zinc-700 leading-relaxed">
            For questions about these terms, contact{" "}
            <a href="mailto:legal@toolcraftbox.com" className="text-blue-600 hover:underline">legal@toolcraftbox.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
