import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

interface AsyncProps<T> {
  request: () => Promise<T>;
  immediate?: boolean;
  deps?: unknown[];
  cacheFirst?: boolean;
  skeleton?: ReactNode;
  emptyState?: ReactNode;
  errorRender?: (err: Error) => ReactNode;
  className?: string;
  children: ReactNode;
}

export function Async<T = unknown>({
  className,
  request,
  immediate = true,
  deps = [],
  cacheFirst = false,
  skeleton,
  emptyState,
  errorRender,
  children,
}: AsyncProps<T>) {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [result, setResult] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(() => {
    setStatus("pending");
    setError(null);

    return request()
      .then((data) => {
        setResult(!!data);
        setStatus("success");
      })
      .catch((err: Error) => {
        setError(err);
        setStatus("error");
      });
  }, [request]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, deps.concat(immediate));

  return (
    <div className={className}>
      {status === "idle" && cacheFirst && children}
      {status === "pending" && (!cacheFirst ? skeleton : children)}
      {status === "error" && (errorRender ? errorRender(error) : children)}
      {status === "success" && (!result && emptyState ? emptyState : children)}
    </div>
  );
}
