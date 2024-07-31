import type {
  CollisionDetection,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
  useSensors,
} from "@dnd-kit/core";

import type { Items } from "../../types/anamnesis-detail/type";
import type { AnamnesisSectionData } from "../../types/shared/anamnesis";

export interface DndContextValue {
  activeId: UniqueIdentifier | null;
  collisionDetectionStrategy: CollisionDetection;
  containers: UniqueIdentifier[];
  getIndex: (id: UniqueIdentifier) => number;
  isSortingContainer: boolean;
  items: Items;
  onDragCancel: () => void;
  onDragEnd: (callback?: (...vars) => void) => (event: DragEndEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragStart: (event: DragStartEvent) => void;
  renderContainerDragOverlay: (containerId: UniqueIdentifier) => JSX.Element;
  renderSortableItemDragOverlay: (id: UniqueIdentifier, sections: AnamnesisSectionData[]) => React.ReactNode;
  sensors: ReturnType<typeof useSensors>;
  setContainers: React.Dispatch<React.SetStateAction<UniqueIdentifier[]>>;
  setItems: React.Dispatch<React.SetStateAction<Items>>;
}

export interface DndWrapperProps {
  children: React.ReactNode;
}
