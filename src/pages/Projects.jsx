import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function Projects() {
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch(`${API_URL}/api/projects`, {
          credentials: 'include',
        })

        if (response.status === 401) {
          navigate('/login', { replace: true })
          return
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not load projects.')
        }

        setProjects(data.projects)
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [navigate])

  if (isLoading) {
    return <p className="text-gray-400">Loading projects...</p>
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-white">Projects</h1>
          <p className="mt-2 text-gray-400">
            Your connected repositories and deployment history.
          </p>
        </div>

        <Link
          to="/dashboard/projects/new"
          className="cursor-pointer rounded-md bg-[#8338c9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6e2aa8]"
        >
          + Create a Project
        </Link>
      </div>

      {error && <p className="mt-6 text-red-400">{error}</p>}

      {projects.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-700 p-8 text-center">
          <p className="text-gray-400">No projects yet.</p>

          <Link
            to="/dashboard/projects/new"
            className="mt-4 inline-flex cursor-pointer text-sm font-semibold text-[#b875f4] hover:text-white"
          >
            Create your first project →
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap gap-4">
          {projects.map((project) => {
            const latestDeployment = project.deployments[0]

            return (
              <Link
                key={project.id}
                to={`/dashboard/projects/${project.id}/deployments`}
                className="flex h-28 w-2xs flex-col items-center justify-center rounded-lg border-2 border-gray-700 bg-[#1b1b1b] p-4 text-center transition hover:border-[#8338c9] hover:text-[#b875f4]"
              >
                <span className="font-semibold text-white">{project.name}</span>

                {latestDeployment ? (
                  <span className="mt-2 text-xs text-gray-400">
                    Latest: {latestDeployment.status}
                  </span>
                ) : (
                  <span className="mt-2 text-xs text-gray-400">
                    No deployments yet
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Projects