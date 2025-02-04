import { updateUser } from '~/actions/user.actions';
import { withOnboarding } from '~/lib/auth/protected';

export const metadata = {
  title: 'UCollab — Onboarding',
};

async function OnboardingPage() {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto pt-8">
      <div className="bg-base-300 mx-auto w-full max-w-5xl rounded-lg p-4 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">Onboarding</h2>
        <form>
          <div className="form-control mb-4">
            <label className="label" htmlFor="gradYear">
              <span className="label-text">Graduation Year</span>
            </label>
            <input
              type="text"
              name="gradYear"
              id="gradYear"
              className="input input-bordered w-full"
              placeholder="2025"
              required
            />
          </div>
          <div className="form-control mb-4">
            <label className="label" htmlFor="skills">
              <span className="label-text">Skills (comma-separated)</span>
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              className="input input-bordered w-full"
              placeholder="e.g., react, nextjs, tailwind"
            />
          </div>
          <div className="form-control mb-4">
            <label className="label" htmlFor="githubProfile">
              <span className="label-text">GitHub Profile</span>
            </label>
            <input
              type="text"
              id="githubProfile"
              name="githubProfile"
              className="input input-bordered w-full"
              placeholder="Link to the GitHub profile"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              name="postType"
              value="Mentorship Status"
              className="btn btn-outline btn-xs btn-accent rounded-lg">
              Mentor
            </button>
            <button
              type="submit"
              name="postType"
              value="Feedback"
              className="btn btn-outline btn-xs btn-accent rounded-lg">
              Looking for Mentor
            </button>
            <button
              type="submit"
              name="postType"
              value="Discussion"
              className="btn btn-outline btn-xs btn-accent rounded-lg">
              None
            </button>
          </div>
          <button type="submit" className="btn btn-primary-content mx-auto mt-6 block w-auto px-8">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default withOnboarding(OnboardingPage);
