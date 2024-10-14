import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  ReactNode,
} from "react";
import { verifyToken, loginUser, logoutUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
  user: UserProfile | null;
  login: (response: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface UserProfile {
  name: string;
  email: string;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const user = await verifyToken();
          setUser(user);
        } catch (error) {
          console.error("Failed to verify token or token expired:", error);
          setUser(null);
        }
      }
    };
    initializeUser();
  }, []);

  const login = useCallback(
    async (response: string) => {
      try {
        const user = await loginUser(response);
        setUser(user);
        navigate("/categories");
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    [navigate]
  );

  const logout = async () => {
    try {
      if (user) {
        logoutUser();
        setUser(null);
        navigate("/");
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
