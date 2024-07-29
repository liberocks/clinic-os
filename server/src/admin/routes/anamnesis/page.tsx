import type { RouteConfig, RouteProps } from "@medusajs/admin";
import type React from "react";
import Button from "../../components/shared/button";
import AnamnesisIcon from "../../components/shared/icons/anamnesis";
import { useLogic } from "./logic";

const AnamnesisPage: React.FC<RouteProps> = (props) => {
  const { goToNewAnamnesisPage } = useLogic(props);

  return (
    <>
      <div className="">
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
      </div>
    </>
  );
};
export const config: RouteConfig = {
  link: {
    label: "Anamnesis",
    icon: () => <AnamnesisIcon size={18} />,
  },
};
export default AnamnesisPage;
