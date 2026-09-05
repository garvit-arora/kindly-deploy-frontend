import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import Blueprints from "./pages/Blueprints.jsx";
import Deployments from "./pages/Deployments.jsx";
import NewProject from "./pages/NewProject.jsx";
import Preview from "./pages/Preview.jsx";
import LogStream from "./pages/LogStream.jsx";
import ProjectDeployments from "./pages/ProjectDeployments.jsx";
import Overview from "./pages/Overview.jsx";
import EnvironmentVariables from "./pages/EnvironmentVariables.jsx";
import Domains from "./pages/Domains.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";
function App() {
  return (
    <div className="outfit">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* <Route path="/" element={<Navigate to="/projects" replace />} /> */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="overview" replace />} />
             <Route path="overview" element={<Overview />} />
            <Route path="logs" element={<LogStream />} />
            <Route path="projects" element={<Projects />} />
            <Route
              path="projects/:projectId/deployments"
              element={<ProjectDeployments />}
            />
            <Route path="projects/new" element={<NewProject />} />
            <Route path="blueprints" element={<Blueprints />} />
            <Route path="environment-variables" element={<EnvironmentVariables />} />
            <Route path="deployments" element={<Deployments />} />
            <Route path="domains" element={<Domains />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />

            <Route path="deployments/:deploymentId" element={<Preview />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
