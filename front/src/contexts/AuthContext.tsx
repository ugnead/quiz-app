import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  ReactNode,
} from "react";
import { verifyToken, loginUser, logoutUser } from "../services/auth";
import { useLoading } from "./LoadingContext";
import { toast } from "react-toastify";

interface AuthContextProps {
  user: UserProfile | null;
  login: (response: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { setLoading } = useLoading();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const user = await verifyToken();
        setUser(user);
      } catch (error) {
        setUser(null);
        toast.error("Your session expired. Please log in again.");
      } finally {
        setLoading(false);
      }
    };
    initializeUser();
  }, [setLoading]);

  const login = useCallback(
    async (response: string) => {
      setLoading(true);
      try {
        const user = await loginUser(response);
        setUser(user);
      } catch (error) {
        setUser(null);
        console.error("Login failed:", error);
        toast.error("Login failed");
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const logout = async () => {
    try {
      if (user) {
        logoutUser();
        setUser(null);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
