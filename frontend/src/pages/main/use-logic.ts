import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { defaultUserState, useUserContext } from "../../context/auth";
import type { AnamnesisForm } from "../../types/anamnesis";
import { medusaClient } from "../../utils/medusa";
import { objectToQueryString } from "../../utils/query-param";

interface Parameters {
  limit?: number;
  page?: number;
  search?: string;
  orderBy?: string;
}

export const useLogic = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [data, setData] = useState<AnamnesisForm[]>([]);
  const [params, setParams] = useState<Parameters>({ limit: 100, page: 1 });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    userState: { firstName, lastName },
    setUserState,
  } = useUserContext();

  const handleLogout = async () => {
    try {
      await medusaClient.auth.deleteSession();

      setUserState({ ...defaultUserState, isInitialized: true });
      navigate("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async (newParams: Parameters) => {
    try {
      setLoading(true);

      const token = Cookies.get("_medusa_jwt");
      const params = {
        limit: newParams.limit,
        page: newParams.page,
        filters: [{ field: "status", value: activeFilter, operator: "eq" }],
      };

      const data = await medusaClient.client.request(
        "GET",
        `/store/assignment?${objectToQueryString(params)}`,
        undefined,
        undefined,
        {
          Authorization: `Bearer ${token}`,
        },
      );

      setData(data.data);
      setParams(newParams);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGetFilteredData = () => {
    return data.filter((form) => {
      if (activeFilter === "all") {
        return true;
      }

      return form.status === activeFilter;
    });
  };

  const handleGiveResponse = (formId: string) => {
    navigate(`/form/${formId}`);
  };

  useEffect(() => {
    fetchData(params);
  }, []);

  return {
    handleGiveResponse,
    activeFilter,
    setActiveFilter,
    handleLogout,
    handleGetFilteredData,
    forms: data,
    firstName,
    lastName,
    loading,
  };
};
