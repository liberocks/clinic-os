import type { FC, ReactNode } from "react";

export interface ShowIfProps {
  condition: boolean;
  children: ReactNode;
}

export const ShowIf: FC<ShowIfProps> = ({ condition, children }) => {
  if (condition) {
    return <>{children}</>;
  }
  return null;
};
