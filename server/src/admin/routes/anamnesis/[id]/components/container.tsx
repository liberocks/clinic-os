import type React from "react";
import { forwardRef } from "react";

import { ItemHandle } from "./item-handle";
import { ItemRemove } from "./item-remove";

export interface ContainerProps {
  children: React.ReactNode;
  columns?: number;
  label?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<unknown>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  onRemove?(): void;
}

export const Container = forwardRef<HTMLButtonElement, ContainerProps>(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      ...props
    }: ContainerProps,
    ref,
  ) => {
    const containerClasses = `
      flex flex-col overflow-hidden box-border appearance-none outline-none
      min-w-[350px] m-2.5 rounded-md min-h-[200px] transition-colors duration-350
      bg-[#f6f6f6] border border-black/5 text-base
      ${unstyled ? "overflow-visible !bg-transparent !border-none" : ""}
      ${horizontal ? "w-full" : ""}
      ${hover ? "hover:bg-[#ebebeb]" : ""}
      ${placeholder ? "justify-center items-center cursor-pointer text-black/50 bg-transparent border-dashed border-black/[0.08] hover:border-black/[0.15]" : ""}
      ${scrollable ? "overflow-y-auto" : ""}
      ${shadow ? "shadow-[0_1px_10px_0_rgba(34,33,81,0.1)]" : ""}
      focus-visible:border-transparent focus-visible:shadow-[0_0_0_2px_rgba(255,255,255,0),0_0_0_2px_#4c9ffe]
    `;

    const ulClasses = `
      grid gap-2.5 grid-cols-[repeat(var(--columns,1),1fr)] list-none p-5 m-0
      ${horizontal ? "grid-flow-col" : ""}
    `;

    const headerClasses =
      "flex p-[5px_20px_5px_20px] pr-2 items-center justify-between bg-white rounded-t-md border-b border-black/[0.08]";
    const actionsClasses =
      "flex [&>*:first-child:not(:last-child)]:opacity-0 [&>*:first-child:not(:last-child):focus-visible]:opacity-100 group-hover:[&>*]:!opacity-100";

    return (
      <button
        {...props}
        ref={ref}
        className={containerClasses}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
        style={{ ...style, "--columns": columns } as React.CSSProperties}
      >
        {label ? (
          <div className={`${headerClasses} group`}>
            {label}
            <div className={actionsClasses}>
              {onRemove ? <ItemRemove onClick={onRemove} /> : undefined}
              <ItemHandle {...handleProps} />
            </div>
          </div>
        ) : null}
        {placeholder ? children : <ul className={ulClasses}>{children}</ul>}
      </button>
    );
  },
);
