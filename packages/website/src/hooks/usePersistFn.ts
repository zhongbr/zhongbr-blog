/*
 * @Description: use persist fn hook
 * @Author: 张盼宏
 * @Date: 2022-08-28 14:40:19
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-28 14:47:50
 */
import {useCallback, useRef} from 'react';

export default function usePersistFn<Fn extends (...args: any[]) => any>(fn: Fn): Fn {
    const fnRef = useRef<Fn>(fn);

    fnRef.current = fn;

    return useCallback((...args: Parameters<Fn>) => {
        const res = fnRef.current?.(...args);
        return res as ReturnType<Fn>;
    }, []) as Fn;
}
