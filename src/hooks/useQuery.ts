import { useCallback, useEffect, useRef, useState } from "preact/hooks";

export interface UseQueryOptions<TData> {
  queryKey: string | any[];
  queryFn: (signal?: AbortSignal) => Promise<TData>;
  enabled?: boolean;
}

export interface UseQueryResult<TData> {
  data: TData | undefined;
  error: Error | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useQuery<TData>({
  queryKey,
  queryFn,
  enabled = true,
}: UseQueryOptions<TData>): UseQueryResult<TData> {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await queryFn(signal);
        if (mountedRef.current && !signal?.aborted) {
          setData(result);
        }
      } catch (err) {
        if (mountedRef.current && !signal?.aborted) {
          setError(err as Error);
        }
      } finally {
        if (mountedRef.current && !signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [queryFn]
  );

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    run(controller.signal);

    return () => {
      controller.abort();
    };
  }, [enabled, run, JSON.stringify(queryKey)]);

  return { data, error, isLoading, refetch: () => run() };
}
