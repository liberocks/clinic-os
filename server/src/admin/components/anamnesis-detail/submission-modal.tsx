import type { FC } from "react";
import XIcon from "../shared/icons/x";

interface SubmissionModalProps {
  handleClose: () => void;
  payload: {};
}

export const SubmissionModal: FC<SubmissionModalProps> = ({ handleClose, payload }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
      <div className="items-end p-5 bg-white rounded-lg shadow-xl w-fit">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Patient's response</h2>
          <button type="button" onClick={handleClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <XIcon size={16} />
          </button>
        </div>
        <div>
          <pre> {JSON.stringify(payload, null, 4)}</pre>
        </div>
      </div>
    </div>
  );
};
