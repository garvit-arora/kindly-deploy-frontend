import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  function EnvironmentVariables() {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [variables, setVariables] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [isLoadingVariables, setIsLoadingVariables] = useState(false);
    const [form, setForm] = useState({ key: "", value: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const loadVariables = useCallback(
      async (projectId) => {
        if (!projectId) {
          setVariables([]);
          return;
        }

        setIsLoadingVariables(true);

        try {
          const response = await fetch(
            `${API_URL}/api/projects/${projectId}/environment-variables`,
            { credentials: "include" },
          );

          if (response.status === 401) {
            navigate("/login", { replace: true });
            return;
          }

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Could not load environment variables.");
          }

          setVariables(data.variables);
          setError("");
        } catch (requestError) {
          setError(requestError.message);
        } finally {
          setIsLoadingVariables(false);
        }
      },
      [navigate],
    );

    useEffect(() => {
      async function loadProjects() {
        try {
          const response = await fetch(`${API_URL}/api/projects`, {
            credentials: "include",
          });

          if (response.status === 401) {
            navigate("/login", { replace: true });
            return;
          }

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Could not load projects.");
          }

          setProjects(data.projects);

          if (data.projects.length > 0) {
            setSelectedProjectId(data.projects[0].id);
            await loadVariables(data.projects[0].id);
          }
        } catch (requestError) {
          setError(requestError.message);
        } finally {
          setIsLoadingProjects(false);
        }
      }

      loadProjects();
    }, [loadVariables, navigate]);

    function handleProjectChange(event) {
      const projectId = event.target.value;
      setSelectedProjectId(projectId);
      setError("");
      loadVariables(projectId);
    }

    function handleKeyChange(event) {
      setForm((currentForm) => ({ ...currentForm, key: event.target.value }));
    }

    function handleValueChange(event) {
      setForm((currentForm) => ({ ...currentForm, value: event.target.value }));
    }

    async function handleSave(event) {
      event.preventDefault();
      setError("");

      if (!selectedProjectId) {
        setError("Choose a project first.");
        return;
      }

      setIsSaving(true);

      try {
        const response = await fetch(
          `${API_URL}/api/projects/${selectedProjectId}/environment-variables`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          },
        );

        const data = await response.json();

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Could not save the variable.");
        }

        setForm({ key: "", value: "" });
        await loadVariables(selectedProjectId);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsSaving(false);
      }
    }

    async function handleDelete(variableId) {
      try {
        const response = await fetch(

  `${API_URL}/api/projects/${selectedProjectId}/environment-variables/${variableId}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok && response.status !== 204) {
          const data = await response.json();
          throw new Error(data.message || "Could not delete the variable.");
        }

        await loadVariables(selectedProjectId);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    if (isLoadingProjects) {
      return <p className="text-gray-400">Loading projects...</p>;
    }

    return (
      <section>
        <h1 className="text-4xl font-semibold text-white">Environment Variables</h1>
        <p className="mt-2 text-gray-400">
          Values are encrypted at rest and injected into the container at deploy time.
        </p>

        <label className="mt-8 block max-w-xl">
          <span className="text-sm font-medium text-gray-200">Project</span>
          <select
            value={selectedProjectId}
            onChange={handleProjectChange}
            className="mt-2 w-full rounded-md border border-gray-700 bg-[#141414] px-3
  py-2.5 text-white outline-none focus:border-[#8338c9]"
          >
            <option value="">Choose a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="mt-5 text-sm text-red-400">{error}</p>}

        {selectedProjectId && (
          <>
            <div className="mt-8 overflow-hidden rounded-xl border border-gray-800
  bg-[#1b1b1b]">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-800 text-xs uppercase
  tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Key</th>
                    <th className="px-6 py-4 font-medium">Value</th>
                    <th className="px-6 py-4 font-medium">Updated</th>
                    <th className="px-6 py-4 font-medium"></th>
                  </tr>
                </thead>

                <tbody>
                  {isLoadingVariables ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-gray-400">
                        Loading variables...
                      </td>
                    </tr>
                  ) : variables.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-gray-400">
                        No environment variables yet.
                      </td>
                    </tr>
                  ) : (
                    variables.map((variable) => (
                      <tr key={variable.id} className="border-b border-gray-800/80">
                        <td className="px-6 py-4 font-mono
  text-white">{variable.key}</td>
                        <td className="px-6 py-4 font-mono
  text-gray-500">••••••••</td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(variable.updatedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(variable.id)}
                            className="cursor-pointer text-sm text-red-400
  hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <form
              onSubmit={handleSave}
              className="mt-8 flex flex-wrap items-end gap-4 rounded-xl border
  border-gray-800 bg-[#1b1b1b] p-6"
            >
              <label className="block">
                <span className="text-sm font-medium text-gray-200">Key</span>
                <input
                  required
                  value={form.key}
                  onChange={handleKeyChange}
                  placeholder="DATABASE_URL"
                  className="mt-2 w-56 rounded-md border border-gray-700 bg-[#141414]
  px-3 py-2.5 font-mono text-white outline-none focus:border-[#8338c9]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-200">Value</span>
                <input
                  required
                  type="password"
                  value={form.value}
                  onChange={handleValueChange}
                  placeholder="••••••••"
                  className="mt-2 w-72 rounded-md border border-gray-700 bg-[#141414]
  px-3 py-2.5 font-mono text-white outline-none focus:border-[#8338c9]"
                />
              </label>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-[#8338c9] px-5 py-2.5 text-sm font-semibold
  text-white transition hover:bg-[#6e2aa8] disabled:cursor-not-allowed
  disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save variable"}
              </button>
            </form>
          </>
        )}
      </section>
    );
  }

  export default EnvironmentVariables;