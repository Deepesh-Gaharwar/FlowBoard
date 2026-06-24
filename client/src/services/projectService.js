import api from "../api/axios";

export const createProject = async (projectData) => {
  const response = await api.post("/projects/create", projectData);

  return response.data;
};

export const getMyProjects = async () => {
  const response = await api.get("/projects/my/projects");

  return response.data;
};

export const getOrganizationProjects = async (organizationId) => {
  const response = await api.get(`/projects/organization/${organizationId}`);

  return response.data;
};

export const getProjectById = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);

  return response.data;
};

export const updateProject = async (projectId, data) => {
  const response = await api.patch(`/projects/${projectId}`, data);

  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`);

  return response.data;
};
