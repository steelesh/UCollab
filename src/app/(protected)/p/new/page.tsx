import { ProjectForm } from '~/components/projects/project-form';
import { withAuth } from '~/security/protected';

export const metadata = {
  title: 'UCollab — New Project',
};

async function NewProjectPage() {
  return (
    <div className="mx-auto w-full max-w-5xl rounded-lg shadow-lg">
      <h2 className="mb-3 text-center text-3xl font-bold">New Project</h2>
      <ProjectForm />
    </div>
  );
}

export default withAuth(NewProjectPage);
