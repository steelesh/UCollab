export const metadata = {
  title: 'UCollab — Community Guide',
};

export default function CommunityGuidePage() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center text-2xl font-bold select-none">Community Guide</h1>
      <h2 className="mt-8 text-xl font-bold">🌟 Welcome to UCollab!</h2>
      <p className="text-secondary mt-2 max-w-2xl text-center text-sm italic">
        Our goal is to foster a collaborative, innovative, and supportive community for students, developers, and IT professionals.
      </p>

      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">📌 How to Get the Most Out of UCollab</h2>
        <ul className="text-secondary-foreground mt-4 list-disc space-y-2 pl-5">
        <ul>
            <strong>♦️ Explore Projects:</strong> Discover exciting open-source projects and contribute your skills.
          </ul>
          <ul>
            <strong>♦️ Collaborate:</strong> Connect with fellow students and developers to work on meaningful software solutions.
          </ul>
          <ul>
            <strong>♦️ Share Knowledge:</strong> Help others by answering questions and providing insights.
          </ul>
          <ul>
            <strong>♦️ Follow Best Practices:</strong> Ensure code quality, maintainability, and adherence to community standards.
          </ul>
        </ul>
      </div>

      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">✅ Community Etiquette</h2>
        <p className="text-secondary mt-2 text-sm">
          To ensure a positive experience, please follow these guidelines:
        </p>
        <ul className="text-secondary-foreground mt-4 list-disc space-y-2 pl-5">
          <li>Be respectful and inclusive in discussions.</li>
          <li>Provide constructive feedback and encourage learning.</li>
          <li>Avoid spam, self-promotion, and irrelevant discussions.</li>
          <li>Report issues and suggest improvements transparently.</li>
        </ul>
      </div>

      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">📖 Learning Resources</h2>
        <p className="text-secondary mt-2 text-sm">
          Need help getting started? Check out these resources:
        </p>
        <ul className="text-secondary-foreground mt-4 list-disc space-y-2 pl-5">
        <li> <a href="/c/getting-started" className="text-blue-400 underline">Getting Started Guide</a></li>
        <li><a href="/c/contribution-guide" className="text-blue-400 underline">Contribution Guidelines</a></li>

        <li><a href="/c/code-of-conduct" className="text-blue-400 underline">Code of Conduct</a></li>
        </ul>
      </div>

      <p className="mt-8 text-sm text-gray-400">
        Questions? Reach out to us at{' '}
        <a href="mailto:support@ucollab.com" className="underline text-blue-400">
          support@ucollab.com
        </a>.
      </p>
    </div>
  );
}
