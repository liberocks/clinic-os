import React, { useEffect } from "react";

import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import type { ItemActionProps } from "./item-action";
import { ItemHandle } from "./item-handle";
import { ItemRemove } from "./item-remove";

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
  dragOverlay?: boolean;
  color?: string;
  disabled?: boolean;
  dragging?: boolean;
  handle?: boolean;
  handleProps?: ItemActionProps;
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
}

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, ItemProps>(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        handleProps,
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

      const wrapperClasses = `
        flex box-border transform
        ${fadeIn ? "animate-fadeIn" : ""}
        ${sorting ? "transition-transform" : ""}
        ${dragOverlay ? "z-[999]" : ""}
      `;

      const itemClasses = `
        relative flex flex-grow items-center p-[18px_20px] bg-white
        shadow-[0_0_0_1px_rgba(63,63,68,0.05),0_1px_3px_0_rgba(34,33,81,0.15)]
        outline-none rounded-[4px] box-border list-none origin-center
        text-[#333] font-normal text-base whitespace-nowrap
        transition-shadow duration-200 ease-[cubic-bezier(0.18,0.67,0.6,1.22)]
        focus-visible:shadow-[0_0_0_1px_#4c9ffe,0_0_0_1px_rgba(63,63,68,0.05),0_1px_3px_0_rgba(34,33,81,0.15)]
        ${!handle ? "touch-manipulation cursor-grab" : ""}
        ${dragging && !dragOverlay ? "opacity-50 z-0" : ""}
        ${disabled ? "text-[#999] bg-[#f1f1f1] cursor-not-allowed" : ""}
        ${dragOverlay ? "cursor-inherit animate-pop shadow-[0_0_0_1px_rgba(63,63,68,0.05),-1px_0_15px_0_rgba(34,33,81,0.01),0px_15px_15px_0_rgba(34,33,81,0.25)] opacity-100" : ""}
        ${color ? 'before:content-[""] before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:h-full before:w-[3px] before:block before:rounded-l-[3px]' : ""}
        hover:[&>.Remove]:visible
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
              "--color": color,
              transform: `
              translate3d(var(--translate-x, 0), var(--translate-y, 0), 0)
              scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))
            `,
              transformOrigin: "0 0",
            } as React.CSSProperties
          }
          ref={ref}
        >
          <div
            className={itemClasses}
            style={{
              ...style,
              transform: "scale(var(--scale, 1))",
              boxShadow: dragOverlay ? "var(--box-shadow-picked-up)" : undefined,
            }}
            data-cypress="draggable-item"
            {...(!handle ? listeners : undefined)}
            {...props}
            tabIndex={!handle ? 0 : undefined}
          >
            {value}
            <span className="flex self-start -mt-3 ml-auto -mb-[15px] -mr-[10px]">
              {onRemove ? <ItemRemove className="invisible" onClick={onRemove} /> : null}
              {handle ? <ItemHandle {...handleProps} {...listeners} /> : null}
            </span>
          </div>
        </li>
      );
    },
  ),
);
