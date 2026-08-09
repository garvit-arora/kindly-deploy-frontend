import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function LogStream() {
  const navigate = useNavigate()
  const logsContainerRef = useRef(null)

  const [deployments, setDeployments] = useState([])
  const [selectedDeploymentId, setSelectedDeploymentId] = useState('')
  const [logs, setLogs] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)
  const [hasRunningContainer, setHasRunningContainer] = useState(false)
  const [error, setError] = useState('')

  const loadLogs = useCallback(
    async (deploymentId) => {
      if (!deploymentId) {
        setLogs('')
        setHasRunningContainer(false)
        return
      }

      setIsLoadingLogs(true)

      try {
        const response = await fetch(
          `${API_URL}/api/deployments/${deploymentId}/logs`,
          {
            credentials: 'include',
          },
        )

        if (response.status === 401) {
          navigate('/login', { replace: true })
          return
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not load logs.')
        }

        setLogs(data.logs || 'No container output yet.')
        setHasRunningContainer(true)
        setError('')
      } catch (requestError) {
        if (
          requestError.message ===
          'This deployment does not have a running container yet.'
        ) {
          setLogs('')
          setHasRunningContainer(false)
          setError('')
          return
        }

        setError(requestError.message)
        setHasRunningContainer(false)
      } finally {
        setIsLoadingLogs(false)
      }
    },
    [navigate],
  )

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

        const firstDeploymentWithContainer = data.deployments.find(
          (deployment) => deployment.containerName,
        )

        if (firstDeploymentWithContainer) {
          setSelectedDeploymentId(firstDeploymentWithContainer.id)
          await loadLogs(firstDeploymentWithContainer.id)
        }
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadDeployments()
  }, [loadLogs, navigate])

  useEffect(() => {
    const element = logsContainerRef.current

    if (element) {
      element.scrollTop = element.scrollHeight
    }
  }, [logs])

  function handleDeploymentChange(event) {
    const deploymentId = event.target.value

    setSelectedDeploymentId(deploymentId)
    setLogs('')
    setError('')
    setHasRunningContainer(false)

    loadLogs(deploymentId)
  }

  if (isLoading) {
    return <p className="text-gray-400">Loading deployments...</p>
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-white">Log Stream</h1>
          <p className="mt-2 text-gray-400">
            Latest Docker container output for a deployment.
          </p>
        </div>

        {selectedDeploymentId && (
          <Link
            to={`/dashboard/deployments/${selectedDeploymentId}`}
            className="cursor-pointer text-sm text-[#b875f4] hover:text-white"
          >
            Open deployment →
          </Link>
        )}
      </div>

      <label className="mt-8 block max-w-xl">
        <span className="text-sm font-medium text-gray-200">Deployment</span>

        <select
          value={selectedDeploymentId}
          onChange={handleDeploymentChange}
          className="mt-2 w-full cursor-pointer rounded-md border border-gray-700 bg-[#141414] px-3 py-2.5 text-white outline-none focus:border-[#8338c9]"
        >
          <option value="">Choose a deployment</option>

          {deployments.map((deployment) => (
            <option key={deployment.id} value={deployment.id}>
              {deployment.project.name} — {deployment.status}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="mt-5 text-red-400">{error}</p>}

      {selectedDeploymentId && hasRunningContainer && (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-800 bg-[#111]">
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
            <span className="text-sm font-medium text-gray-300">
              Docker stdout / stderr
            </span>

            <button
              type="button"
              onClick={() => loadLogs(selectedDeploymentId)}
              disabled={isLoadingLogs}
              className="cursor-pointer rounded-md border border-gray-700 px-3 py-1.5 text-sm text-gray-200 transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoadingLogs ? 'Loading...' : 'Refresh logs'}
            </button>
          </div>

          <pre
            ref={logsContainerRef}
            className="min-h-100 max-h-150 overflow-auto p-5 font-mono text-xs leading-6 text-gray-300"
          >
            {logs || 'No container output yet.'}
          </pre>
        </div>
      )}

      {selectedDeploymentId && !hasRunningContainer && !isLoadingLogs && (
        <p className="mt-6 text-sm text-gray-500">
          This deployment has no running container, so runtime logs are not
          available.
        </p>
      )}
    </section>
  )
}

export default LogStream