import type { FC } from "react";

import Button from "../shared/button";
import XIcon from "../shared/icons/x";

interface ShareModalProps {
  handleSubmit: () => void;
  handleClose: () => void;
  patientEmail: string;
  handleChangePatientEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export const ShareModal: FC<ShareModalProps> = ({
  handleSubmit,
  handleClose,
  patientEmail,
  handleChangePatientEmail,
  isLoading,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
      <div className="items-end w-full max-w-md p-5 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Enter patient's email</h2>
          <button type="button" onClick={handleClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <XIcon size={16} />
          </button>
        </div>
        <input
          type="text"
          value={patientEmail}
          onChange={handleChangePatientEmail}
          placeholder="Type patient's email here"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
        />
        <Button onClick={handleSubmit} loading={isLoading}>
          Share
        </Button>
      </div>
    </div>
  );
};
