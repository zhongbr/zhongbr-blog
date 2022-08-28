/*
 * @Description: async effect
 * @Author: 张盼宏
 * @Date: 2022-08-28 12:54:08
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-28 12:57:44
 */
import { useEffect } from 'react';

type Deps = Parameters<typeof useEffect>[1];

export default function useAsyncEffect(effect: () => Promise<void>, deps?: Deps) {
    useEffect(() => {
        (async () => {
            await effect();
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
