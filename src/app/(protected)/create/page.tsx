import { createPost } from '~/actions/post.actions';
import { withAuth } from '~/lib/auth/protected';

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
            <label className="label" htmlFor="projectTitle">
              <span className="label-text">Project Title</span>
            </label>
            <input
              type="text"
              name="title"
              id="projectTitle"
              className="input input-bordered w-full"
              placeholder="Enter the project title"
              required
            />
          </div>
          <div className="form-control mb-4">
            <label className="label" htmlFor="projectDescription">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              id="projectDescription"
              className="textarea textarea-bordered w-full"
              placeholder="Describe your project"
              required></textarea>
          </div>
          <div className="form-control mb-4">
            <label className="label" htmlFor="projectTechnologies">
              <span className="label-text">Technologies (comma-separated)</span>
            </label>
            <input
              type="text"
              id="projectTechnologies"
              name="technologies"
              className="input input-bordered w-full"
              placeholder="e.g., react, nextjs, tailwind"
            />
          </div>
          <div className="form-control mb-4">
            <label className="label" htmlFor="projectGithub">
              <span className="label-text">GitHub Repository</span>
            </label>
            <input
              type="text"
              id="projectGithub"
              name="githubRepo"
              className="input input-bordered w-full"
              placeholder="Link to the GitHub repo"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              name="postType"
              value="Contribution"
              className="btn btn-outline btn-xs btn-accent rounded-lg">
              Contribution
            </button>
            <button
              type="submit"
              name="postType"
              value="Feedback"
              className="btn btn-outline btn-xs btn-accent rounded-lg">
              Feedback
            </button>
            <button
              type="submit"
              name="postType"
              value="Discussion"
              className="btn btn-outline btn-xs btn-accent rounded-lg">
              Discussion
            </button>
          </div>
          <button type="submit" className="btn btn-primary mx-auto mt-6 block w-auto px-8">
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(CreatePage);
