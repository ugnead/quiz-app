import React, { useEffect, useState, useCallback } from "react";
import { verifyToken, loginUser, logoutUser } from "../../services/auth";
import { useNavigate, useLocation } from "react-router-dom";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
          }) => void;
          renderButton: (
            element: Element | null,
            options: {
              theme: string;
              size: string;
              shape: string;
            }
          ) => void;
          revoke: (
            email: string,
            callback: (response: RevokeResponse) => void
          ) => void;
        };
      };
    };
  }
}

interface CredentialResponse {
  credential: string;
}

interface UserProfile {
  name: string;
  email: string;
}

interface RevokeResponse {
  error?: string;
}

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Auth: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await verifyToken();
        if (user) {
          setUser(user);
          if (location.pathname === "/") {
            navigate("/categories");
          }
        }
      } catch (error) {
        console.error("Failed to verify token or token expired:", error);
        setUser(null);
      }
    };

    initializeUser();
  }, [navigate]);

  const handleLogin = useCallback(
    async (response: CredentialResponse) => {
      try {
        const user = await loginUser(response.credential);
        setUser(user);
        navigate("/categories");
        window.location.reload()
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    [navigate]
  );

  const handlelogout = async () => {
    try {
      if (user) {
        await logoutUser(user.email);
        setUser(null);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleLogin,
      });

      if (!user) {
        window.google.accounts.id.renderButton(
          document.getElementById("buttonDiv"),
          {
            theme: "filled_black",
            size: "medium",
            shape: "square",
          }
        );
      }
    }
  }, [user, handleLogin]);

  return (
    <div>
      {user ? (
        <div>
          <button onClick={handlelogout}>Logout</button>
        </div>
      ) : (
        <div id="buttonDiv" key={user ? "logged-in" : "logged-out"}></div>
      )}
    </div>
  );
};

export default Auth;
