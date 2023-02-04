import { useCallback, useRef } from 'react';
export default function usePersistFn(fn) {
    const fnRef = useRef();
    fnRef.current = fn;
    return useCallback((...args) => {
        var _a;
        const res = (_a = fnRef.current) === null || _a === void 0 ? void 0 : _a.call(fnRef, ...args);
        return res;
    }, []);
}
