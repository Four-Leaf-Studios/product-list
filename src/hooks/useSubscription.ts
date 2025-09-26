import { useEffect, useRef, useState } from "preact/hooks";

export interface UseSubscriptionOptions<TData> {
  /** Function to start subscription and return an unsubscribe callback */
  subscribe: (cb: (data: TData) => void) => () => void;
  /** Optional initial fetch before subscription kicks in */
  getInitial?: () => Promise<TData>;
}

export function useSubscription<TData>({
  subscribe,
  getInitial,
}: UseSubscriptionOptions<TData>) {
  const [data, setData] = useState<TData | undefined>(undefined);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // fetch initial data if available
    if (getInitial) {
      getInitial().then((val) => {
        if (mountedRef.current) setData(val);
      });
    }

    // subscribe to updates
    const unsubscribe = subscribe((val) => {
      if (mountedRef.current) setData(val);
    });

    return () => {
      mountedRef.current = false;
      unsubscribe?.();
    };
  }, [subscribe, getInitial]);

  return data;
}
