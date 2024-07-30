import {
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  closestCenter,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { Item } from "../../components/anamnesis-detail/item";
import { type Items, PLACEHOLDER_ID } from "../../types/anamnesis-detail/type";

interface DndContextValue {
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
  renderSortableItemDragOverlay: (id: UniqueIdentifier) => JSX.Element;
  sensors: ReturnType<typeof useSensors>;
  setContainers: React.Dispatch<React.SetStateAction<UniqueIdentifier[]>>;
  setItems: React.Dispatch<React.SetStateAction<Items>>;
}

interface DndWrapperProps {
  children: React.ReactNode;
}

const DndContext = createContext<DndContextValue>(null as unknown as DndContextValue);

export function DndProvider({ children }: DndWrapperProps) {
  const [items, setItems] = useState<Items>({});
  const [containers, setContainers] = useState(Object.keys(items) as UniqueIdentifier[]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer = activeId ? containers.includes(activeId) : false;

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) => container.id in items),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        if (overId in items) {
          const containerItems = items[overId];

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) => container.id !== overId && containerItems.includes(container.id),
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items],
  );
  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  };

  const getIndex = (id: UniqueIdentifier) => {
    const container = findContainer(id);

    if (!container) {
      return -1;
    }

    const index = items[container].indexOf(id);

    return index;
  };

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  const getNextContainerId = () => {
    const containerIds = Object.keys(items);
    const lastContainerId = containerIds[containerIds.length - 1];

    return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
  };

  const renderSortableItemDragOverlay = (id: UniqueIdentifier) => {
    return <Item value={id} handle={false} dragOverlay />;
  };

  const renderContainerDragOverlay = (containerId: UniqueIdentifier) => {
    return (
      <div>
        {items[containerId].map((item, index) => (
          <Item key={item} value={item} handle={false} />
        ))}
      </div>
    );
  };

  const onDragStart = (event: DragStartEvent): void => {
    const { active } = event;
    setActiveId(active.id);
    setClonedItems(items);
  };

  const onDragOver = (event: DragOverEvent): void => {
    const { active, over } = event;

    const overId = over?.id;

    if (overId == null || active.id in items) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeItems = items[activeContainer];
        const overItems = items[overContainer];
        const overIndex = overItems.indexOf(overId);
        const activeIndex = activeItems.indexOf(active.id);

        let newIndex: number;

        if (overId in items) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top > over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        recentlyMovedToNewContainer.current = true;

        return {
          ...items,
          [activeContainer]: items[activeContainer].filter((item) => item !== active.id),
          [overContainer]: [
            ...items[overContainer].slice(0, newIndex),
            items[activeContainer][activeIndex],
            ...items[overContainer].slice(newIndex, items[overContainer].length),
          ],
        };
      });
    }
  };

  const onDragEnd =
    (callback: Function) =>
    (event: DragEndEvent): void => {
      const { active, over } = event;

      if (active.id in items && over?.id) {
        setContainers((containers) => {
          const activeIndex = containers.indexOf(active.id);
          const overIndex = containers.indexOf(over.id);

          const activeContainerId = containers[activeIndex];
          const overContainerId = containers[overIndex];

          return arrayMove(containers, activeIndex, overIndex);
        });
      }

      const activeContainer = findContainer(active.id);

      if (!activeContainer) {
        setActiveId(null);
        return;
      }

      const overId = over?.id;

      if (overId == null) {
        setActiveId(null);
        return;
      }

      callback(activeContainer, active.id);

      if (overId === PLACEHOLDER_ID) {
        const newContainerId = getNextContainerId();

        unstable_batchedUpdates(() => {
          setContainers((containers) => [...containers, newContainerId]);
          setItems((items) => ({
            ...items,
            [activeContainer]: items[activeContainer].filter((id) => id !== activeId),
            [newContainerId]: [active.id],
          }));
          setActiveId(null);
        });

        return;
      }

      const overContainer = findContainer(overId);

      if (overContainer) {
        const activeIndex = items[activeContainer].indexOf(active.id);
        const overIndex = items[overContainer].indexOf(overId);

        if (activeIndex !== overIndex) {
          setItems((items) => ({
            ...items,
            [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
          }));
        }
      }

      setActiveId(null);
    };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  const contextValue = useMemo(() => {
    return {
      activeId,
      collisionDetectionStrategy,
      containers,
      getIndex,
      isSortingContainer,
      items,
      onDragCancel,
      onDragEnd,
      onDragOver,
      onDragStart,
      renderContainerDragOverlay,
      renderSortableItemDragOverlay,
      sensors,
      setContainers,
      setItems,
    };
  }, [
    activeId,
    collisionDetectionStrategy,
    containers,
    getIndex,
    isSortingContainer,
    items,
    onDragCancel,
    onDragEnd,
    onDragOver,
    onDragStart,
    renderContainerDragOverlay,
    renderSortableItemDragOverlay,
    sensors,
    setContainers,
    setItems,
  ]);

  return <DndContext.Provider value={contextValue}>{children}</DndContext.Provider>;
}

export function useDndContext() {
  return useContext<DndContextValue>(DndContext);
}
