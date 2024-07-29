import type { DraggableSyntheticListeners, UniqueIdentifier } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import React, { useEffect } from "react";
import DotIcon from "../../../../components/shared/icons/dot";
import GhostIcon from "../../../../components/shared/icons/ghost";
import PlusIcon from "../../../../components/shared/icons/plus";
import TrashIcon from "../../../../components/shared/icons/trash";
import VerticalGripIcon from "../../../../components/shared/icons/vertical-grip";
import XIcon from "../../../../components/shared/icons/x";
import { ShowIf } from "../../../../components/shared/show-if";
import { AnamnesisQuestionType } from "../../../../types/anamnesis";
import { useAnamnesisContext } from "../context/anamnesis-context";

export type RenderItem = (args?: {
  dragOverlay: boolean;
  dragging: boolean;
  sorting: boolean;
  index: number | undefined;
  fadeIn: boolean;
  listeners: DraggableSyntheticListeners;
  ref: React.Ref<HTMLElement>;
  style: React.CSSProperties | undefined;
  transform: ItemProps["transform"];
  transition: ItemProps["transition"];
  value: ItemProps["value"];
}) => React.ReactElement;

export interface ItemProps {
  containerId?: UniqueIdentifier;
  dragOverlay?: boolean;
  disabled?: boolean;
  dragging?: boolean;
  handle?: boolean;
  height?: number;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  value: React.ReactNode;
  onRemove?(): void;
  renderItem?: RenderItem;
  type?: "question" | "empty-state";
}

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, ItemProps>(
    (
      {
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        height,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
        type,
        containerId,
        ...props
      },
      ref,
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = "grabbing";

        return () => {
          document.body.style.cursor = "";
        };
      }, [dragOverlay]);

      const {
        sections,
        handleAddMultipleChoiceOption,
        handleAddSelectOption,
        handleChangeMultipleChoiceOption,
        handleChangeQuestionText,
        handleChangeSelectOptionText,
        handleDeleteMultipleChoiceOption,
        handleDeleteQuestion,
        handleDeleteSelectOption,
      } = useAnamnesisContext();
      const section = sections.find((section) => section.id === containerId);
      const questions = section?.questions || [];
      const question = questions.find((question) => question?.id === value);

      const wrapperClasses = `
        flex box-border transform
        ${fadeIn ? "animate-fadeIn" : ""}
        ${sorting ? "transition-transform" : ""}
        ${dragOverlay ? "z-[999]" : ""}
      `;

      return renderItem ? (
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          index,
          fadeIn: Boolean(fadeIn),
          listeners,
          ref,
          style,
          transform,
          transition,
          value,
        })
      ) : (
        <li
          className={wrapperClasses}
          style={
            {
              ...wrapperStyle,
              transition: [transition, wrapperStyle?.transition].filter(Boolean).join(", "),
              "--translate-x": transform ? `${Math.round(transform.x)}px` : undefined,
              "--translate-y": transform ? `${Math.round(transform.y)}px` : undefined,
              "--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
              "--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
              "--index": index,
              transform: `
              translate3d(var(--translate-x, 0), var(--translate-y, 0), 0)
              scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))
            `,
              transformOrigin: "0 0",
            } as React.CSSProperties
          }
          ref={ref}
        >
          <div className="flex flex-row w-full border rounded-md">
            <ShowIf condition={type === "question" && !!question}>
              <div
                className="flex flex-col items-center justify-center w-6 text-center bg-gray-100 cursor-grab active:cursor-grabbing"
                style={{
                  ...style,
                  transform: "scale(var(--scale, 1))",
                  boxShadow: dragOverlay ? "var(--box-shadow-picked-up)" : undefined,
                }}
                data-cypress="draggable-item"
                {...(!handle ? listeners : {})}
                {...props}
                tabIndex={!handle ? 0 : undefined}
              >
                <VerticalGripIcon size={16} color="#DDDDDD" />
              </div>

              <div className="flex flex-col items-start py-5 px-5 space-y-1 w-full min-h-[150px]">
                <div className="flex flex-row items-center w-full mb-5 ">
                  <input
                    type="text"
                    className="flex-grow w-full break-words bg-transparent outline-none inter-large-regular text-grey-50 text-wrap"
                    placeholder="Question goes here"
                    maxLength={300}
                    value={question?.question_text}
                    onChange={handleChangeQuestionText(containerId, question?.id)}
                  />
                  <button
                    type="button"
                    className="flex-shrink pl-1 bg-gray-100 rounded-full size-6 hover:bg-gray-200 active:bg-gray-300"
                    onClick={handleDeleteQuestion(containerId, question?.id)}
                  >
                    <TrashIcon size={16} color="#DDDDDD" />
                  </button>
                </div>

                {/* SHORT ANSWER */}
                <ShowIf condition={question?.question_type === AnamnesisQuestionType.SHORT_ANSWER}>
                  <input
                    type="text"
                    className="w-full p-5 bg-transparent border rounded-md inter-large-regular border-emerald-700 outline-1 outline-emerald-700"
                    placeholder="Patient's short answer goes here"
                    maxLength={128}
                  />
                </ShowIf>

                {/* LONG ANSWER */}
                <ShowIf condition={question?.question_type === AnamnesisQuestionType.LONG_ANSWER}>
                  <textarea
                    className="w-full p-5 break-words bg-transparent border rounded-md inter-large-regular text-grey-500 text-wrap border-emerald-700 outline-1 outline-emerald-700"
                    placeholder="Patient's long answer goes here"
                    maxLength={600}
                  />
                </ShowIf>

                {/* DATE */}
                <ShowIf condition={question?.question_type === AnamnesisQuestionType.DATE}>
                  <input
                    type="date"
                    className="w-full p-5 bg-transparent border rounded-md inter-large-regular text-grey-500 border-emerald-700 outline-1 outline-emerald-700"
                  />
                </ShowIf>

                {/* DATE TIME */}
                <ShowIf condition={question?.question_type === AnamnesisQuestionType.DATE_TIME}>
                  <input
                    type="datetime-local"
                    className="w-full p-5 bg-transparent border rounded-md inter-large-regular text-grey-500 border-emerald-700 outline-1 outline-emerald-700"
                  />
                </ShowIf>

                {/* TIME */}
                <ShowIf condition={question?.question_type === AnamnesisQuestionType.TIME}>
                  <input
                    type="time"
                    className="w-full p-5 bg-transparent border rounded-md inter-large-regular text-grey-500 border-emerald-700 outline-1 outline-emerald-700"
                  />
                </ShowIf>

                {/* MULTIPLE CHOICE */}
                <ShowIf condition={question?.question_type === AnamnesisQuestionType.MULTIPLE_CHOICE}>
                  <div className="flex flex-col w-full text-gray-700 gap-y-2">
                    {question?.options?.map((option, index) => {
                      return (
                        <div
                          key={`${containerId}-${question?.id}-${index}`}
                          className="flex flex-row items-center space-x-2"
                        >
                          <div className="font-semibold text-center border rounded-md size-6 border-emerald-700 hover:border-emerald-90 text-emerald-700">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <input
                            key={`${containerId}-${question?.id}-${index}-text`}
                            type="text"
                            placeholder="Choice goes here"
                            className="flex-grow px-2 py-2 bg-transparent outline-none inter-large-regular"
                            value={option.label}
                            onChange={handleChangeMultipleChoiceOption(containerId, question?.id, index)}
                          />
                          <button
                            key={`${containerId}-${question?.id}-${index}-button`}
                            type="button"
                            className="flex-shrink pl-1 bg-gray-100 rounded-full size-6 hover:bg-gray-200 active:bg-gray-300"
                            onClick={handleDeleteMultipleChoiceOption(containerId, question?.id, index)}
                          >
                            <XIcon size={16} color="#DDDDDD" />
                          </button>
                        </div>
                      );
                    })}

                    <button
                      className="flex flex-row items-center space-x-2 text-gray-500 inter-base-regular hover:text-gray-600 active:text-gray-700"
                      type="button"
                      onClick={handleAddMultipleChoiceOption(containerId, question?.id)}
                    >
                      <div>
                        <PlusIcon size={16} />
                      </div>
                      <div>Add new choice</div>
                    </button>
                  </div>
                </ShowIf>

                {/* SELECT */}
                <ShowIf condition={question?.question_type === AnamnesisQuestionType.SELECT}>
                  <div className="flex flex-col w-full text-gray-700 gap-y-2">
                    {question?.options?.map((option, index) => {
                      return (
                        <div
                          key={`${containerId}-${question?.id}-${index}`}
                          className="flex flex-row items-center space-x-2 text-gray-700 inter-large-regular"
                        >
                          <div className="flex-shrink">
                            <DotIcon size={18} />
                          </div>
                          <input
                            type="text"
                            placeholder="Selection option goes here"
                            className="flex-grow px-2 py-2 bg-transparent outline-none"
                            value={option.label}
                            onChange={handleChangeSelectOptionText(containerId, question?.id, index)}
                          />
                          <button
                            type="button"
                            className="flex-shrink pl-1 bg-gray-100 rounded-full size-6 hover:bg-gray-200 active:bg-gray-300"
                            onClick={handleDeleteSelectOption(containerId, question?.id, index)}
                          >
                            <XIcon size={16} color="#DDDDDD" />
                          </button>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      className="flex flex-row items-center space-x-2 text-gray-500 inter-base-regular hover:text-gray-600 active:text-gray-700"
                      onClick={handleAddSelectOption(containerId, question?.id)}
                    >
                      <div>
                        <PlusIcon size={16} />
                      </div>
                      <div>Add new option</div>
                    </button>
                  </div>
                </ShowIf>
              </div>
            </ShowIf>
            <ShowIf condition={type === "empty-state"}>
              <div className="flex flex-col items-center mb-4 space-y-2   w-full min-h-[150px] justify-center">
                <GhostIcon size={28} />
                <p className="w-full text-center inter-large-regular text-grey-50">No question yet</p>
              </div>
            </ShowIf>
          </div>
        </li>
      );
    },
  ),
);
