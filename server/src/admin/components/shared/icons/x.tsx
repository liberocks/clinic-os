import type React from "react";

import type IconProps from "../../../types/icon-type";

const XIcon: React.FC<IconProps> = ({ size = "24", color = "currentColor", ...attributes }) => {
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
      className="lucide lucide-x"
      {...attributes}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
};
export default XIcon;
