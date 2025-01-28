import Head from "next/head";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher"; // Import fetcher

interface Project {
  user?: {
    username: string;
  };
  title: string;
  createdDate: string;
  createdById: string;
  description: string;
  postType: "CONTRIBUTION" | "FEEDBACK" | "DISCUSSION";
  status: string;
  technologies: string[];
  githubRepo?: string;
}

export default function Explore() {
  const [projects, setProjects]: [
    Project[],
    React.Dispatch<React.SetStateAction<Project[]>>,
  ] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects: () => Promise<void> = async () => {
      try {
        const response: Response = await fetch("/api/posts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const jsonResponse: { data: Project[]; error: string | null } =
          (await response.json()) as { data: Project[]; error: string | null };
        if (jsonResponse.error) throw new Error(jsonResponse.error);

        const projectsWithUser = await Promise.all(
          jsonResponse.data.map(async (project) => {
            try {
              const userResponse = await fetch(
                `/api/users/from-id/${project.createdById}`,
              );
              if (userResponse.ok) {
                const userData = (await userResponse.json()) as {
                  username: string;
                };
                return { ...project, user: { username: userData.username } };
              }
            } catch {}
            return project;
          }),
        );

        setProjects(projectsWithUser);
      } catch (error: unknown) {
        console.error("Error fetching posts:", error);
      }
    };

    void fetchProjects();
  }, []);

  return (
    <>
      <Head>
        <title>UCollab — Explore</title>
      </Head>
      <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
        <div className="container mx-auto grid gap-8 px-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="card card-bordered w-full bg-base-300 shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1.0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-body">
                <div className="mb-2 flex items-center">
                  <div className="avatar mr-4">
                    <div className="w-16 rounded-lg bg-gray-200">
                      <img
                        src="/project.svg"
                        alt="Project image"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="card-title text-lg font-bold text-white">
                      {project.title}
                    </h2>
                    <span className="text-sm text-accent">
                      {new Date(project.createdDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                      <br />
                      <a
                        href={`/${project.user?.username ?? ""}`}
                        className="link link-accent font-bold tracking-wider no-underline"
                      >
                        {project.user?.username ?? "Unknown User"}
                      </a>
                    </span>
                  </div>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="badge badge-primary badge-outline badge-md">
                    {project.postType}
                  </span>
                </div>
                <p className="mb-4 text-white">{project.description}</p>
                <div className="divider mb-4"></div>
                <div className="mb-4">
                  <span className="text-sm font-semibold text-white">
                    Technologies:
                  </span>
                  <div className="">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="badge badge-accent badge-outline badge-sm mb-2 mr-2 font-normal tracking-wider"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

