import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadProjects(params) {
      try {
        const response = await fetch(`${VITE_API_URL}/api/projects`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Couldn't load Projects");
        }
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        setError(error.message);
      }
    }
    loadProjects();
  }, []);
  return (
    <>
      <div className="flex flex-col gap-6">
        <h1 className="text-5xl">Overview</h1>

        <h1 className="text-3xl">Projects</h1>
        <div className="flex flex-row">
          {projects.length === 0 ? (
            <Link
              to="/dashboard/projects/new"
              className="flex h-20 w-2xs items-center justify-center rounded-none border-2 border-dashed border-gray-600 transition hover:text-[#8338c9]">
              <span className="text-xl font-semibold">+ Create a Project</span>
            </Link>
          ) : (
            <div className="flex flex-row gap-4">
              {projects.map((project) => (
                <p
                  className="rounded-lg border-2 border-amber-50 p-4"
                  key={project.id}>
                  {project.name}
                </p>
              ))}
            </div>
          )}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>
    </>
  );
}

export default Projects;
