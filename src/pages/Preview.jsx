import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Check,
  Circle,
  GitBranch,
  GitBranchIcon,
  LoaderCircle,
  MoveUpRightIcon,
  RotateCcw,
  X,
} from "lucide-react";

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

function ActivityAvatar({ user }) {
  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name || "User"}
        className="h-9 w-9 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3b3b3b] text-white">
      <RotateCcw size={16} />
    </div>
  );
}

function StepIcon({ state }) {
  if (state === "complete") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-black">
        <Check size={13} strokeWidth={3} />
      </span>
    );
  }

  if (state === "active") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-white">
        <LoaderCircle size={13} className="animate-spin" />
      </span>
    );
  }

  if (state === "failed") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
        <X size={13} strokeWidth={3} />
      </span>
    );
  }

  return <Circle size={18} className="text-gray-600" />;
}

function getDeploymentSteps(status) {
  const steps = [
    { key: "created", label: "Deployment created" },
    { key: "queued", label: "Waiting for deployment worker" },
    { key: "build", label: "Building Docker image" },
    { key: "start", label: "Starting application container" },
    { key: "health", label: "Running health check" },
  ];

  const progressByStatus = {
    PENDING: 0,
    QUEUED: 1,
    BUILDING: 2,
    READY: 5,
    FAILED: 2,
    CANCELLED: 0,
  };

  const completedSteps = progressByStatus[status] ?? 0;

  return steps.map((step, index) => {
    if (status === "FAILED" && index === completedSteps) {
      return {
        ...step,
        state: "failed",
        label: "Deployment failed during Docker build",
      };
    }

    if (index < completedSteps) {
      return { ...step, state: "complete" };
    }

    if (index === completedSteps && status === "BUILDING") {
      return { ...step, state: "active" };
    }

    return { ...step, state: "pending" };
  });
}

