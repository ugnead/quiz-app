import api from "./api";

export const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data.data.users;
};

export const updateUserRole = async (userId: string, role: string) => {
  const response = await api.patch(`/users/${userId}/role`, { role });
  return response.data.data.user;
};
