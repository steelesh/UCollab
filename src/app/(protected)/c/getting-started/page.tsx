export const metadata = {
  title: "UCollab — Getting Started",
};

export default function Page() {
  return (
    <div className="flex flex-col items-center px-6 py-12">
      <h1 className="text-center text-2xl font-bold select-none">🚀 Getting Started with UCollab</h1>
      <p className="text-secondary mt-2 max-w-2xl text-center text-sm italic">
        Follow this guide to quickly set up your account, explore projects, and start collaborating.
      </p>

      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">📌 Step 1: Create Your Account</h2>
        <p className="text-secondary mt-2 text-sm">
          To start using UCollab, sign up or log in using your university email or GitHub account.
        </p>
      </div>

      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">🔍 Step 2: Explore Projects</h2>
        <p className="text-secondary mt-2 text-sm">
          Browse open-source projects, find a team, or start your own project. Visit the
          {" "}
          <a href="/onboarding" className="text-blue-400 underline">Projects Page</a>
          {" "}
          to see what’s available.
        </p>
      </div>

      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">🤝 Step 3: Join the Community</h2>
        <p className="text-secondary mt-2 text-sm">
          Engage with other developers through discussions, contribute to repositories, and share ideas.
        </p>
        <p className="text-secondary mt-2 text-sm">
          Read our
          {" "}
          <a href="/c/community-guide" className="text-blue-400 underline">Community Guide</a>
          {" "}
          for best practices.
        </p>
      </div>

      <div className="relative mt-8 w-full max-w-3xl rounded-lg shadow-2xl px-6 py-6">
        <h2 className="text-lg font-semibold">✅ Step 4: Contribute</h2>
        <p className="text-secondary mt-2 text-sm">
          Ready to contribute? Check out our
          {" "}
          <a href="/c/contribution-guide" className="text-blue-400 underline">Contribution Guide</a>
          {" "}
          for guidelines on submitting code, reporting issues, and reviewing pull requests.
        </p>
      </div>

      <p className="mt-8 text-sm text-gray-400">
        Need help? Reach out to
        {" "}
        <a href="mailto:support@ucollab.com" className="underline text-blue-400">support@ucollab.com</a>
        .
      </p>
    </div>
  );
}