function Preview() {
  const { deploymentId } = useParams();
  const navigate = useNavigate();

  const [deployment, setDeployment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeploymentOpen, setIsDeploymentOpen] = useState(false);
  const [isRedeploying, setIsRedeploying] = useState(false);
  const [buildLogs, setBuildLogs] = useState([]);
  const [isLoadingBuildLogs, setIsLoadingBuildLogs] = useState(false);

  const loadDeployment = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/deployments/${deploymentId}`,
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
        throw new Error(data.message || "Could not load deployment.");
      }

      setDeployment(data.deployment);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [deploymentId, navigate]);
  
    useEffect(() => {
      loadDeployment();
    }, [loadDeployment]);
  const [streamKey, setStreamKey] = useState(0);

  useEffect(() => {
    if (!deploymentId) {
      return undefined;
    }

    setBuildLogs([]);

    const eventSource = new EventSource(
      `${API_URL}/api/deployments/${deploymentId}/logs/stream`,
      { withCredentials: true },
    );

    eventSource.onmessage = (event) => {
      const log = JSON.parse(event.data);
      setBuildLogs((currentLogs) => [...currentLogs, log]);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [deploymentId, streamKey]);

  useEffect(() => {
    if (!["PENDING", "QUEUED", "BUILDING"].includes(deployment?.status)) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      loadDeployment();
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [deployment?.status, loadDeployment]);

  async function handleRedeploy() {
    if (!deployment || isRedeploying) {
      return;
    }

    setIsRedeploying(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${deployment.project.id}/deployments`,
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
        throw new Error(data.message || "Could not start redeployment.");
      }

      navigate(`/dashboard/deployments/${data.deployment.id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsRedeploying(false);
    }
  }

  if (isLoading) {
    return <p className="p-8 text-gray-400">Loading deployment...</p>;
  }

  if (error) {
    return (
      <section className="p-8">
        <Link
          to="/dashboard/projects"
          className="text-sm text-[#b875f4] hover:text-white">
          ← Back to projects
        </Link>

        <p className="mt-6 text-red-400">{error}</p>
      </section>
    );
  }

  if (!deployment) {
    return null;
  }

  const { project, activities } = deployment;
  const deploymentSteps = getDeploymentSteps(deployment.status);
  const triggerActivity = activities.at(-1);
  const websiteUrl = deployment.publicUrl || deployment.localUrl;

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <Link
        to="/dashboard/projects"
        className="cursor-pointer text-sm text-gray-500 transition hover:text-[#b875f4]">
        ← Back to projects
      </Link>

      <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-center">
        {deployment.previewScreenshotUrl ? (
          <img
            src={deployment.previewScreenshotUrl}
            alt={`${project.name} deployment preview`}
            className="h-60 w-full rounded-2xl border-4 border-[#2d2d2d] object-cover md:w-104"
          />
        ) : (
          <div className="flex h-60 w-full flex-col items-center justify-center rounded-2xl border-4 border-[#2d2d2d] bg-[#111] px-6 text-center md:w-104">
            <p className="font-medium text-gray-300">Preview unavailable</p>
            <p className="mt-2 text-sm text-gray-500">
              A screenshot is captured after this deployment is ready.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-white">
              {project.name}
            </h1>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                statusClasses[deployment.status] || statusClasses.PENDING
              }`}>
              {formatStatus(deployment.status)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-gray-400">
            <span>Last updated {formatDate(deployment.updatedAt)}</span>
            <span className="text-gray-600">by</span>

            <button
              type="button"
              onClick={handleRedeploy}
              disabled={isRedeploying}
              className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-gray-200 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
              <RotateCcw size={16} />
              {isRedeploying ? "Starting..." : "Redeploy"}
            </button>
          </div>

          <div className="pt-3">
            <p className="text-gray-400">
              {deployment.publicUrl ? "Domain" : "Local URL"}
            </p>

            {websiteUrl ? (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 flex w-fit cursor-pointer items-center gap-2 font-medium text-white transition hover:text-[#b875f4]">
                {websiteUrl.replace(/^https?:\/\//, "")}
                <MoveUpRightIcon size={16} />
              </a>
            ) : (
              <p className="mt-1 text-gray-500">
                Local URL will appear after the container starts.
              </p>
            )}
          </div>

          {project.repositoryUrl ? (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-fit cursor-pointer items-center gap-2 font-medium text-gray-200 transition hover:text-[#b875f4]">
              <GitBranchIcon size={17} />
              {project.githubRepositoryFullName || project.repositoryUrl}
              <MoveUpRightIcon size={15} />
            </a>
          ) : (
            <p className="flex items-center gap-2 font-medium text-gray-200">
              <GitBranchIcon size={17} />
              {project.githubRepositoryFullName || "Repository"}
            </p>
          )}

          <p className="flex items-center gap-2 text-gray-400">
            <GitBranch size={17} />
            branch{" "}
            <span className="font-semibold text-gray-200">
              {deployment.branch}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Activity</h2>

            <div className="mt-5 inline-flex rounded-xl bg-[#1c1c1c] p-1">
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-[#444] bg-[#101010] px-4 py-1.5 text-sm font-semibold text-white">
                Live
              </button>

              <button
                type="button"
                disabled
                className="cursor-not-allowed px-4 py-1.5 text-sm font-semibold text-gray-500 disabled:opacity-50">
                Previews
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRedeploy}
            disabled={isRedeploying}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#444] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1c1c1c] disabled:cursor-not-allowed disabled:opacity-50">
            <RotateCcw size={16} />
            {isRedeploying ? "Starting..." : "Redeploy"}
          </button>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl bg-[#1b1b1b]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-gray-300">
              <tr>
                <th className="px-6 py-4 font-semibold">Update</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Changes</th>
              </tr>
            </thead>

            <tbody>
              <tr
                onClick={() => setIsDeploymentOpen((isOpen) => !isOpen)}
                className="cursor-pointer border-t border-[#292929] transition hover:bg-[#202020]">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <ActivityAvatar user={triggerActivity?.actorUser} />

                    <div>
                      <p className="font-semibold text-white">
                        {triggerActivity?.actorUser?.name || "Manual update"}
                      </p>

                      <p className="text-gray-500">
                        {formatDate(deployment.createdAt)}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-semibold ${
                      statusClasses[deployment.status] || statusClasses.PENDING
                    }`}>
                    {formatStatus(deployment.status)}
                  </span>
                </td>

                <td className="px-6 py-5 text-gray-300">
                  {deployment.status === "QUEUED"
                    ? "Waiting for deployment worker"
                    : triggerActivity?.message || "Deployment update"}
                </td>
              </tr>

              {isDeploymentOpen && (
                <tr className="border-t border-[#292929] bg-[#1b1b1b]">
                  <td colSpan="3" className="px-6 py-6">
                    <div className="grid gap-8 lg:grid-cols-2">
                      <div>
                        <h3 className="font-semibold text-white">
                          Deployment history
                        </h3>

                        <div className="mt-4 space-y-3">
                          {[...activities].reverse().map((activity) => {
                            const activityStatus =
                              activity.toStatus ||
                              activity.fromStatus ||
                              deployment.status;

                            return (
                              <div
                                key={activity.id}
                                className="flex items-center gap-3">
                                <StepIcon state="complete" />

                                <div>
                                  <p className="text-sm font-medium text-gray-200">
                                    {formatStatus(activityStatus)}
                                  </p>

                                  <p className="text-sm text-gray-500">
                                    {activity.message}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          Build progress
                        </h3>

                        <div className="mt-4 space-y-3">
                          {deploymentSteps.map((step) => (
                            <div
                              key={step.key}
                              className="flex items-center gap-3">
                              <StepIcon state={step.state} />

                              <span
                                className={
                                  step.state === "pending"
                                    ? "text-gray-500"
                                    : "text-gray-200"
                                }>
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Build logs</h2>
            <p className="mt-1 text-sm text-gray-400">
              Persisted Docker build output for this deployment.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setStreamKey((key) => key + 1)}
            className="cursor-pointer rounded-xl border border-[#444] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1c1c1c]">
            Reconnect
          </button>
        </div>

        <pre className="mt-5 max-h-125 overflow-auto rounded-2xl border border-gray-800 bg-[#111] p-5 font-mono text-xs leading-6 text-gray-300">
          {buildLogs.length > 0
            ? buildLogs.map((log) => log.message).join("\n")
            : "No persisted build logs yet. Create a new deployment after enabling build-log storage."}
        </pre>
      </div>
    </section>
  );
}

export default Preview;
