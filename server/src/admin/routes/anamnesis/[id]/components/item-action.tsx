import type React from "react";
import { type CSSProperties, forwardRef } from "react";

export interface ItemActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string;
    background: string;
  };
  cursor?: CSSProperties["cursor"];
  ref?: React.Ref<HTMLButtonElement>;
}

export const ItemAction = forwardRef<HTMLButtonElement, ItemActionProps>(
  ({ active, className, cursor, style, ...props }, ref) => {
    const baseClasses = `
      relative flex items-center justify-center w-8 h-8 p-1 outline-none border-none
      bg-transparent text-neutral-800 transition-colors
      hover:text-black hover:bg-neutral-50 
      focus-visible:bg-neutral-100
      [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current [&>svg]:stroke-current
    `;

    const activeClasses = active
      ? "[&>svg]:fill-[var(--fill)] [&>svg]:stroke-[var(--fill)] bg-[var(--background)]"
      : "";

    return (
      <button
        ref={ref}
        {...props}
        className={`${baseClasses} ${activeClasses} ${className || ""}`}
        tabIndex={0}
        style={
          {
            ...style,
            cursor,
            "--fill": active?.fill,
            "--background": active?.background,
          } as CSSProperties
        }
      />
    );
  },
);
