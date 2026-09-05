import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  ExternalLink,
  LogOut,
  Plus,
  ShieldOff,
  Trash2,
  User as UserIcon,
} from "lucide-react";

import GithubMark from "../components/GithubMark.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Section({ title, description, children }) {
  return (
    <section className="rounded-lg border border-gray-800 bg-[#1b1b1b] p-5">
      <h2 className="text-lg font-semibold text-amber-50">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Settings() {
  const navigate = useNavigate();

  const [installations, setInstallations] = useState([]);
  const [oauthRevokeUrl, setOauthRevokeUrl] = useState("");
  const [installUrl, setInstallUrl] = useState("");
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingId, setPendingId] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [installationResponse, sessionResponse] = await Promise.all([
          fetch(`${API_URL}/api/account/github/installations`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/api/account/sessions`, { credentials: "include" }),
        ]);

        if (
          installationResponse.status === 401 ||
          sessionResponse.status === 401
        ) {
          navigate("/login", { replace: true });
          return;
        }

        const installationData = await installationResponse.json();
        const sessionData = await sessionResponse.json();

        if (!installationResponse.ok) {
          throw new Error(
            installationData.message || "Could not load GitHub installations.",
          );
        }

        if (!sessionResponse.ok) {
          throw new Error(sessionData.message || "Could not load sessions.");
        }

        setInstallations(installationData.installations);
        setOauthRevokeUrl(installationData.oauthRevokeUrl || "");
        setInstallUrl(installationData.installUrl || "");
        setSessions(sessionData.sessions);
        setError("");
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [navigate, reloadToken]);

  async function disconnectInstallation(installation) {
    const confirmed = window.confirm(
      `Disconnect ${installation.accountLogin} from KindlyDeploy? ${installation.projectCount} project(s) will lose repository access until you reconnect.`,
    );

    if (!confirmed) {
      return;
    }

    setPendingId(installation.id);

    try {
      const response = await fetch(
        `${API_URL}/api/account/github/installations/${installation.id}`,
        { method: "DELETE", credentials: "include" },
      );

      if (!response.ok && response.status !== 204) {
        const data = await response.json();
        throw new Error(data.message || "Could not disconnect this account.");
      }

      setInstallations((previous) =>
        previous.filter((item) => item.id !== installation.id),
      );
      setNotice(
        `${installation.accountLogin} was disconnected. Uninstall the app on GitHub too if you want to revoke it completely.`,
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPendingId("");
    }
  }

  async function revokeOtherSessions() {
    setPendingId("sessions");

    try {
      const response = await fetch(
        `${API_URL}/api/account/sessions/revoke-others`,
        { method: "POST", credentials: "include" },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not revoke sessions.");
      }

      setNotice(`Signed out of ${data.revokedCount} other session(s).`);
      setReloadToken((previous) => previous + 1);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPendingId("");
    }
  }

  async function signOut() {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    navigate("/login", { replace: true });
  }

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-amber-50">Settings</h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage the GitHub access KindlyDeploy holds and the sessions signed in to
          your account.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {notice ? (
        <p className="rounded-md border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
          {notice}
        </p>
      ) : null}

      <Section
        title="GitHub App installations"
        description="These grant KindlyDeploy permission to read your repositories and download code at build time.">
        {isLoading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : installations.length === 0 ? (
          <p className="text-sm text-gray-400">
            No GitHub account is connected right now.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {installations.map((installation) => (
              <li
                key={installation.id}
                className="rounded-md border border-gray-800 bg-[#141414] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {installation.accountType === "Organization" ? (
                      <Building2 size={18} className="text-gray-500" />
                    ) : (
                      <UserIcon size={18} className="text-gray-500" />
                    )}

                    <div>
                      <p className="font-semibold text-amber-50">
                        {installation.accountLogin}
                      </p>
                      <p className="text-xs text-gray-400">
                        {installation.accountType} ·{" "}
                        {installation.repositoryCount === null
                          ? "repository count unavailable"
                          : `${installation.repositoryCount} repositories`}{" "}
                        · {installation.projectCount} project(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={installation.manageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-md border border-gray-700 px-3 py-1.5 text-xs text-amber-50 transition hover:bg-[#403f3f]">
                      <ExternalLink size={14} />
                      Manage on GitHub
                    </a>

                    <button
                      type="button"
                      disabled={pendingId === installation.id}
                      onClick={() => disconnectInstallation(installation)}
                      className="flex items-center gap-2 rounded-md border border-red-900 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-950/40 disabled:opacity-50">
                      <Trash2 size={14} />
                      {pendingId === installation.id
                        ? "Disconnecting…"
                        : "Disconnect"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {installUrl ? (
          <a
            href={installUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#48008c] px-4 py-2 text-sm font-semibold text-amber-50">
            <Plus size={16} />
            Install on another account
          </a>
        ) : null}
      </Section>

      <Section
        title="Revoke GitHub access"
        description="Disconnecting above only removes the link on our side. Use these to revoke access on GitHub itself.">
        <div className="flex flex-col gap-3">
          <a
            href="https://github.com/settings/installations"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-md border border-gray-800 bg-[#141414] px-4 py-3 transition hover:bg-[#403f3f]">
            <span className="flex items-center gap-3 text-sm text-amber-50">
              <GithubMark className="h-4 w-4 text-gray-500" />
              Uninstall the KindlyDeploy GitHub App
            </span>
            <ExternalLink size={14} className="text-gray-500" />
          </a>

          {oauthRevokeUrl ? (
            <a
              href={oauthRevokeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-md border border-gray-800 bg-[#141414] px-4 py-3 transition hover:bg-[#403f3f]">
              <span className="flex items-center gap-3 text-sm text-amber-50">
                <ShieldOff size={16} className="text-gray-500" />
                Revoke the OAuth login authorization
              </span>
              <ExternalLink size={14} className="text-gray-500" />
            </a>
          ) : null}

          <a
            href="https://github.com/settings/apps/authorizations"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-md border border-gray-800 bg-[#141414] px-4 py-3 transition hover:bg-[#403f3f]">
            <span className="flex items-center gap-3 text-sm text-amber-50">
              <ShieldOff size={16} className="text-gray-500" />
              Review all authorized GitHub Apps
            </span>
            <ExternalLink size={14} className="text-gray-500" />
          </a>
        </div>
      </Section>

      <Section
        title="Active sessions"
        description="Each browser you sign in from holds a session cookie until it expires.">
        {isLoading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between rounded-md border border-gray-800 bg-[#141414] px-4 py-3 text-sm">
                <span className="text-amber-50">
                  Started {new Date(session.createdAt).toLocaleString()}
                  {session.isCurrent ? (
                    <span className="ml-2 rounded-full bg-[#48008c] px-2 py-0.5 text-[11px] font-semibold">
                      This device
                    </span>
                  ) : null}
                </span>
                <span className="text-xs text-gray-400">
                  Expires {new Date(session.expiresAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={pendingId === "sessions"}
            onClick={revokeOtherSessions}
            className="flex items-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm text-amber-50 transition hover:bg-[#403f3f] disabled:opacity-50">
            <ShieldOff size={16} />
            Sign out of other devices
          </button>

          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 rounded-md border border-red-900 px-4 py-2 text-sm text-red-300 transition hover:bg-red-950/40">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </Section>
    </div>
  );
}

export default Settings;
