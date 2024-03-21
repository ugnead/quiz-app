import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

interface GoogleLoginResponse {
  access_token: string;
}

interface UserProfile {
  name: string;
  picture: string;
  email: string;
}

const Auth: React.FC = () => {
  const [userToken, setUserToken] = useState<GoogleLoginResponse | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const login = useGoogleLogin({
    onSuccess: (access_token) => setUserToken(access_token),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (userToken) {
      axios
        .post("http://localhost:4000/api/v1/auth/google", {
          token: userToken,
        })
        .then((res) => {
          localStorage.setItem("jwtToken", res.data.token);
          setProfile(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [userToken]);

  const logout = () => {
    googleLogout();
    setProfile(null);
    localStorage.removeItem("jwtToken");
    setUserToken(null);
  };

  return (
    <>
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
        </div>
      ) : (
        <button onClick={() => login()}>Sign In with Google</button>
      )}
    </>
  );
};

export default Auth;
