import { useRef } from 'react';
import useEvent from "./useEvent";
export default function useDebounce(fn, debbounce = 300) {
    const timmerRef = useRef();
    return useEvent((...args) => {
        if (timmerRef.current) {
            clearTimeout(timmerRef.current);
        }
        timmerRef.current = setTimeout(() => {
            fn(...args);
        }, debbounce);
    });
}
