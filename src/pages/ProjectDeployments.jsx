import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const statusClasses = {
  PENDING: "bg-amber-500/15 text-amber-300",
  QUEUED: "bg-blue-500/15 text-blue-300",
  BUILDING: "bg-violet-500/15 text-violet-300",
  READY: "bg-emerald-500/15 text-emerald-300",
  FAILED: "bg-red-500/15 text-red-300",
  CANCELLED: "bg-gray-500/15 text-gray-300",
};

function formatStatus(status) {
  return status.toLowerCase().replaceAll("_", " ");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function ProjectDeployments() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRollingBackId, setIsRollingBackId] = useState("");
  const [isStoppingId, setIsStoppingId] = useState("");
  const [stopDeploymentId, setStopDeploymentId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjectHistory() {
      try {
        const response = await fetch(
          `${API_URL}/api/projects/${projectId}/deployments`,
          {
            credentials: "include",
          },
        );

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load project deployment history.",
          );
        }

        setProject(data.project);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjectHistory();
  }, [projectId, navigate]);

  async function handleRollback(sourceDeploymentId) {
    if (isRollingBackId) {
      return;
    }

    setIsRollingBackId(sourceDeploymentId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/deployments/${sourceDeploymentId}/rollback`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (response.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not start rollback.");
      }

      navigate(`/dashboard/deployments/${data.deployment.id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsRollingBackId("");
    }
  }

  async function handleStop(deploymentId) {
    if (isStoppingId) {
      return;
    }

    setIsStoppingId(deploymentId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/deployments/${deploymentId}/stop`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (response.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not stop the container.");
      }

      setProject((currentProject) => ({
        ...currentProject,
        deployments: currentProject.deployments.map((deployment) =>
          deployment.id === data.deployment.id
            ? {
                ...deployment,
                stoppedAt: data.deployment.stoppedAt,
              }
            : deployment,
        ),
      }));

      setStopDeploymentId("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsStoppingId("");
    }
  }

  if (isLoading) {
    return <p className="text-gray-400">Loading project history...</p>;
  }

  if (error && !project) {
    return (
      <section>
        <Link
          to="/dashboard/projects"
          className="text-sm text-[#b875f4] hover:text-white">
          ← Back to projects
        </Link>

        <p className="mt-6 text-red-400">{error}</p>
      </section>
    );
  }

  if (!project) {
    return null;
  }

  const stopDeployment = project.deployments.find(
    (deployment) => deployment.id === stopDeploymentId,
  );

  return (
    <section>
      <Link
        to="/dashboard/projects"
        className="cursor-pointer text-sm text-gray-400 transition hover:text-[#b875f4]">
        ← Back to projects
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">Project history</p>
          <h1 className="mt-1 text-4xl font-semibold text-white">
            {project.name}
          </h1>
          <p className="mt-2 text-gray-400">
            {project.githubRepositoryFullName || project.repositoryUrl}
          </p>
        </div>

        {project.deployments[0] && (
          <Link
            to={`/dashboard/deployments/${project.deployments[0].id}`}
            className="cursor-pointer rounded-md border border-[#8338c9] px-4 py-2 text-sm font-semibold text-[#b875f4] transition hover:bg-[#2b173d]">
            Open latest deployment
          </Link>
        )}
      </div>

      {error && <p className="mt-6 text-red-400">{error}</p>}

      {project.deployments.length === 0 ? (
        <p className="mt-8 text-gray-400">This project has no deployments.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-gray-800 bg-[#1b1b1b]">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-gray-800 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Deployment</th>
                <th className="px-6 py-4 font-medium">Branch</th>
                <th className="px-6 py-4 font-medium">Commit</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {project.deployments.map((deployment) => (
                <tr
                  key={deployment.id}
                  className="border-b border-gray-800/80 transition hover:bg-[#222]">
                  <td className="px-6 py-4">
                    <Link
                      to={`/dashboard/deployments/${deployment.id}`}
                      className="font-medium text-white hover:text-[#b875f4]">
                      {deployment.id}
                    </Link>
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {deployment.branch}
                  </td>

                  <td className="px-6 py-4 font-mono text-gray-400">
                    {deployment.commitSha.slice(0, 7)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusClasses[deployment.status] ||
                        statusClasses.PENDING
                      }`}>
                      {formatStatus(deployment.status)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    {formatDate(deployment.createdAt)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {deployment.status === "READY" && (
                        <button
                          type="button"
                          onClick={() => handleRollback(deployment.id)}
                          disabled={Boolean(isRollingBackId)}
                          className="cursor-pointer rounded-md border border-amber-500/60 px-3 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-50">
                          {isRollingBackId === deployment.id
                            ? "Starting..."
                            : "Roll back to this"}
                        </button>
                      )}

                      {deployment.supersededAt && !deployment.stoppedAt && (
                        <button
                          type="button"
                          onClick={() => setStopDeploymentId(deployment.id)}
                          disabled={Boolean(isStoppingId)}
                          className="cursor-pointer rounded-md border border-red-500/60 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50">
                          {isStoppingId === deployment.id
                            ? "Stopping..."
                            : "Stop container"}
                        </button>
                      )}

                      {deployment.stoppedAt && (
                        <span className="text-xs text-gray-500">
                          Container stopped
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {stopDeployment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#151515] p-6 shadow-2xl">
            <p className="text-sm text-gray-400">Stop old container</p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Are you sure?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              This will stop the old Docker container for deployment{" "}
              <span className="font-mono text-gray-200">
                {stopDeployment.id.slice(0, 8)}
              </span>
              . You can still roll back later by rebuilding this deployment.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setStopDeploymentId("")}
                disabled={Boolean(isStoppingId)}
                className="cursor-pointer rounded-md border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50">
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleStop(stopDeployment.id)}
                disabled={Boolean(isStoppingId)}
                className="cursor-pointer rounded-md border border-red-500/60 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50">
                {isStoppingId === stopDeployment.id
                  ? "Stopping..."
                  : "Stop container"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProjectDeployments;