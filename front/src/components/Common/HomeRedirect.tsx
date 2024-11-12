import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Home from "../Public/Home";

const HomeRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin/categories" replace />;
    } else {
      return <Navigate to="/categories" replace />;
    }
  } else {
    return <Home />;
  }
};

export default HomeRedirect;
