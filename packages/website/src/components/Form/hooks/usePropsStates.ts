import { useEffect } from 'react';
import useStates, { SetStatesRes } from '@/hooks/useStates';

export default function usePropsStates<T extends object>(props: T): SetStatesRes<T> {
    let [states, setStates, reset] = useStates(props);

    useEffect(() => {
        setStates(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, Object.values(props));

    return [states, setStates, reset];
}
