import api from "../api/axios";

export const createOrganization = async (organizationData) => {
  const response = await api.post("/organizations/create", organizationData);

  return response.data;
};

export const getMyOrganizations = async () => {
  const response = await api.get("/organizations/my-organizations");

  return response.data;
};

export const getOrganizationById = async (organizationId) => {
  const response = await api.get(`/organizations/${organizationId}`);

  return response.data;
};

export const addMember = async (organizationId, userId) => {
  const response = await api.patch(
    `/organizations/${organizationId}/add-member`,
    { userId },
  );

  return response.data;
};

export const getOrganizationMembers = async (organizationId) => {
  const response = await api.get(`/organizations/${organizationId}/members`);

  return response.data;
};
