import { useCallback, useState } from "preact/hooks";

export function useAsyncQuery<TData, TVariables>(
  queryFn: (vars: TVariables) => Promise<TData>
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(true); // 👈 start true
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(
    async (vars: TVariables) => {
      setLoading(true);
      setError(null);
      try {
        const result = await queryFn(vars);
        setData(result);
        return result;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [queryFn]
  );

  return { data, loading, error, run };
}
