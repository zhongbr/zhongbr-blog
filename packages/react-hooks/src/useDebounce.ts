import { useRef } from 'react';
import useEvent from "./useEvent";

export default function useDebounce<Fn extends (...args: any[]) => void>(fn: Fn, debbounce=300): Fn {
    const timmerRef = useRef<NodeJS.Timeout>();

    return useEvent((...args: any[]) => {
        if (timmerRef.current) {
            clearTimeout(timmerRef.current);
        }
        timmerRef.current = setTimeout(() => {
            fn(...args);
        }, debbounce);
    }) as Fn;
}
