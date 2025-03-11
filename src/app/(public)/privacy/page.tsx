export const metadata = {
  title: 'UCollab — Privacy',
};

export default function PrivacyPage() {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
      <h1 className="text-center text-2xl font-bold select-none">Privacy Policy</h1>

      <div className="bg-base-300 mt-8 w-full max-w-3xl rounded-lg p-8 shadow-2xl">
        <p className="text-secondary mb-4 text-sm">
          <strong>Last Updated:</strong> November 11th, 2024
        </p>

        <h2 className="text-lg font-semibold">Introduction</h2>
        <p>
          UCollab (“we,” “our,” or “us”) is committed to protecting your privacy. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you use our application or any associated services
          (collectively, the “Service”). By using the Service, you agree to the collection and use of information in
          accordance with this Privacy Policy.
        </p>

        <h2 className="mt-6 text-lg font-semibold">1. Information Collection</h2>
        <p>
          We only collect information that is necessary for the operation, maintenance, and improvement of our Service.
          The types of data we collect are as follows:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Personal Information:</strong> Information provided by you, such as your name, email address, and
            account details.
          </li>
          <li>
            <strong>Usage Information:</strong> Non-identifiable data such as device type, IP address, browser type, and
            operating system.
          </li>
          <li>
            <strong>Application Data:</strong> Preferences, settings, and other customizations that improve user
            experience.
          </li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold">2. Use of Information</h2>
        <p>
          We only use your information for purposes directly related to the operation of our Service, including but not
          limited to:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Account creation, verification, and management.</li>
          <li>Providing customer support and responding to inquiries.</li>
          <li>Ensuring the security, stability, and functionality of the Service.</li>
          <li>Analyzing usage data to improve the quality and functionality of the Service.</li>
          <li>Conducting internal research and analytics for product development.</li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold">3. Data Sharing and Disclosure</h2>
        <p>
          Your privacy is a priority. We do not sell, rent, or trade your personal information with any third parties.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Service Providers:</strong> Third-party services for hosting, analytics, and payments (contractually
            obligated to protect your data).
          </li>
          <li>
            <strong>Legal Obligations:</strong> Disclosures required by law or court orders to protect users or comply
            with regulations.
          </li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold">4. Data Retention</h2>
        <p>
          We retain your personal information only as long as necessary for Service functionality and legal compliance.
          Upon request, we will delete or anonymize your data.
        </p>

        <h2 className="mt-6 text-lg font-semibold">5. Security of Your Information</h2>
        <p>
          We implement commercially reasonable security measures to protect your data but cannot guarantee absolute
          security.
        </p>

        <h2 className="mt-6 text-lg font-semibold">6. User Rights and Choices</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Access:</strong> Request access to your personal information.
          </li>
          <li>
            <strong>Correction:</strong> Request updates to inaccurate or incomplete data.
          </li>
          <li>
            <strong>Deletion:</strong> Request deletion of personal information no longer needed.
          </li>
          <li>
            <strong>Data Portability:</strong> Request an export of your personal information.
          </li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold">7. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy periodically. Any updates will be reflected in the "Last Updated" section.
        </p>

        <h2 className="mt-6 text-lg font-semibold">Conclusion</h2>
        <p>
          At UCollab, we prioritize your privacy. We follow strict security and data protection standards to ensure your
          information remains safe while providing the best user experience.
        </p>
      </div>
    </div>
  );
}
