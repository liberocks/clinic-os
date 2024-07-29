import { DndContext, DragOverlay, MeasuringStrategy } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { RouteProps } from "@medusajs/admin";
import { createPortal } from "react-dom";

import Button from "../../../components/shared/button";
import ShareIcon from "../../../components/shared/icons/share";
import { ShowIf } from "../../../components/shared/show-if";
import cx from "../../../utils/cx";
import { EmptyState } from "./components/empty-state";
import NewSection from "./components/new-section";
import { Question } from "./components/question";
import { Section } from "./components/section";
import { AnamnesisProvider, useAnamnesisContext } from "./context/anamnesis-context";
import { DndProvider, useDndContext } from "./context/dnd-context";
import { dropAnimation } from "./utils/drop-animation";

const AnamnesisPage: React.FC<RouteProps> = (props) => {
  const { notify } = props;
  const {
    id,
    isLoading,
    handleAddQuestion,
    handleAddNewSection,
    activeTab,
    setActiveTab,
    title,
    description,
    handleChangeTitle,
    handleChangeDescription,
    handleCreateForm,
    handleMoveQuestion,
    isValid,
  } = useAnamnesisContext();
  const {
    activeId,
    items,
    sensors,
    renderContainerDragOverlay,
    renderSortableItemDragOverlay,
    collisionDetectionStrategy,
    onDragStart,
    onDragOver,
    onDragCancel,
    onDragEnd,
    containers,
  } = useDndContext();

  return (
    <div className="flex flex-col items-center justify-between w-full mx-auto transition-all large:w-3/4">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-col w-full gap-y-2xsmall">
          <input
            className="bg-transparent outline-none inter-xlarge-semibold"
            placeholder="Type anamnesis title here"
            maxLength={64}
            value={title}
            onChange={handleChangeTitle}
          />
          <input
            className="break-words bg-transparent outline-none resize-none inter-base-regular text-grey-50 text-wrap"
            placeholder="Type anamnesis description here"
            maxLength={300}
            value={description}
            onChange={handleChangeDescription}
          />
        </div>
        <div className="flex flex-row flex-shrink space-x-4">
          <ShowIf condition={id !== "new"}>
            <Button type="secondary">
              <span className="flex flex-row space-x-2">
                <ShareIcon size={18} />
                <span>Share</span>
              </span>
            </Button>
          </ShowIf>

          <ShowIf condition={id !== "new"}>
            <Button className="!min-w-36">Save changes</Button>
          </ShowIf>

          <ShowIf condition={id === "new"}>
            <Button onClick={handleCreateForm(notify)} loading={isLoading} disabled={!isValid}>
              Create
            </Button>
          </ShowIf>
        </div>
      </div>

      <div className="flex flex-row w-full mt-5 border-b border-b-gray-300">
        <button
          type="button"
          className={cx(
            "text-base text-grey-700 h-10 min-w-28",
            activeTab === "editor" ? "border-b-2 border-b-gray-700 font-semibold text-gray-800" : "text-gray-500",
          )}
          onClick={() => setActiveTab("editor")}
        >
          Editor
        </button>
        <ShowIf condition={id !== "new"}>
          <button
            type="button"
            className={cx(
              "text-base text-grey-700 h-10 min-w-28",
              activeTab === "submissions"
                ? "border-b-2 border-b-gray-700 font-semibold text-gray-800"
                : "text-gray-500",
            )}
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </button>
        </ShowIf>
      </div>

      <div className={cx("w-full mt-4", activeTab === "editor" ? "block" : "hidden")}>
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd(handleMoveQuestion)}
          onDragCancel={onDragCancel}
        >
          <div className="w-full space-y-8">
            {containers.map((containerId) => (
              <Section
                key={containerId}
                id={containerId}
                items={items[containerId]}
                handleAddQuestion={handleAddQuestion(containerId)}
              >
                <SortableContext items={items[containerId]} strategy={verticalListSortingStrategy}>
                  {items[containerId].map((value, index) => {
                    return <Question key={value} id={value} index={index} containerId={containerId} />;
                  })}
                  {items[containerId].length === 0 && <EmptyState key={0} id={0} index={0} containerId={containerId} />}
                </SortableContext>
              </Section>
            ))}
          </div>
          {createPortal(
            <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
              {activeId
                ? containers.includes(activeId)
                  ? renderContainerDragOverlay(activeId)
                  : renderSortableItemDragOverlay(activeId)
                : null}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
        <div className="flex flex-col items-center w-full mt-5 mb-5 bg-transparent">
          <NewSection onClick={handleAddNewSection} />
        </div>
      </div>

      <div className={cx("w-full mt-4", activeTab === "submissions" ? "block" : "hidden")}>
        Submissions table goes here
      </div>
    </div>
  );
};

const WrappedAnamnesisPage: React.FC<RouteProps> = (props) => {
  return (
    <DndProvider>
      <AnamnesisProvider>
        <AnamnesisPage {...props} />
      </AnamnesisProvider>
    </DndProvider>
  );
};

export default WrappedAnamnesisPage;
