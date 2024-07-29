import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import type React from "react";
import { useMountStatus } from "../context/use-mount-status";
import { Item } from "./item";

interface EmptyStateProps {
  containerId: UniqueIdentifier;
  id: UniqueIdentifier;
  index: number;
}

export const EmptyState: React.FC<EmptyStateProps> = (props) => {
  const { id, index } = props;
  const { listeners, isDragging, isSorting, transform, transition } = useSortable({
    id,
  });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <Item
      disabled
      value={id}
      dragging={isDragging}
      sorting={isSorting}
      index={index}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      type="empty-state"
    />
  );
};
