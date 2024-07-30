import type { RouteConfig, RouteProps } from "@medusajs/admin";
import type React from "react";

import Button from "../../components/shared/button";
import AnamnesisIcon from "../../components/shared/icons/anamnesis";
import Table from "../../components/shared/table/table";
import { useLogic } from "../../context/anamnesis/use-logic";

const AnamnesisPage: React.FC<RouteProps> = (props) => {
  const { goToNewAnamnesisPage, columns, handleViewForm, handleDeleteForm, handleEditForm } = useLogic(props);

  return (
    <div className="w-full mx-2 transition-all max-w-3/4 md:mx-auto md:w-3/4">
      <div className="flex flex-row items-center justify-between gap-y-large">
        <div className="flex flex-col gap-y-2xsmall">
          <h2 className="inter-xlarge-semibold">Anamnesis</h2>
          <p className="inter-base-regular text-grey-50">Manage your clinic's anamnesis here</p>
        </div>
        <div>
          <Button type="primary" onClick={goToNewAnamnesisPage}>
            Create new
          </Button>
        </div>
      </div>

      <div className="w-full px-4 py-4 mt-4 mb-5 overflow-x-hidden bg-white border rounded-md">
        <Table
          endpoint="/anamnesis"
          columns={columns}
          onDelete={handleDeleteForm}
          onEdit={handleEditForm}
          onView={handleViewForm}
        />
      </div>
    </div>
  );
};
export const config: RouteConfig = {
  link: {
    label: "Anamnesis",
    icon: () => <AnamnesisIcon size={18} />,
  },
};
export default AnamnesisPage;
