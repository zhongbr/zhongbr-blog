import { useEffect } from 'react';

type AddEventListenerParameters = Parameters<Window['addEventListener']>;

export default function useEventListener(target: Pick<Window, 'addEventListener' | 'removeEventListener'> | null = window,...args: AddEventListenerParameters) {
    const [type, listener, options] = args;

    useEffect(() => {
        if (!target) return;

        target.addEventListener(type, listener, options);

        return () => window.removeEventListener(type, listener, options);
    }, [target, type, listener, options]);
}
