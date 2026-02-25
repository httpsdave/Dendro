export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32 pb-16">
      <h1 className="text-3xl font-bold font-display text-forest-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-cream-600 mb-8">Last updated: February 25, 2026</p>

      <div className="prose prose-sm text-gray-700 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">1. Information We Collect</h2>
          <p>
            Dendro collects minimal personal information necessary to provide its services. This may
            include your email address and display name when you create an account, as well as
            data you voluntarily provide such as saved favorites and bookmarks.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">2. How We Use Your Information</h2>
          <p>
            We use the information we collect solely to operate and improve Dendro. Your data is
            never sold to third parties. We may use your email to send account-related
            notifications only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">3. Data Storage</h2>
          <p>
            User data is stored securely using Supabase. We take reasonable technical measures to
            protect your information from unauthorized access or disclosure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">4. Third-Party Services</h2>
          <p>
            Dendro fetches plant data from third-party APIs including Trefle, Perenual, GBIF, and
            Wikipedia. Please review their respective privacy policies for information on how they
            handle data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">5. Cookies</h2>
          <p>
            We use essential cookies to maintain your session and authentication state. No
            advertising or tracking cookies are used.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">6. Your Rights</h2>
          <p>
            You may request deletion of your account and associated data at any time by contacting
            us via GitHub.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">7. Contact</h2>
          <p>
            For privacy-related questions, please reach out through{' '}
            <a
              href="https://github.com/httpsdave"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-600 hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
