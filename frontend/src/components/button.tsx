import type { ButtonHTMLAttributes, FC } from "react";

import cx from "../utils/cx";
import Loading from "./loading";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  childrenClassName?: string;
  loaderClassName?: string;
}
const Button: FC<ButtonProps> = ({
  variant = "primary",
  loading,
  disabled,
  children,
  className,
  loaderClassName,
  childrenClassName,
  ...restProps
}) => {
  return (
    <button
      className={cx(
        "inline-flex text-center justify-center px-4 pt-2 pb-1.5 font-medium inter-base-regular tracking-wide text-sm rounded-md transition ease-in-out duration-150 min-w-[6.25rem] min-h-[2.5rem]",
        {
          "bg-rose-500 hover:bg-rose-600 text-white disabled:bg-gray-500 disabled:text-white  ": variant === "danger",
          "bg-transparent text-emerald-500 hover:text-emerald-600 disabled:text-gray-500 ": variant === "secondary",
          "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-500 disabled:text-white  ":
            variant === "primary",
        },
        className,
      )}
      disabled={loading || disabled}
      {...restProps}
    >
      {children && !loading && <span className={cx("leading-6", childrenClassName)}>{children}</span>}
      {loading && (
        <span
          className={cx(
            "text-center size-4 pt-[2px] pl-[1px]",
            {
              "text-gray-400": variant === "secondary",
            },
            loaderClassName,
          )}
        >
          <Loading />
        </span>
      )}
    </button>
  );
};
export default Button;
