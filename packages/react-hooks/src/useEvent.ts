import { useCallback, useRef } from 'react';

export default function usePersistFn<Fn extends (...args: any[]) => any>(fn: Fn): Fn {
    const fnRef = useRef<Fn>();
    fnRef.current = fn;

    return useCallback((...args: Parameters<Fn>) => {
        const res = fnRef.current?.(...args);
        return res as ReturnType<Fn>;
    }, []) as Fn;
}
