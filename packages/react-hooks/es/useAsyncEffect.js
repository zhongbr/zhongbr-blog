import { useEffect } from 'react';
export default function useAsyncEffect(effect, deps) {
    useEffect(() => {
        effect();
    }, deps);
}
;
