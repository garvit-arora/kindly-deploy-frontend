import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function NewProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    branch: "",
  });
  const [repositories, setRepositories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState("");
  const [isLoadingRepositories, setIsLoadingRepositories] = useState(true);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedRepository = repositories.find(
    (repository) => repository.id === selectedRepositoryId,
  );

  useEffect(() => {
    async function loadRepositories() {
      try {
        const response = await fetch(`${API_URL}/api/github/repositories`, {
          credentials: "include",
        });

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load repositories.");
        }

        setRepositories(data.repositories);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoadingRepositories(false);
      }
    }

    loadRepositories();
  }, [navigate]);

  useEffect(() => {
    if (!selectedRepository) {
      setBranches([]);
      return;
    }

    async function loadBranches() {
      setIsLoadingBranches(true);
      setError("");

      try {
        const query = new URLSearchParams({
          installationId: selectedRepository.installationId,
          repositoryFullName: selectedRepository.fullName,
        });

        const response = await fetch(
          `${API_URL}/api/github/branches?${query}`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load branches.");
        }

        setBranches(data.branches);

        setForm((currentForm) => ({
          ...currentForm,
          branch: selectedRepository.defaultBranch || "",
        }));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoadingBranches(false);
      }
    }

    loadBranches();
  }, [selectedRepository]);

  function handleProjectNameChange(event) {
    setForm((currentForm) => ({
      ...currentForm,
      name: event.target.value,
    }));
  }

  function handleRepositoryChange(event) {
    setSelectedRepositoryId(event.target.value);
  }

  function handleBranchChange(event) {
    setForm((currentForm) => ({
      ...currentForm,
      branch: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!selectedRepository) {
      setError("Choose a GitHub repository.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          branch: form.branch,
          githubInstallationId: selectedRepository.installationId,
          githubRepositoryId: selectedRepository.id,
          githubRepositoryFullName: selectedRepository.fullName,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not create project.");
      }

      navigate(`/dashboard/deployments/${data.deployment.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl">
      <Link
        to="/dashboard/projects"
        className="text-sm text-gray-400 transition hover:text-[#8338c9]">
        &larr; Back to Projects
      </Link>

      <h1 className="mt-6 text-4xl font-semibold">Create a new project</h1>
      <p className="mt-2 text-gray-400">
        Select a repository and branch that KindlyDeploy can access.
      </p>

      <form
        className="mt-8 space-y-5 rounded-xl border border-gray-800 bg-[#1b1b1b] p-6"
        onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium">Project name</span>
          <input
            required
            value={form.name}
            onChange={handleProjectNameChange}
            placeholder="My first deployment"
            className="mt-2 w-full rounded-md border border-gray-700 bg-[#141414] px-3 py-2.5 text-white outline-none focus:border-[#8338c9]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">GitHub repository</span>
          <select
            required
            value={selectedRepositoryId}
            onChange={handleRepositoryChange}
            disabled={isLoadingRepositories}
            className="mt-2 w-full rounded-md border border-gray-700 bg-[#141414] px-3 py-2.5 text-white outline-none focus:border-[#8338c9] disabled:opacity-60">
            <option value="">
              {isLoadingRepositories
                ? "Loading repositories..."
                : "Choose a repository"}
            </option>

            {repositories.map((repository) => (
              <option key={repository.id} value={repository.id}>
                {repository.fullName}
                {repository.isPrivate ? " (private)" : ""}
              </option>
            ))}
          </select>
        </label>

        {!isLoadingRepositories && repositories.length === 0 && (
          <a
            href={`${API_URL}/api/github/install`}
            className="inline-flex rounded-md border border-[#8338c9] px-4 py-2 text-sm font-semibold text-[#b875f4] transition hover:bg-[#2b173d]">
            Connect GitHub repositories
          </a>
        )}

        <label className="block">
          <span className="text-sm font-medium">Branch</span>
          <select
            required
            value={form.branch}
            onChange={handleBranchChange}
            disabled={!selectedRepository || isLoadingBranches}
            className="mt-2 w-full rounded-md border border-gray-700 bg-[#141414] px-3 py-2.5 text-white outline-none focus:border-[#8338c9] disabled:opacity-60">
            <option value="">
              {isLoadingBranches ? "Loading branches..." : "Choose a branch"}
            </option>

            {branches.map((branch) => (
              <option key={branch.sha} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting || !selectedRepository || !form.branch}
          className="rounded-md bg-[#8338c9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6e2aa8] disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Creating project..." : "Create Project"}
        </button>
      </form>
    </section>
  );
}

export default NewProject;
