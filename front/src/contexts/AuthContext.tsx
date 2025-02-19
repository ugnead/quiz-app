import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  ReactNode,
} from "react";

import { User } from "../types/user";

import { verifyToken, loginUser, logoutUser } from "../services/auth";
import { useLoading } from "./LoadingContext";
import { toast } from "react-toastify";

interface AuthContextProps {
  user: User | null;
  login: (response: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { setLoading } = useLoading();
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  useEffect(() => {
    setLoading(true);
    const handleLogoutEvent = async () => {
      logout();
      toast.error("Your session has expired. Please log in again.");
    };

    window.addEventListener("logout", handleLogoutEvent);

    return () => {
      window.removeEventListener("logout", handleLogoutEvent);
      setLoading(false);
    };
  }, [logout, setLoading]);

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
        toast.error("Login failed");
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  )

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
