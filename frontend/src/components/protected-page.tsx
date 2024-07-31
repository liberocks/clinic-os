import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUserContext } from "../context/auth";

interface ProtectedPageProps {
  children: React.ReactNode;
}

export const ProtectedPage: React.FC<ProtectedPageProps> = (props) => {
  const { children } = props;

  const {
    userState: { isInitialized, isAuthenticated },
  } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate("/sign-in");
    }
  }, [isInitialized, isAuthenticated]);

  return <>{children}</>;
};
