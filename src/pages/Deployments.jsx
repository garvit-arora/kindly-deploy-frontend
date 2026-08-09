import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

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

function Deployments() {
  const navigate = useNavigate()

  const [deployments, setDeployments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDeployments() {
      try {
        const response = await fetch(`${API_URL}/api/deployments`, {
          credentials: 'include',
        })

        if (response.status === 401) {
          navigate('/login', { replace: true })
          return
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not load deployments.')
        }

        setDeployments(data.deployments)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadDeployments()
  }, [navigate])

  if (isLoading) {
    return <p className="text-gray-400">Loading deployments...</p>
  }

  return (
    <section>
      <h1 className="text-4xl font-semibold text-white">Deployments</h1>
      <p className="mt-2 text-gray-400">
        Every deployment across your projects.
      </p>

      {error && <p className="mt-6 text-red-400">{error}</p>}

      {deployments.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-700 p-8 text-center text-gray-400">
          No deployments yet. Create a project to create your first deployment.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-gray-800 bg-[#1b1b1b]">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="border-b border-gray-800 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Repository</th>
                <th className="px-6 py-4 font-medium">Branch</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
              </tr>
            </thead>

            <tbody>
              {deployments.map((deployment) => (
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

                  <td className="px-6 py-4 text-gray-400">
                    {deployment.project.githubRepositoryFullName || '—'}
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
    </section>
  )
}

export default Deployments