export const metadata = {
  title: 'UCollab — Code of Conduct',
};

export default function CodeofConductPage() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center text-2xl font-bold select-none">Code of Conduct</h1>
      <h2 className="mt-8 text-xl font-bold">🌎 UCollab Community Guidelines</h2>
      <p className="text-secondary mt-2 max-w-2xl text-center text-sm italic">
        UCollab is committed to maintaining a respectful, inclusive, and collaborative environment for all members.
      </p>

      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">📌 Our Core Values</h2>
        <ul className="text-secondary-foreground mt-4 list-disc space-y-2 pl-5">
          <li>
            <strong>♦️ Respect:</strong> Treat everyone with kindness and professionalism.
          </li>
          <li>
            <strong>♦️ Inclusivity:</strong> Embrace diversity and create an open, welcoming space.
          </li>
          <li>
            <strong>♦️ Collaboration:</strong> Work together constructively, valuing all contributions.
          </li>
          <li>
            <strong>♦️ Integrity:</strong> Be honest, ethical, and take responsibility for your actions.
          </li>
        </ul>
      </div>

      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">🚫 Unacceptable Behavior</h2>
        <p className="text-secondary mt-2 text-sm">
          The following behaviors are not tolerated within UCollab:
        </p>
        <ul className="text-secondary-foreground mt-4 list-disc space-y-2 pl-5">
          <li>Harassment, discrimination, or targeted attacks.</li>
          <li>Hate speech, offensive language, or disrespectful conduct.</li>
          <li>Disruptive behavior or intentional misinformation.</li>
          <li>Sharing private or sensitive data without consent.</li>
        </ul>
      </div>

      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">⚖️ Consequences & Enforcement</h2>
        <p className="text-secondary mt-2 text-sm">
          Violations of this Code of Conduct may result in the following actions:
        </p>
        <ul className="text-secondary-foreground mt-4 list-disc space-y-2 pl-5">
          <li>Warning from moderators or administrators.</li>
          <li>Temporary or permanent suspension from UCollab.</li>
          <li>Escalation to university authorities or legal action (if applicable).</li>
        </ul>
      </div>

      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">📬 Reporting Violations</h2>
        <p className="text-secondary mt-2 text-sm">
          If you witness or experience behavior that violates this Code of Conduct, please report it confidentially to{' '}
          <a href="mailto:support@ucollab.com" className="text-blue-400 underline">support@ucollab.com</a>.
        </p>
      </div>

      <p className="mt-8 text-sm text-gray-400">
        This Code of Conduct is adapted from the Contributor Covenant v2.1. Read more at{' '}
        <a href="https://www.contributor-covenant.org/version/2/1/code_of_conduct/" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">
          contributor-covenant.org
        </a>.
      </p>
    </div>
  );
}
