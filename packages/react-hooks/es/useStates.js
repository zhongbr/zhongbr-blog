import { useReducer, useCallback, useRef } from 'react';
export default function useStates(initStates) {
    const cbMap = useRef(new Map());
    const [states, dispatch] = useReducer((states, payload) => {
        const { data, id } = payload;
        const newStates = Object.assign(Object.assign({}, states), data);
        const cb = cbMap.current.get(id);
        cbMap.current.delete(id);
        cb === null || cb === void 0 ? void 0 : cb(newStates);
        return newStates;
    }, initStates);
    const setStates = useCallback((payload, cb) => {
        let _payload = payload;
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
