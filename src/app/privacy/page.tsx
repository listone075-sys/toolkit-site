import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ToolCraft",
  description: "ToolCraft Privacy Policy — how we handle your data and protect your privacy.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Privacy Policy</h1>
      <p className="text-sm text-zinc-500 mb-8">Last updated: June 14, 2026</p>

      <div className="prose prose-zinc max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">1. Our Commitment to Privacy</h2>
          <p className="text-zinc-700 leading-relaxed">
            ToolCraft is built with privacy as a core principle. <strong>All tools run entirely in your browser.</strong> When
            you convert an image, edit a PDF, or format JSON, your files and data never leave your device. We do not
            upload, store, or have access to your files.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">2. Information We Collect</h2>
          <p className="text-zinc-700 leading-relaxed">
            We collect minimal information to operate and improve the site:
          </p>
          <ul className="list-disc list-inside text-zinc-700 space-y-1 mt-2">
            <li><strong>Usage analytics</strong> — anonymous page views and tool usage via Google Analytics (no personal data)</li>
            <li><strong>Cookies</strong> — for analytics, ad delivery (Google AdSense), and preferences</li>
            <li><strong>Server logs</strong> — standard web server access logs (IP address, browser type, pages visited)</li>
          </ul>
          <p className="text-zinc-700 leading-relaxed mt-2">
            We do <strong>not</strong> collect: names, email addresses, file contents, or any personally identifiable information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">3. How We Use Information</h2>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>To understand which tools are most popular and improve them</li>
            <li>To display relevant advertisements via Google AdSense</li>
            <li>To maintain the security and performance of our servers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">4. Third-Party Services</h2>
          <p className="text-zinc-700 leading-relaxed">
            We use the following third-party services that may set cookies:
          </p>
          <ul className="list-disc list-inside text-zinc-700 space-y-1 mt-2">
            <li><strong>Google AdSense</strong> — serves advertisements based on interests and browsing history. See{" "}
              <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">Google's Privacy Policy</a>.
            </li>
            <li><strong>Google Analytics</strong> — tracks anonymous usage statistics.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">5. Your Choices</h2>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>You can disable cookies in your browser settings</li>
            <li>You can opt out of personalized ads via{" "}
              <a href="https://adssettings.google.com" className="text-blue-600 hover:underline">Google's Ad Settings</a>
            </li>
            <li>All tools work fully without cookies enabled</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">6. Contact</h2>
          <p className="text-zinc-700 leading-relaxed">
            For privacy-related questions, contact us at{" "}
            <a href="mailto:privacy@toolcraftbox.com" className="text-blue-600 hover:underline">privacy@toolcraftbox.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
