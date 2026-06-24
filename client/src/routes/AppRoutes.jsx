import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Organizations from "../pages/Organizations";
import OrganizationDetails from "../pages/OrganizationDetails";
import Teams from "../pages/Teams";
import TeamDetails from "../pages/TeamDetails";
import SprintDetails from "../pages/SprintDetails";
import ProjectDetails from "../pages/ProjectDetails";
import Projects from "../pages/Projects";


import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />

        <Route path="/organizations" element={<Organizations />} />

        <Route
          path="/organizations/:organizationId"
          element={<OrganizationDetails />}
        />

        <Route path="/teams" element={<Teams />} />

        <Route path="/teams/:teamId" element={<TeamDetails />} />

        <Route path="/projects" element={<Projects />} />

        <Route path="/projects/:projectId" element={<ProjectDetails />} />

        <Route path="/projects/:projectId" element={<ProjectDetails />} />

        <Route path="/sprints/:sprintId" element={<SprintDetails />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
