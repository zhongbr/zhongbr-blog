import { useReducer, useCallback, useRef } from 'react';

export type Dispatch<T> = (
    payload: Partial<T> | (() => Partial<T>),
    cb?: (states: T) => void
) => void;

export type SetStatesRes<T> = [T, Dispatch<T>, () => void];

export default function useStates<T>(initStates: T): SetStatesRes<T> {
    const cbMap = useRef<Map<string, ((states: T) => void) | undefined>>(new Map());

    const [states, dispatch] = useReducer((states: T, payload: { data: Partial<T>; id: string; }) => {
        const { data, id } = payload;
        const newStates = { ...states, ...data };

        const cb = cbMap.current.get(id);
        cbMap.current.delete(id);

        cb?.(newStates);
        return newStates;
    }, initStates);

    const setStates: Dispatch<T> = useCallback((payload, cb) => {
        let _payload: Partial<T> = payload as Partial<T>;
        if (typeof payload === 'function') {
            _payload = payload();
        }
        const id = Math.random().toString().slice(2);
        dispatch({
            id,
            data: _payload
        });
        cbMap.current.set(id, cb);
    }, [dispatch]);

    return [states, setStates, () => setStates(initStates)];
}
