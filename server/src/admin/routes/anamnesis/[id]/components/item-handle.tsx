import { forwardRef } from "react";

import { ItemAction, type ItemActionProps } from "./item-action";

export const ItemHandle = forwardRef<HTMLButtonElement, ItemActionProps>((props, ref) => {
  return (
    <ItemAction ref={ref} cursor="grab" data-cypress="draggable-handle" {...props}>
      <svg viewBox="0 0 20 20" width="12" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
      </svg>
    </ItemAction>
  );
});
