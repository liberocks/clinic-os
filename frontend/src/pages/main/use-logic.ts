import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { defaultUserState, useUserContext } from "../../context/auth";
import type { AnamnesisForm } from "../../types/anamnesis";
import { medusaClient } from "../../utils/medusa";

export const useLogic = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const navigate = useNavigate();

  const {
    userState: { firstName, lastName },
    setUserState,
  } = useUserContext();

  const handleLogout = () => {
    medusaClient.auth
      .deleteSession()
      .then(() => {
        setUserState(defaultUserState);
        navigate("/sign-in");
      })
      .catch((error) => console.error(error));
  };

  const forms: AnamnesisForm[] = [
    {
      id: "1",
      title: "Lorem ipsum dolor sit amet",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec nisl nec nisl.",
      status: "new",
      created_at: "1 hour ago",
    },
    {
      id: "2",
      title: "Lorem ipsum dolor sit amet",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec nisl nec nisl.",
      status: "done",
      created_at: "1 hour ago",
    },
  ];

  return { activeFilter, setActiveFilter, handleLogout, forms, firstName, lastName };
};
