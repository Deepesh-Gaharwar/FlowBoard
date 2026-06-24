import api from "../api/axios";

export const createSprint = async (data) => {
  const response = await api.post("/sprints/create", data);

  return response.data;
};

export const getProjectSprints = async (projectId) => {
  const response = await api.get(`/sprints/project/${projectId}`);

  return response.data;
};

export const getSprintById = async (sprintId) => {
  const response = await api.get(`/sprints/${sprintId}`);

  return response.data;
};

export const startSprint = async (sprintId) => {
  const response = await api.patch(`/sprints/${sprintId}/start`);

  return response.data;
};

export const completeSprint = async (sprintId) => {
  const response = await api.patch(`/sprints/${sprintId}/complete`);

  return response.data;
};

export const deleteSprint = async (sprintId) => {
  const response = await api.delete(`/sprints/${sprintId}`);

  return response.data;
};
