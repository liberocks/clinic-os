import type React from "react";
import type { ButtonHTMLAttributes } from "react";

import PlusIcon from "../../../../components/shared/icons/plus";

interface NewSectionProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const NewSection: React.FC<NewSectionProps> = (props) => {
  return (
    <button
      className="flex flex-row items-center p-2 px-3 space-x-2 bg-gray-200 rounded-full hover:bg-gray-300 active:bg-gray-400"
      {...props}
    >
      <PlusIcon size={18} />
      <span className="text-center inter-base-regular text-grey-70 ">Add new section</span>
    </button>
  );
};

export default NewSection;
