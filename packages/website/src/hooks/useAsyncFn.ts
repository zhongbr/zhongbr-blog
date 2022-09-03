/*
 * @Description: async function hook
 * @Author: 张盼宏
 * @Date: 2022-08-28 14:39:27
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-28 14:53:53
 */
import {useState} from "react";

import usePersistFn from './usePersistFn';

type WithoutPromise<T> = T extends Promise<infer P> ? P : never;

export default function useAsyncFn<Fn extends (...args: any[]) => Promise<any>>(fn: Fn) {
    const [loading, setLoading] = useState(false);
    const [res, setRes] = useState<WithoutPromise<ReturnType<Fn>>>();

    const asyncFn = usePersistFn(async (...args) => {
        setLoading(true);
        const res = await fn(...args);
        setRes(res);
        setLoading(false);
        return res;
    });

    return [asyncFn as Fn, res, loading] as const;
}
