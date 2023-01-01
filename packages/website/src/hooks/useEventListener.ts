import { useEffect } from 'react';

type AddEventListenerParameters = Parameters<Window['addEventListener']>;

export default function useEventListener(...args: AddEventListenerParameters) {
    const [type, listener, options] = args;

    useEffect(() => {
        window.addEventListener(type, listener, options);

        return () => window.removeEventListener(type, listener, options);
    }, [type, listener, options]);
}
