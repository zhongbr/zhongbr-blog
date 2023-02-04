import { useState } from "react";
import useEvent from './useEvent';
export default function useAsyncFn(fn) {
    const [loading, setLoading] = useState(false);
    const [res, setRes] = useState();
    const asyncFn = useEvent(async (...args) => {
        setLoading(true);
        const res = await fn(...args);
        setRes(res);
        setLoading(false);
        return res;
    });
    return [asyncFn, res, loading];
}
