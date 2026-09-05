import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, LogOut, Mail, Settings as SettingsIcon } from "lucide-react";
import GithubMark from "../components/GithubMark.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Stat({ label, value }) {
  return (
    <div className="rounded-md border border-gray-800 bg-[#141414] px-4 py-3">
      <p className="text-2xl font-semibold text-amber-50">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{label}</p>
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const [meResponse, projectResponse, installationResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/auth/me`, { credentials: "include" }),
            fetch(`${API_URL}/api/projects`, { credentials: "include" }),
            fetch(`${API_URL}/api/account/github/installations`, {
              credentials: "include",
            }),
          ]);

        if (meResponse.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        const meData = await meResponse.json();

        if (!meResponse.ok) {
          throw new Error(meData.message || "Could not load your profile.");
        }

        setUser(meData.user);

        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          setProjects(projectData.projects);
        }

        if (installationResponse.ok) {
          const installationData = await installationResponse.json();
          setInstallations(installationData.installations);
        }

        setError("");
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);

  async function signOut() {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    navigate("/login", { replace: true });
  }

  if (isLoading) {
    return <p className="text-sm text-gray-400">Loading your profile…</p>;
  }

  const readyProjects = projects.filter(
    (project) => project.deployments?.[0]?.status === "READY",
  ).length;

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-amber-50">Profile</h1>

      {error ? (
        <p className="rounded-md border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <section className="rounded-lg border border-gray-800 bg-[#1b1b1b] p-6">
        <div className="flex flex-wrap items-center gap-5">
          <img
            src={user?.avatarUrl || "/default-avatar.png"}
            alt={user?.name || "Profile"}
            className="h-20 w-20 rounded-full object-cover"
          />

          <div className="min-w-0">
            <p className="text-xl font-semibold text-amber-50">
              {user?.name || "GitHub User"}
            </p>

            <p className="mt-1 flex items-center gap-2 text-sm text-gray-400">
              <Mail size={14} />
              {user?.email || "No email shared by GitHub"}
            </p>
          </div>

          <div className="ml-auto flex flex-wrap gap-2">
            <Link
              to="/dashboard/settings"
              className="flex items-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm text-amber-50 transition hover:bg-[#403f3f]">
              <SettingsIcon size={16} />
              Settings
            </Link>

            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-2 rounded-md border border-red-900 px-4 py-2 text-sm text-red-300 transition hover:bg-red-950/40">
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Projects" value={projects.length} />
          <Stat label="Live projects" value={readyProjects} />
          <Stat label="GitHub accounts" value={installations.length} />
        </div>
      </section>

      <section className="rounded-lg border border-gray-800 bg-[#1b1b1b] p-5">
        <h2 className="text-lg font-semibold text-amber-50">Connected GitHub</h2>
        <p className="mt-1 text-sm text-gray-400">
          Accounts whose repositories KindlyDeploy can build from.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {installations.length === 0 ? (
            <p className="text-sm text-gray-400">Nothing connected yet.</p>
          ) : (
            installations.map((installation) => (
              <a
                key={installation.id}
                href={installation.manageUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-md border border-gray-800 bg-[#141414] px-4 py-3 transition hover:bg-[#403f3f]">
                <span className="flex items-center gap-3 text-sm text-amber-50">
                  <GithubMark className="h-4 w-4 text-gray-500" />
                  {installation.accountLogin}
                  <span className="text-xs text-gray-400">
                    {installation.accountType}
                  </span>
                </span>
                <ExternalLink size={14} className="text-gray-500" />
              </a>
            ))
          )}
        </div>

        <Link
          to="/dashboard/settings"
          className="mt-4 inline-block text-sm text-[#a855f7] underline">
          Manage or revoke access
        </Link>
      </section>
    </div>
  );
}

export default Profile;
