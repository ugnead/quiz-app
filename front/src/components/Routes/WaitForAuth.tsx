import React from "react";
import { useLoading } from "../../contexts/LoadingContext";

interface WaitForAuthProps {
  children: React.ReactNode;
}

const WaitForAuth: React.FC<WaitForAuthProps> = ({ children }) => {
  const { isLoading } = useLoading();

  if (isLoading) {
    return null
  }

  return <>{children}</>;
};

export default WaitForAuth;