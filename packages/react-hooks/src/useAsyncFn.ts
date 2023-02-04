import { useState } from "react";

import useEvent from './useEvent';

type WithoutPromise<T> = T extends Promise<infer P> ? P : never;

export default function useAsyncFn<Fn extends (...args: any[]) => Promise<any>>(fn: Fn): [Fn, WithoutPromise<ReturnType<Fn>>, boolean] {
    const [loading, setLoading] = useState(false);
    const [res, setRes] = useState();

    const asyncFn = useEvent(async (...args) => {
        setLoading(true);
        const res = await fn(...args);
        setRes(res);
        setLoading(false);
        return res;
    });

    return [asyncFn as Fn, res, loading] as any;
}
