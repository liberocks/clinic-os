import type { UniqueIdentifier } from "@dnd-kit/core";
import { type AnimateLayoutChanges, defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import type React from "react";

import { useAnamnesisContext } from "../../context/anamnesis-detail/anamnesis-context";
import type { AnamnesisQuestionType } from "../../types/shared/anamnesis";
import cx from "../../utils/cx";
import HorizontalGrip from "../shared/icons/horizontal-grip";
import TrashIcon from "../shared/icons/trash";
import Toolbar from "./toolbar";

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export type SectionProps = {
  children: React.ReactNode;
  disabled?: boolean;
  id: UniqueIdentifier;
  items: UniqueIdentifier[];
  style?: React.CSSProperties;
  handleProps?: React.HTMLAttributes<{}>;
  handleAddQuestion: (type: AnamnesisQuestionType) => void;
  onClick?: () => void;
};

export const Section: React.FC<SectionProps> = (props) => {
  const { id, children, handleAddQuestion, onClick, items, handleProps } = props;

  const { sections, handleChangeSectionTitle, handleChangeSectionDescription, handleDeleteSection } =
    useAnamnesisContext();

  const { active, attributes, isDragging, listeners, over, setNodeRef, transition, transform } = useSortable({
    id,
    data: {
      type: "container",
      children: items,
    },
    animateLayoutChanges,
  });
  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== "container") || items.includes(over.id)
    : false;

  const section = sections.find((section) => section.id === id);

  if (!section) return null;

  return (
    <div
      className={cx("relative w-full border rounded-md min-h-4", isDragging ? "bg-gray-50" : "bg-white")}
      onClick={onClick}
      ref={setNodeRef}
    >
      <button
        className={cx(
          "flex flex-row justify-center w-full py-0.5 bg-gray-100",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        {...{ ...handleProps, ...listeners }}
      >
        <HorizontalGrip size={16} />
      </button>
      <div className="flex flex-row items-start justify-between w-full px-6 py-6">
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

      <div className="px-6 py-2 pb-4 space-y-4">{children}</div>
      <div className="my-5">
        <Toolbar onAddQuestion={handleAddQuestion} />
      </div>
    </div>
  );
};
