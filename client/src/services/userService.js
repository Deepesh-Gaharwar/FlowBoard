import api from "../api/axios";

export const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/users/${userId}/role`, {
    role,
  });

  return response.data;
};
