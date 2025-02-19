import api from "./api";
import { User } from "../types/user";

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export async function verifyToken(): Promise<User | null> {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    return null;
  }
  try {
    const response = await api.get<AuthResponse>("/auth/verify_token");
    if (response.data.user) {
      return response.data.user;
    } else {
      console.error("Token is invalid");
      throw new Error("Token is invalid");
    }
  } catch (error) {
    console.log("Token verification failed:", error);
    throw error;
  }
}

export async function loginUser(idToken: string): Promise<User> {
  try {
    const response = await api.post<AuthResponse>("/auth/google", {
      token: idToken,
    });
    const { user, token, refreshToken } = response.data;

    localStorage.setItem("jwtToken", token);
    localStorage.setItem("refreshToken", refreshToken);

    return user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export function logoutUser(): void {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("refreshToken");
}
