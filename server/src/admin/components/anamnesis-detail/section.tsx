import type { UniqueIdentifier } from "@dnd-kit/core";
import type React from "react";

import { useAnamnesisContext } from "../../context/anamnesis-detail/anamnesis-context";
import type { AnamnesisQuestionType } from "../../types/shared/anamnesis";
import TrashIcon from "../shared/icons/trash";
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
  const { id, children, handleAddQuestion } = props;

  const { sections, handleChangeSectionTitle, handleChangeSectionDescription, handleDeleteSection } =
    useAnamnesisContext();

  const section = sections.find((section) => section.id === id);

  if (!section) return null;

  return (
    <div className="relative w-full px-6 py-6 bg-white border rounded-md min-h-4">
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex flex-col w-full mb-4 gap-y-2xsmall">
          <input
            className="bg-transparent outline-none inter-large-semibold"
            placeholder="Section title goes here"
            maxLength={64}
            value={section.title}
            onChange={handleChangeSectionTitle(id)}
          />
          <textarea
            className="break-words bg-transparent outline-none inter-base-regular text-grey-50 text-wrap"
            placeholder="Section description goes here"
            maxLength={300}
            value={section.description}
            onChange={handleChangeSectionDescription(id)}
          />
        </div>

        <button
          type="button"
          className="flex-shrink pl-1 bg-gray-100 rounded-full size-6 hover:bg-gray-200 active:bg-gray-300"
          onClick={handleDeleteSection(id)}
        >
          <TrashIcon size={16} color="#DDDDDD" />
        </button>
      </div>

      <div className="space-y-4">{children}</div>
      <div className="mt-5">
        <Toolbar onAddQuestion={handleAddQuestion} />
      </div>
    </div>
  );
};
