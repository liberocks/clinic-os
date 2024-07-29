import type { RouteProps } from "@medusajs/admin";
import { useNavigate } from "react-router-dom";

export const useLogic = (props: RouteProps) => {
  const navigate = useNavigate();

  const goToNewAnamnesisPage = () => {
    navigate("/a/anamnesis/new");
  };

  return { goToNewAnamnesisPage };
};
