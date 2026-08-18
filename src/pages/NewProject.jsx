import { useEffect, useRef, useState } from "react";
  import { Link, useNavigate } from "react-router-dom";

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  function parseEnvFileText(text) {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .reduce((accumulator, line) => {
        const equalsIndex = line.indexOf("=");

        if (equalsIndex === -1) {
          return accumulator;
        }

        const key = line.slice(0, equalsIndex).trim();
        let value = line.slice(equalsIndex + 1).trim();

        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        if (key) {
          accumulator.push({ key, value });
        }

        return accumulator;
      }, []);
  }

  function NewProject() {
    const navigate = useNavigate();
    const envFileInputRef = useRef(null);

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
    const [detectedKind, setDetectedKind] = useState("");
    const [buildStrategyOverride, setBuildStrategyOverride] = useState("");
    const [isDetecting, setIsDetecting] = useState(false);
    const [environmentVariables, setEnvironmentVariables] = useState([]);
    const [envKeyInput, setEnvKeyInput] = useState("");
    const [envValueInput, setEnvValueInput] = useState("");

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

    useEffect(() => {
      if (!selectedRepository || !form.branch) {
        setDetectedKind("");
        setBuildStrategyOverride("");
        return;
      }

      async function detectBuildStrategy() {
        setIsDetecting(true);
        setError("");

        try {
          const query = new URLSearchParams({
            installationId: selectedRepository.installationId,
            repositoryFullName: selectedRepository.fullName,
            branch: form.branch,
          });

          const response = await fetch(
            `${API_URL}/api/github/detect?${query}`,
            { credentials: "include" },
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Could not detect a build strategy.");
          }

          setDetectedKind(data.kind);
          setBuildStrategyOverride(
            data.kind === "UNSUPPORTED" || data.kind === "AMBIGUOUS"
              ? ""
              : data.kind,
          );
        } catch (requestError) {
          setError(requestError.message);
        } finally {
          setIsDetecting(false);
        }
      }

      detectBuildStrategy();
    }, [selectedRepository, form.branch]);

    function upsertEnvironmentVariable(key, value) {
      setEnvironmentVariables((currentVariables) => {
        const withoutExistingKey = currentVariables.filter(
          (variable) => variable.key !== key,
        );

        return [...withoutExistingKey, { key, value }];
      });
    }

    function handleAddEnvVar() {
      const trimmedKey = envKeyInput.trim();

      if (!trimmedKey || !envValueInput) {
        setError("Both a key and a value are required.");
        return;
      }

      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(trimmedKey)) {
        setError(
          "Environment variable keys must start with a letter or underscore and contain only letters, numbers, and underscores.",
        );
        return;
      }

      upsertEnvironmentVariable(trimmedKey, envValueInput);
      setEnvKeyInput("");
      setEnvValueInput("");
      setError("");
    }

    function handleRemoveEnvVar(key) {
      setEnvironmentVariables((currentVariables) =>
        currentVariables.filter((variable) => variable.key !== key),
      );
    }

    function handleEnvFileChange(event) {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const parsedVariables = parseEnvFileText(String(reader.result || ""));

        setEnvironmentVariables((currentVariables) => {
          const merged = [...currentVariables];

          parsedVariables.forEach(({ key, value }) => {
            const existingIndex = merged.findIndex(
              (variable) => variable.key === key,
            );

            if (existingIndex >= 0) {
              merged[existingIndex] = { key, value };
            } else {
              merged.push({ key, value });
            }
          });

          return merged;
        });
      };

      reader.readAsText(file);

      if (envFileInputRef.current) {
        envFileInputRef.current.value = "";
      }
    }

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
            buildStrategy:
              detectedKind === "DOCKERFILE" ? "DOCKERFILE" : buildStrategyOverride,
            environmentVariables,
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

          {selectedRepository && form.branch && (
            <div className="rounded-md border border-gray-700 bg-[#141414] p-4">
              <p className="text-sm font-medium text-gray-200">Build detection</p>

              {isDetecting ? (
                <p className="mt-2 text-sm text-gray-400">
                  Detecting build strategy...
                </p>
              ) : (
                <>
                  <p className="mt-2 text-sm text-gray-400">
                    {detectedKind === "DOCKERFILE" &&
                      "Found a root Dockerfile — KindlyDeploy will build it directly."}
                    {detectedKind === "NODE_FRONTEND" &&
                      "Detected a Node.js static frontend (build + serve)."}
                    {detectedKind === "NODE_BACKEND" &&
                      "Detected a Node.js backend (runs npm start)."}
                    {detectedKind === "AMBIGUOUS" &&
                      "Could not confidently tell frontend from backend — choose one below."}
                    {detectedKind === "UNSUPPORTED" &&
                      "No Dockerfile and no package.json found — add a Dockerfile to deploy this repository."}
                  </p>

                  {detectedKind &&
                    detectedKind !== "DOCKERFILE" &&
                    detectedKind !== "UNSUPPORTED" && (
                      <label className="mt-3 block">
                        <span className="text-sm font-medium text-gray-200">
                          Build strategy
                        </span>
                        <select
                          value={buildStrategyOverride}
                          onChange={(event) =>
                            setBuildStrategyOverride(event.target.value)
                          }
                          className="mt-2 w-full rounded-md border border-gray-700 bg-[#101010] px-3 py-2.5 text-white outline-none focus:border-[#8338c9]"
                        >
                          <option value="">Choose a build strategy</option>
                          <option value="NODE_FRONTEND">
                            Node.js static frontend
                          </option>
                          <option value="NODE_BACKEND">Node.js backend</option>
                        </select>
                      </label>
                    )}
                </>
              )}
            </div>
          )}

          <div className="rounded-md border border-gray-700 bg-[#141414] p-4">
            <p className="text-sm font-medium text-gray-200">
              Environment variables
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Optional. Added to the container the moment the first deployment
              runs.
            </p>

            {environmentVariables.length > 0 && (
              <ul className="mt-3 space-y-2">
                {environmentVariables.map((variable) => (
                  <li
                    key={variable.key}
                    className="flex items-center justify-between rounded-md border border-gray-700 bg-[#101010] px-3 py-2"
                  >
                    <span className="font-mono text-sm text-white">
                      {variable.key}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-gray-500">
                        ••••••••
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEnvVar(variable.key)}
                        className="cursor-pointer text-sm text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-3 flex flex-wrap items-end gap-3">
              <label className="block">
                <span className="text-xs font-medium text-gray-400">Key</span>
                <input
                  value={envKeyInput}
                  onChange={(event) => setEnvKeyInput(event.target.value)}
                  placeholder="DATABASE_URL"
                  className="mt-1 w-48 rounded-md border border-gray-700 bg-[#101010] px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#8338c9]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-gray-400">Value</span>
                <input
                  type="password"
                  value={envValueInput}
                  onChange={(event) => setEnvValueInput(event.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-64 rounded-md border border-gray-700 bg-[#101010] px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#8338c9]"
                />
              </label>

              <button
                type="button"
                onClick={handleAddEnvVar}
                className="cursor-pointer rounded-md border border-[#8338c9] px-4 py-2 text-sm font-semibold text-[#b875f4] transition hover:bg-[#2b173d]"
              >
                Add
              </button>
            </div>

            <div className="mt-3">
              <label className="cursor-pointer text-sm font-medium text-[#b875f4] hover:text-white">
                Or upload a .env file
                <input
                  ref={envFileInputRef}
                  type="file"
                  accept=".env,text/plain"
                  onChange={handleEnvFileChange}
                  className="hidden"
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Parsed in your browser only — the file itself is never uploaded.
              </p>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              !selectedRepository ||
              !form.branch ||
              isDetecting ||
              detectedKind === "UNSUPPORTED" ||
              (detectedKind !== "DOCKERFILE" && !buildStrategyOverride)
            }
            className="rounded-md bg-[#8338c9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6e2aa8] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Creating project..." : "Create Project"}
          </button>
        </form>
      </section>
    );
  }

  export default NewProject;