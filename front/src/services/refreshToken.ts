import api from "./api";

export async function refreshAccessToken(): Promise<void> {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available.");

    const response = await api.post("/auth/refresh_token", { refreshToken });
    const { accessToken } = response.data;

    localStorage.setItem("jwtToken", accessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}
