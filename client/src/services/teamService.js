import api from "../api/axios";

export const createTeam = async (teamData) => {
  const response = await api.post("/teams/create", teamData);

  return response.data;
};

export const getOrganizationTeams = async (organizationId) => {
  const response = await api.get(`/teams/organization/${organizationId}`);

  return response.data;
};

export const getTeamById = async (teamId) => {
  const response = await api.get(`/teams/${teamId}`);

  return response.data;
};

export const assignTeamLead = async (teamId, userId) => {
  const response = await api.patch(`/teams/${teamId}/assign-team-lead`, {
    userId,
  });

  return response.data;
};

export const addMemberToTeam = async (teamId, userId) => {
  const response = await api.patch(`/teams/${teamId}/add-member`, {
    userId,
  });

  return response.data;
};

export const removeMemberFromTeam = async (teamId, userId) => {
  const response = await api.patch(`/teams/${teamId}/remove-member`, {
    userId,
  });

  return response.data;
};
