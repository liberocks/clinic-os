import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import type React from "react";

import { useMountStatus } from "../context/use-mount-status";
import { Item } from "./item";

interface QuestionProps {
  containerId: UniqueIdentifier;
  id: UniqueIdentifier;
  index: number;
}

export const Question: React.FC<QuestionProps> = (props) => {
  const { id, index, containerId } = props;
  const { setNodeRef, listeners, isDragging, isSorting, transform, transition } = useSortable({ id });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <Item
      containerId={containerId}
      ref={setNodeRef}
      value={id}
      dragging={isDragging}
      sorting={isSorting}
      index={index}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      type="question"
    />
  );
};
