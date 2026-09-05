import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Copy, ExternalLink, Globe, RefreshCw } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Domains() {
  const navigate = useNavigate();

  const [domains, setDomains] = useState([]);
  const [baseHost, setBaseHost] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    async function loadDomains() {
      try {
        const response = await fetch(`${API_URL}/api/domains`, {
          credentials: "include",
        });

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load domains.");
        }

        setDomains(data.domains);
        setBaseHost(data.baseHost);
        setError("");
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDomains();
  }, [navigate, reloadToken]);

  async function copyHost(domain) {
    await navigator.clipboard.writeText(domain.host);
    setCopiedId(domain.id);
    setTimeout(() => setCopiedId(""), 1500);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-amber-50">Domains</h1>
          <p className="mt-1 text-sm text-gray-400">
            Every live deployment gets its own routed hostname under{" "}
            <span className="text-amber-50">{baseHost || "…"}</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsLoading(true);
            setReloadToken((previous) => previous + 1);
          }}
          className="flex items-center gap-2 rounded-md border border-gray-700 px-3 py-2 text-sm text-amber-50 transition hover:bg-[#403f3f]">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error ? (
        <p className="rounded-md border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading domains…</p>
      ) : domains.length === 0 ? (
        <div className="rounded-lg border border-gray-800 bg-[#1b1b1b] p-10 text-center">
          <Globe size={32} className="mx-auto text-gray-600" />
          <p className="mt-3 text-amber-50">No domains yet</p>
          <p className="mt-1 text-sm text-gray-400">
            A domain appears here as soon as a deployment becomes ready.
          </p>
          <Link
            to="/dashboard/projects/new"
            className="mt-4 inline-block rounded-md bg-[#48008c] px-4 py-2 text-sm font-semibold text-amber-50">
            Create a project
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {domains.map((domain) => (
            <li
              key={domain.id}
              className="rounded-lg border border-gray-800 bg-[#1b1b1b] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-gray-500" />
                    <span className="truncate font-mono text-sm text-amber-50">
                      {domain.host}
                    </span>
                    {domain.isPrimary ? (
                      <span className="rounded-full bg-[#48008c] px-2 py-0.5 text-[11px] font-semibold text-amber-50">
                        Primary
                      </span>
                    ) : (
                      <span className="rounded-full border border-gray-700 px-2 py-0.5 text-[11px] text-gray-400">
                        Superseded
                      </span>
                    )}
                  </div>

                  <p className="mt-1 truncate text-xs text-gray-400">
                    {domain.projectName}
                    {domain.repository ? ` · ${domain.repository}` : ""} ·{" "}
                    {domain.branch} @ {domain.commitSha?.slice(0, 7)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyHost(domain)}
                    className="flex items-center gap-2 rounded-md border border-gray-700 px-3 py-1.5 text-xs text-amber-50 transition hover:bg-[#403f3f]">
                    {copiedId === domain.id ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                    {copiedId === domain.id ? "Copied" : "Copy"}
                  </button>

                  <a
                    href={domain.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-md bg-[#48008c] px-3 py-1.5 text-xs font-semibold text-amber-50">
                    <ExternalLink size={14} />
                    Visit
                  </a>

                  <Link
                    to={`/dashboard/deployments/${domain.id}`}
                    className="rounded-md border border-gray-700 px-3 py-1.5 text-xs text-amber-50 transition hover:bg-[#403f3f]">
                    Details
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-lg border border-gray-800 bg-[#1b1b1b] p-4">
        <h2 className="text-sm font-semibold text-amber-50">Custom domains</h2>
        <p className="mt-1 text-sm text-gray-400">
          Bringing your own domain is not supported yet. Traefik routes requests by
          the <span className="text-amber-50">Host</span> header, so adding a custom
          domain means pointing a CNAME at the deployment host and adding a matching
          router rule.
        </p>
      </div>
    </div>
  );
}

export default Domains;
