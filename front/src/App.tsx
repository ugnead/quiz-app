import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./App.css";
import QuestionCard from "./components/Features/QuestionCard";

interface GoogleLoginResponse {
  access_token: string;
}

interface UserProfile {
  name: string;
  picture: string;
  email: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<GoogleLoginResponse | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const login = useGoogleLogin({
    onSuccess: (access_token) => setUser(access_token),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => setProfile(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const logout = () => {
    googleLogout();
    setUser(null);
    setProfile(null);
  };

  return (
    <div>
      <h2>Google Login</h2>
      <br />
      {profile ? (
        <div>
          <img
            src={profile.picture}
            alt={`Profile picture of ${profile.name}`}
          />
          <h3>Hi {profile.name}</h3>
          <p>Email: {profile.email}</p>
          <button onClick={logout}>Log out</button>
          <QuestionCard onAnswer={console.log}/>
        </div>
      ) : (
        <button onClick={() => login()}>Sign In with Google</button>
      )}
    </div>
  );
};

export default App;
