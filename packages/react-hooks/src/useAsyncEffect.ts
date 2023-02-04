import { useEffect } from 'react';

export default function useAsyncEffect(effect: () => Promise<void>, deps: unknown[]) {
    useEffect(() => {
        effect();
    }, deps);
};
