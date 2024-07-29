import type { UniqueIdentifier } from "@dnd-kit/core";
import type React from "react";

import type { AnamnesisQuestionType } from "../../../../types/anamnesis";
import Toolbar from "./toolbar";

export type SectionProps = {
  children: React.ReactNode;
  disabled?: boolean;
  id: UniqueIdentifier;
  items: UniqueIdentifier[];
  style?: React.CSSProperties;
  handleAddQuestion: (type: AnamnesisQuestionType) => void;
};

export const Section: React.FC<SectionProps> = (props) => {
  const { id, items, children, handleAddQuestion } = props;

  return (
    <div className="relative w-full px-6 py-6 bg-white border rounded-md min-h-4">
      <div className="flex flex-col w-full mb-4 gap-y-2xsmall">
        <input
          className="bg-transparent outline-none inter-large-semibold"
          placeholder="Section title goes here"
          maxLength={64}
        />
        <textarea
          className="break-words bg-transparent outline-none inter-base-regular text-grey-50 text-wrap"
          placeholder="Section description goes here"
          maxLength={300}
        />
      </div>

      <div className="space-y-4">{children}</div>
      <div className="mt-5">
        <Toolbar onAddQuestion={handleAddQuestion} />
      </div>
    </div>
  );
};
