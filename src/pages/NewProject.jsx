import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function NewProject() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    repositoryUrl: '',
    branch: 'main',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }

      if (!response.ok) {
        throw new Error(data.message || 'Could not create project.')
      }

      navigate('/dashboard/projects')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="max-w-2xl">
      <Link
        to="/dashboard/projects"
        className="text-sm text-gray-400 transition hover:text-[#8338c9]"
      >
        &larr; Back to Projects
      </Link>

      <h1 className="mt-6 text-4xl font-semibold">Create a new project</h1>
      <p className="mt-2 text-gray-400">
        Add a repository now. GitHub repository selection comes next.
      </p>

      <form
        className="mt-8 space-y-5 rounded-xl border border-gray-800 bg-[#1b1b1b] p-6"
        onSubmit={handleSubmit}
      >
        <label className="block">
          <span className="text-sm font-medium">Project name</span>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="My first deployment"
            className="mt-2 w-full rounded-md border border-gray-700 bg-[#141414] px-3 py-2.5 text-white outline-none focus:border-[#8338c9]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Repository URL</span>
          <input
            name="repositoryUrl"
            value={form.repositoryUrl}
            onChange={handleChange}
            placeholder="https://github.com/your-account/your-repository"
            className="mt-2 w-full rounded-md border border-gray-700 bg-[#141414] px-3 py-2.5 text-white outline-none focus:border-[#8338c9]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Branch</span>
          <input
            name="branch"
            value={form.branch}
            onChange={handleChange}
            placeholder="main"
            className="mt-2 w-full rounded-md border border-gray-700 bg-[#141414] px-3 py-2.5 text-white outline-none focus:border-[#8338c9]"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-[#8338c9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6e2aa8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating project...' : 'Create Project'}
        </button>
      </form>
    </section>
  )
}

export default NewProject