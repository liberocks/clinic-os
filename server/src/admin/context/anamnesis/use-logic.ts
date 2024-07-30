import type { RouteProps } from "@medusajs/admin";
import { useMedusa } from "medusa-react";
import { useNavigate } from "react-router-dom";

export const useLogic = (props: RouteProps) => {
  const { notify } = props;
  const navigate = useNavigate();
  const { client } = useMedusa();

  const goToNewAnamnesisPage = () => {
    navigate("/a/anamnesis/new");
  };

  const handleViewForm = (id: string) => {
    navigate(`/a/anamnesis/${id}`);
  };

  const handleEditForm = (id: string) => {
    navigate(`/a/anamnesis/${id}`);
  };

  const handleDeleteForm = async (id: string): Promise<void> => {
    try {
      await client.admin.custom.delete(`/anamnesis/${id}`);

      notify.success("Success", "Anamnesis form deleted successfully...");
    } catch (error) {
      notify.error("Error", "Failed to delete an anamnesis form");
    }
  };

  const columns = [
    {
      Header: "Anamnesis Form",
      columns: [
        {
          Header: "id",
          accessor: "id",
        },
        {
          Header: "Title",
          accessor: "title",
        },
        {
          Header: "Description",
          accessor: "description",
        },
        {
          Header: "Created at",
          accessor: "created_at",
        },
        {
          Header: "Action",
          accessor: "actions",
        },
      ],
    },
  ];

  return { goToNewAnamnesisPage, columns, handleViewForm, handleDeleteForm, handleEditForm };
};
