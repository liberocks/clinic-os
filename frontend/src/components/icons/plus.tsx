import type React from "react";
import type IconProps from "../../../types/shared/icon-type";

const PlusIcon: React.FC<IconProps> = ({ size = "24", color = "currentColor", ...attributes }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-plus"
      {...attributes}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
};
export default PlusIcon;
