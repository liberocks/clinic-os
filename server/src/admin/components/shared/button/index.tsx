
import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

import cx from "../../../utils/cx";
import Loading from "../loading";



export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type?: "primary" | "secondary" | "danger";
  loading?: boolean;
  childrenClassName?: string;
  loaderClassName?: string;
}

const Button: FC<ButtonProps> = ({
  type = "primary",
  loading,
  disabled,
  children,
  className,
  loaderClassName, childrenClassName,
  ...restProps
}) => {
  return (
    <button
      className={cx(
        "inline-flex text-center justify-center px-4 pt-2 pb-1.5 font-normal tracking-wide text-sm rounded-md transition ease-in-out duration-150 min-w-[6.25rem] min-h-[2.5rem]",
        {
          "bg-rose-50 hover:bg-rose-60 outline-1 outline outline-rose-50 text-white disabled:bg-gray-500 disabled:text-white disabled:outline-gray-500": type === "danger",
          "bg-transparent outline-teal-50 text-teal-50 hover:text-teal-60 outline outline-1 disabled:text-gray-500 disabled:outline-gray-500": type === "secondary",
          "bg-teal-50 outline outline-1 outline-teal-50 hover:bg-teal-60 text-white disabled:bg-gray-500 disabled:text-white disabled:outline-gray-500": type === "primary",
        },
        className,
      )}
      disabled={loading || disabled}
      {...restProps}
    >
      {children && !loading && <span className={cx("leading-6", childrenClassName)}>{children}</span>}
      {loading && (
        <span className={cx(
          "text-center size-4 pt-[2px] pl-[1px]",
          {
            "text-gray-400": type === "secondary",
          },
          loaderClassName
        )}>
          <Loading /></span>
      )}
    </button>
  );
};

export default Button;
