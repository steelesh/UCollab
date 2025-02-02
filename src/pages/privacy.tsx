import Head from 'next/head';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>UCollab — Privacy</title>
      </Head>
      <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
        <h1 className="text-center text-2xl font-bold select-none">
          Privacy Policy
        </h1>
        <div className="mt-8 max-w-3xl space-y-6">
          <p className="text-accent text-sm">
            <strong>Last Updated:</strong> November 11th, 2024
          </p>

          <h2 className="text-lg font-semibold">Introduction</h2>
          <p>
            UCollab (“we,” “our,” or “us”) is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our application or any
            associated services (collectively, the “Service”). By using the
            Service, you agree to the collection and use of information in
            accordance with this Privacy Policy.
          </p>

          <h2 className="text-lg font-semibold">1. Information Collection</h2>
          <p>
            We only collect information that is necessary for the operation,
            maintenance, and improvement of our Service. The types of data we
            collect are as follows:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Personal Information:</strong> Information provided by
              you, such as your name, email address, and any other identifying
              information necessary to create an account or use the Service.
            </li>
            <li>
              <strong>Usage Information:</strong> Non-identifiable data related
              to your interactions with the Service, such as device type, IP
              address, browser type, and operating system.
            </li>
            <li>
              <strong>Application Data:</strong> Information you submit directly
              within the Service, which may include usage preferences, settings,
              and other customizations that improve your experience.
            </li>
          </ul>

          <h2 className="text-lg font-semibold">2. Use of Information</h2>
          <p>
            We only use your information for purposes directly related to the
            operation of our Service, including but not limited to:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Account creation, verification, and management</li>
            <li>Providing customer support and responding to inquiries</li>
            <li>
              Ensuring the security, stability, and functionality of the Service
            </li>
            <li>
              Analyzing usage data to improve the quality and functionality of
              the Service
            </li>
            <li>
              Conducting internal research and analytics for product development
            </li>
          </ul>

          <h2 className="text-lg font-semibold">
            3. Data Sharing and Disclosure
          </h2>
          <p>
            Your privacy is a priority. We do not sell, rent, or trade your
            personal information with any third parties. We may only share your
            information under specific circumstances that are essential for the
            operation of the Service, including:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Service Providers:</strong> We may work with third-party
              service providers to perform certain functions on our behalf, such
              as hosting, data storage, analytics, and payment processing. These
              service providers are only given access to information necessary
              to perform their specific tasks and are contractually obligated to
              protect your information.
            </li>
            <li>
              <strong>Legal Obligations:</strong> We may disclose information if
              required to do so by law, or in response to valid requests by
              public authorities (e.g., a court or government agency), to
              protect the safety, rights, or property of UCollab, our users, or
              others.
            </li>
          </ul>

          <h2 className="text-lg font-semibold">4. Data Retention</h2>
          <p>
            We retain your personal information only as long as is necessary for
            the purposes outlined in this Privacy Policy, or as required to
            comply with legal obligations. Upon request, we will delete or
            anonymize your information in accordance with applicable laws and
            regulations.
          </p>

          <h2 className="text-lg font-semibold">
            5. Security of Your Information
          </h2>
          <p>
            We implement commercially reasonable measures to safeguard your
            information from unauthorized access, use, disclosure, and
            destruction. However, no method of transmission over the Internet or
            electronic storage is 100% secure. We strive to use
            industry-standard means to protect your personal data but cannot
            guarantee absolute security.
          </p>

          <h2 className="text-lg font-semibold">6. User Rights and Choices</h2>
          <p>
            You have certain rights regarding the personal information we hold
            about you. Depending on your jurisdiction, these rights may include:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Access:</strong> You may request access to the personal
              information we hold about you.
            </li>
            <li>
              <strong>Correction:</strong> You may request that we correct or
              update inaccurate or incomplete information.
            </li>
            <li>
              <strong>Deletion:</strong> You may request the deletion of
              personal information that is no longer necessary for operational
              purposes.
            </li>
            <li>
              <strong>Data Portability:</strong> You may request a copy of your
              personal information in a structured, machine-readable format.
            </li>
          </ul>

          <h2 className="text-lg font-semibold">
            7. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices, legal requirements, or other operational
            needs. When we make changes, we will update the “Last Updated” date
            at the top of this page. Your continued use of the Service after any
            changes to this Privacy Policy indicates your acceptance of the
            updated policy.
          </p>

          <h2 className="text-lg font-semibold">Conclusion</h2>
          <p>
            At UCollab, protecting your privacy is essential. We are committed
            to ensuring that your information remains secure and is only used to
            enhance your experience with the Service. By maintaining strict
            privacy practices, we aim to build trust with our users and offer a
            safe, reliable experience.
          </p>
        </div>
      </div>
    </>
  );
}
