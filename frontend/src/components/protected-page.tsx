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
    userState: { isAuthenticated },
  } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in");
    }
  }, []);

  return <>{children}</>;
};
