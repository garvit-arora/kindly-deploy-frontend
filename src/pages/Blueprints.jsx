 import { useCallback, useEffect, useState } from 'react'
  import { useNavigate } from 'react-router-dom'
  import PipelineGraph from '../components/PipelineGraph'

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

  function Blueprints() {
    const navigate = useNavigate()

    const [deployments, setDeployments] = useState([])
    const [selectedDeploymentId, setSelectedDeploymentId] = useState('')
    const [selectedDeployment, setSelectedDeployment] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingDeployment, setIsLoadingDeployment] = useState(false)
    const [error, setError] = useState('')

    const loadDeployment = useCallback(
      async (deploymentId) => {
        if (!deploymentId) {
          setSelectedDeployment(null)
          return
        }

        setIsLoadingDeployment(true)

        try {
          const response = await fetch(
            `${API_URL}/api/deployments/${deploymentId}`,
            { credentials: 'include' },
          )

          if (response.status === 401) {
            navigate('/login', { replace: true })
            return
          }

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || 'Could not load deployment.')
          }

          setSelectedDeployment(data.deployment)
          setError('')
        } catch (requestError) {
          setError(requestError.message)
        } finally {
          setIsLoadingDeployment(false)
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

          if (data.deployments.length > 0) {
            setSelectedDeploymentId(data.deployments[0].id)
            await loadDeployment(data.deployments[0].id)
          }
        } catch (requestError) {
          setError(requestError.message)
        } finally {
          setIsLoading(false)
        }
      }

      loadDeployments()
    }, [loadDeployment, navigate])

    useEffect(() => {
      if (
        !['PENDING', 'QUEUED', 'BUILDING'].includes(selectedDeployment?.status)
      ) {
        return undefined
      }

      const intervalId = window.setInterval(() => {
        loadDeployment(selectedDeploymentId)
      }, 3000)

      return () => window.clearInterval(intervalId)
    }, [selectedDeployment?.status, selectedDeploymentId, loadDeployment])

    function handleDeploymentChange(event) {
      const deploymentId = event.target.value
      setSelectedDeploymentId(deploymentId)
      setError('')
      loadDeployment(deploymentId)
    }

    if (isLoading) {
      return <p className="text-gray-400">Loading deployments...</p>
    }

    return (
      <section>
        <div>
          <h1 className="text-4xl font-semibold text-white">Blueprints</h1>
          <p className="mt-2 text-gray-400">
            Visual pipeline for any deployment, built from its real activity
            history.
          </p>
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
                {deployment.project.name} — {deployment.status} —{' '}
                {new Date(deployment.createdAt).toLocaleString()}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="mt-5 text-red-400">{error}</p>}

        {selectedDeployment && (
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold text-white">
                {selectedDeployment.project.name}
              </h2>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  statusClasses[selectedDeployment.status] ||
                  statusClasses.PENDING
                }`}
              >
                {formatStatus(selectedDeployment.status)}
              </span>

              {isLoadingDeployment && (
                <span className="text-xs text-gray-500">Refreshing...</span>
              )}
            </div>

            <div className="mt-5">
              <PipelineGraph deployment={selectedDeployment} />
            </div>
          </div>
        )}

        {!selectedDeployment && !isLoadingDeployment && deployments.length === 0 && (
          <p className="mt-6 text-sm text-gray-500">
            No deployments yet. Create a project to see its pipeline here.
          </p>
        )}
      </section>
    )
  }

  export default Blueprints