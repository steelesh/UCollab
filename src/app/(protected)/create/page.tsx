import { createPost } from '~/features/posts/post.actions';
import { withAuth } from '~/auth/protected';

export const metadata = {
  title: 'UCollab — Create',
};

async function CreatePage() {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto pt-8">
      <div className="bg-base-300 mx-auto w-full max-w-5xl rounded-lg p-4 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">Create Your Project</h2>
        <form action={createPost}>
          <div className="form-control mb-4">
            <label className="label" htmlFor="title">
              <span className="label-text">Project Title</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="input input-bordered w-full"
              placeholder="Enter the project title"
              required
            />
          </div>
          <div className="form-control mb-4">
            <label className="label" htmlFor="description">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              id="description"
              className="textarea textarea-bordered w-full"
              placeholder="Describe your project"
              required></textarea>
          </div>
          <div className="form-control mb-4">
            <label className="label" htmlFor="technologies">
              <span className="label-text">Technologies (comma-separated)</span>
            </label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              className="input input-bordered w-full"
              placeholder="e.g., react, nextjs, tailwind"
            />
          </div>
          <div className="form-control mb-4">
            <label className="label" htmlFor="githubRepo">
              <span className="label-text">GitHub Repository</span>
            </label>
            <input
              type="text"
              id="githubRepo"
              name="githubRepo"
              className="input input-bordered w-full"
              placeholder="Link to the GitHub repo"
            />
          </div>
          <div className="mb-4 flex gap-4">
            <div className="flex flex-col items-center">
              <input type="radio" name="postType" id="contribution" value="CONTRIBUTION" className="peer hidden" />
              <label
                htmlFor="contribution"
                className="btn btn-outline btn-xs btn-accent peer-checked:bg-primary-content rounded-lg peer-checked:text-white">
                Contribution
              </label>
            </div>
            <div className="flex flex-col items-center">
              <input type="radio" name="postType" id="feedback" value="FEEDBACK" className="peer hidden" />
              <label
                htmlFor="feedback"
                className="btn btn-outline btn-xs btn-accent peer-checked:bg-primary-content rounded-lg peer-checked:text-white">
                Feedback
              </label>
            </div>
            <div className="flex flex-col items-center">
              <input
                type="radio"
                name="postType"
                id="discussion"
                value="DISCUSSION"
                className="peer hidden"
                defaultChecked
              />
              <label
                htmlFor="discussion"
                className="btn btn-outline btn-xs btn-accent peer-checked:bg-primary-content rounded-lg peer-checked:text-white">
                Discussion
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary-content mx-auto mt-6 block w-auto px-8">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(CreatePage);
