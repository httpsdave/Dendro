export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32 pb-16">
      <h1 className="text-3xl font-bold font-display text-forest-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-cream-600 mb-8">Last updated: February 25, 2026</p>

      <div className="prose prose-sm text-gray-700 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Dendro, you agree to be bound by these Terms of Service. If you
            do not agree to these terms, please do not use the application.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">2. Use of the Service</h2>
          <p>
            Dendro is provided for informational and educational purposes about plant species and
            flora. You agree to use the service only for lawful purposes and in a manner that does
            not infringe on the rights of others.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials.
            You agree to notify us immediately of any unauthorized use of your account. Dendro is
            not liable for any loss resulting from unauthorized access to your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">4. Intellectual Property</h2>
          <p>
            Plant data displayed on Dendro is sourced from third-party APIs (Trefle, Perenual,
            GBIF, Wikipedia) and is subject to their respective licenses. Dendro&apos;s own design,
            code, and branding are the property of the developer.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">5. Disclaimer of Warranties</h2>
          <p>
            Dendro is provided &quot;as is&quot; without warranties of any kind. We do not guarantee the
            accuracy, completeness, or availability of any plant information displayed on the
            platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Dendro and its developer shall not be liable
            for any indirect, incidental, or consequential damages arising from your use of the
            service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">7. Changes to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. Continued use of Dendro after
            changes are posted constitutes your acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-800 mb-2">8. Contact</h2>
          <p>
            For questions about these terms, please reach out through{' '}
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
