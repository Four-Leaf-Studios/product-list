import { useCallback, useEffect, useRef, useState } from "preact/hooks";

export interface UseMutationResult<TData, TVariables> {
  data: TData | undefined;
  error: Error | null;
  isLoading: boolean;
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  reset: () => void;
}

export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables, signal?: AbortSignal) => Promise<TData>
): UseMutationResult<TData, TVariables> {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(
    async (variables: TVariables) => {
      const controller = new AbortController();
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFn(variables, controller.signal);
        if (mountedRef.current && !controller.signal.aborted) {
          setData(result);
          return result;
        }
      } catch (err) {
        if (mountedRef.current && !controller.signal.aborted) {
          setError(err as Error);
        }
      } finally {
        if (mountedRef.current && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [mutationFn]
  );

  return { data, error, isLoading, mutate, reset: () => setData(undefined) };
}
