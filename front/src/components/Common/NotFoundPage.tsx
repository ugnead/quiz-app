import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center mx-10">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Button onClick={() => navigate(-1)} className="px-6 py-3">
        Go Back
      </Button>
    </div>
  );
};

export default NotFoundPage;
