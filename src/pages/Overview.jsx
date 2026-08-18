import { useEffect, useState } from 'react'
  import { Link, useNavigate } from 'react-router-dom'
  import { Boxes, Rocket, CheckCircle2, XCircle } from 'lucide-react'

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  const STATUS_META = {
    READY: { label: 'Ready', dot: 'bg-emerald-400', text: 'text-emerald-300' },
    BUILDING: { label: 'Building', dot: 'bg-violet-400', text: 'text-violet-300' },
    QUEUED: { label: 'Queued', dot: 'bg-blue-400', text: 'text-blue-300' },
    PENDING: { label: 'Pending', dot: 'bg-amber-400', text: 'text-amber-300' },
    FAILED: { label: 'Failed', dot: 'bg-red-400', text: 'text-red-300' },
    CANCELLED: { label: 'Cancelled', dot: 'bg-gray-400', text: 'text-gray-300' },
  }

  const STATUS_ORDER = ['READY', 'BUILDING', 'QUEUED', 'PENDING', 'FAILED', 'CANCELLED']

  const statusClasses = {
    PENDING: 'bg-amber-500/15 text-amber-300',
    QUEUED: 'bg-blue-500/15 text-blue-300',
    BUILDING: 'bg-violet-500/15 text-violet-300',
    READY: 'bg-emerald-500/15 text-emerald-300',
    FAILED: 'bg-red-500/15 text-red-300',
    CANCELLED: 'bg-gray-500/15 text-gray-300',
  }

  function formatStatus(status) {
    return status.toLowerCase().replaceAll('_', ' ')
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  }

  function StatTile({ icon: Icon, label, value, accent }) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-[#1b1b1b] p-5">
        <div className="flex items-center gap-2 text-gray-400">
          <Icon size={16} className={accent} />
          <span className="text-sm">{label}</span>
        </div>

        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      </div>
    )
  }

  function Overview() {
    const navigate = useNavigate()

    const [overview, setOverview] = useState(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      async function loadOverview() {
        try {
          const response = await fetch(`${API_URL}/api/overview`, {
            credentials: 'include',
          })

          if (response.status === 401) {
            navigate('/login', { replace: true })
            return
          }

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || 'Could not load overview.')
          }

          setOverview(data)
          setError('')
        } catch (requestError) {
          setError(requestError.message)
        } finally {
          setIsLoading(false)
        }
      }

      loadOverview()

      const intervalId = window.setInterval(loadOverview, 10000)

      return () => window.clearInterval(intervalId)
    }, [navigate])

    if (isLoading) {
      return <p className="text-gray-400">Loading overview...</p>
    }

    if (error) {
      return <p className="text-red-400">{error}</p>
    }

    const readyCount = overview.statusBreakdown.READY || 0
    const failedCount = overview.statusBreakdown.FAILED || 0

    return (
      <section>
        <h1 className="text-4xl font-semibold text-white">Overview</h1>
        <p className="mt-2 text-gray-400">
          A real-time summary across every project you own.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            icon={Boxes}
            label="Total projects"
            value={overview.totalProjects}
            accent="text-[#b875f4]"
          />

          <StatTile
            icon={Rocket}
            label="Total deployments"
            value={overview.totalDeployments}
            accent="text-[#b875f4]"
          />

          <StatTile
            icon={CheckCircle2}
            label="Live deployments"
            value={readyCount}
            accent="text-emerald-400"
          />

          <StatTile
            icon={XCircle}
            label="Failed deployments"
            value={failedCount}
            accent="text-red-400"
          />
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-white">Status breakdown</h2>

          <div className="mt-4 flex flex-wrap gap-3">
            {STATUS_ORDER.map((status) => {
              const meta = STATUS_META[status]
              const count = overview.statusBreakdown[status] || 0

              return (
                <div
                  key={status}
                  className="flex items-center gap-2 rounded-full border border-gray-800 bg-[#1b1b1b] px-4 py-2"
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                  <span className={`text-sm font-medium ${meta.text}`}>
                    {meta.label}
                  </span>
                  <span className="text-sm text-gray-500">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Recent deployments
            </h2>

            <Link
              to="/dashboard/deployments"
              className="text-sm text-[#b875f4] hover:text-white"
            >
              View all →
            </Link>
          </div>

          {overview.recentDeployments.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-gray-700 p-8 text-center text-gray-400">
              No deployments yet.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-gray-800 bg-[#1b1b1b]">
              <table className="w-full min-w-180 text-left text-sm">
                <thead className="border-b border-gray-800 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Project</th>
                    <th className="px-6 py-4 font-medium">Branch</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {overview.recentDeployments.map((deployment) => (
                    <tr
                      key={deployment.id}
                      className="border-b border-gray-800/80 transition hover:bg-[#222]"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        <Link
                          to={`/dashboard/deployments/${deployment.id}`}
                          className="hover:text-[#b875f4]"
                        >
                          {deployment.project.name}
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {deployment.branch}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusClasses[deployment.status] ||
                            statusClasses.PENDING
                          }`}
                        >
                          {formatStatus(deployment.status)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                        {formatDate(deployment.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    )
  }

  export default Overview