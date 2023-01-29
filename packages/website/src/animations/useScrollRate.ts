import React, { useEffect, useState } from 'react';

export default function useScrollRate<T extends Element>(ref: React.LegacyRef<T> | undefined, base = 60) {
    const [rate, setRate] = useState(0);

    useEffect(() => {
        if (!ref) {
            return;
        }
        const ele = (ref as React.RefObject<T>).current;

        const handler = () => {
            const scrollTop = Math.min(base, Math.max(0, (ref as React.RefObject<T>).current?.scrollTop || 0));
            setRate(scrollTop / base);
        };

        ele?.addEventListener('scroll', handler);

        return () => {
            ele?.removeEventListener('scroll', handler);
        };
    }, [setRate, base, ref])

    return { ref, rate };
}
