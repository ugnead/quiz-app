import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../Common/Button";

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
        };
      };
    };
  }
}

interface CredentialResponse {
  credential: string;
}

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Auth: React.FC = () => {
  const { user, login, logout } = useAuth();

  useEffect(() => {
    if (!user && window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: CredentialResponse) => {
          await login(response.credential);
        },
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
  }, [user, login]);

  return (
    <div>
      {user ? (
        <div>
          <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>
      ) : (
        <div id="buttonDiv" key={user ? "logged-in" : "logged-out"}></div>
      )}
    </div>
  );
};

export default Auth;

