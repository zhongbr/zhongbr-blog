/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-08-27 18:59:34
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:10:27
 */
import {useEffect, useRef, useState} from 'react';

export default function useScrollRate<T extends Element>(base = 500) {
    const ref = useRef<T>(null);
    const [rate, setRate] = useState(0);

    useEffect(() => {
        const ele = ref.current;

        const handler = () => {
            const scrollTop = Math.min(base, Math.max(0, ref.current?.scrollTop || 0));
            setRate(scrollTop / base);
        };

        ele?.addEventListener('scroll', handler);

        return () => {
            ele?.removeEventListener('scroll', handler);
        };
    }, [setRate, base])

    return { ref, rate };
}
