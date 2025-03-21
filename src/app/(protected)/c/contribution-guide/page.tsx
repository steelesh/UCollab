export const metadata = {
  title: 'UCollab — Contribution Guide',
};

export default function ContributionGuidePage() {
  return (
    <div className="flex flex-col items-center px-6 py-12">
      <h1 className="text-center text-2xl font-bold select-none">🚀 Contribution Guide</h1>
      <p className="text-secondary mt-2 max-w-2xl text-center text-sm italic">
        UCollab thrives on contributions from developers, designers, and technical writers. Follow this guide to learn how to contribute effectively.
      </p>

      {/* How You Can Contribute */}
      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">📌 <strong>How You Can Contribute</strong></h2>
        <ul className="text-secondary-foreground mt-4 space-y-2 pl-5">
          <li>💡 <strong>Feature Development:</strong> Propose and implement new features.</li>
          <li>🐞 <strong>Bug Fixes:</strong> Identify and fix bugs in the platform.</li>
          <li>📖 <strong>Documentation:</strong> Improve guides, FAQs, and onboarding docs.</li>
          <li>🎨 <strong>UI/UX Design:</strong> Enhance user experience and accessibility.</li>
        </ul>
      </div>

      {/* Step 1: Fork & Clone the Repository */}
      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">🌿 <strong>Step 1: Fork & Clone the Repository</strong></h2>
        <p className="text-secondary mt-2 text-sm">
          Start by <strong>forking</strong> the UCollab repository on GitHub.
        </p>
        <pre className="bg-gray-900 text-white p-4 rounded-md mt-2 text-sm">
          git clone https://github.com/steelesh/UCollab.git
        </pre>
      </div>

      {/* Step 2: Create a New Branch */}
      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">🔃 <strong>Step 2: Create a New Branch</strong></h2>
        <p className="text-secondary mt-2 text-sm">
          Always create a separate branch for each contribution:
        </p>
        <pre className="bg-gray-900 text-white p-4 rounded-md mt-2 text-sm">
          git checkout -b feature-branch
        </pre>
      </div>

      {/* Step 3: Make Your Changes */}
      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">🛠 <strong>Step 3: Make Your Changes</strong></h2>
        <p className="text-secondary mt-2 text-sm">
          Follow UCollab’s coding standards when implementing changes. Ensure your code is <strong>well-documented and tested</strong> before submitting.
        </p>
      </div>

      {/* Step 4: Commit & Push */}
      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">📥 <strong>Step 4: Commit & Push</strong></h2>
        <p className="text-secondary mt-2 text-sm">
          After making changes, commit and push them:
        </p>
        <pre className="bg-gray-900 text-white p-4 rounded-md mt-2 text-sm">
          git add .{'\n'}
          git commit -m "Brief description of changes"{'\n'}
          git push origin feature-branch
        </pre>
      </div>

      {/* Step 5: Open a Pull Request */}
      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">✅ <strong>Step 5: Open a Pull Request</strong></h2>
        <p className="text-secondary mt-2 text-sm">
          Open a <strong>pull request (PR)</strong> on GitHub to merge your changes.
        </p>
        <p className="text-secondary mt-2 text-sm">
          <a href="https://github.com/steelesh/UCollab/pulls" target="_blank" className="text-blue-400 underline">
            Open a pull request here
          </a>.
        </p>
      </div>

      {/* Contribution Best Practices */}
      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">📜 <strong>Contribution Best Practices</strong></h2>
        <ul className="text-secondary-foreground mt-4 space-y-2 pl-5">
          <li>✅ <strong>Write clean, well-structured code.</strong></li>
          <li>✅ <strong>Use meaningful commit messages.</strong></li>
          <li>✅ <strong>Ensure your changes do not break existing functionality.</strong></li>
          <li>✅ <strong>Follow the</strong> <a href="/c/code-of-conduct" className="text-blue-400 underline">Code of Conduct</a>.</li>
        </ul>
      </div>

      {/* Contact */}
      <p className="mt-8 text-sm text-gray-400">
        Have questions? Reach out at{' '}
        <a href="mailto:support@ucollab.com" className="underline text-blue-400">support@ucollab.com</a>.
      </p>
    </div>
  );
}
