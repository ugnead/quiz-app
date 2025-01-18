import api from "./api";
import { User, UpdateUserDto } from "../types/user";

export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data.data.users as User[];
};

export const updateUserRole = async (
  userId: string,
  userData: UpdateUserDto
): Promise<User> => {
  const response = await api.patch(`/users/${userId}/role`, userData);
  return response.data.data.user;
};
