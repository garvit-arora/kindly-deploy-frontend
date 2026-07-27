import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import Blueprints from "./pages/Blueprints.jsx";
import Deployments from "./pages/Deployments.jsx";
import NewProject from "./pages/NewProject.jsx";

function App() {
  return (
    <div className="outfit">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* <Route path="/" element={<Navigate to="/projects" replace />} /> */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="projects" replace />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/new" element={<NewProject />} />
            <Route path="blueprints" element={<Blueprints />} />
            <Route path="deployments" element={<Deployments />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
