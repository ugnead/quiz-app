import api from './api';

interface UserProfile {
  name: string;
  email: string;
}

interface AuthResponse {
  user: UserProfile;
  token: string;
}

export async function loginUser(idToken: string): Promise<UserProfile> {
  try {
    const response = await api.post<AuthResponse>('/auth/google', {
      token: idToken,
    });
    const { user, token } = response.data;

    localStorage.setItem('jwtToken', token);

    return user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export async function logoutUser(email: string): Promise<void> {
  if (window.google?.accounts.id.revoke) {
    window.google.accounts.id.revoke(email, async (response) => {
      if (response.error) {
        console.error("Error revoking access:", response.error);
        throw new Error(response.error);
      } else {
        localStorage.removeItem('jwtToken');
      }
    });
  }
}
