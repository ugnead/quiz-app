import api from "./api";

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  user: UserProfile;
  token: string;
  refreshToken: string;
}

export async function verifyToken(): Promise<UserProfile | null> {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    return null;
  }
  try {
    const response = await api.get<AuthResponse>("/auth/verify_token");
    if (response.data.user) {
      return response.data.user;
    } else {
      throw new Error("Token is invalid");
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function loginUser(idToken: string): Promise<UserProfile> {
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
