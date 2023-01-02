import { useRef } from 'react';
import useStates, { SetStatesRes } from '@/hooks/useStates';

interface IOptions {
    diff?: (obj1: any, obj2: any) => boolean;
}

const diffObj = (obj1: object, obj2: object, options: IOptions = {}) => {
    const { diff = (obj1: any, obj2: any) => obj1 !== obj2 } = options;
    const keys = Object.keys(obj1);
    if (keys.length !== Object.keys(obj2).length) {
        return true;
    }
    return keys.some(key => diff(Reflect.get(obj1, key), Reflect.get(obj2, key)));
};

export default function usePropsStates<T extends object>(props: T, options?: IOptions): SetStatesRes<T> {
    const [states, setStates, reset] = useStates(props);
    const previousPropsRef = useRef<T>(props);

    if (!previousPropsRef.current || diffObj(previousPropsRef.current, props, options)) {
        setStates(props);
    }

    return [states, setStates, reset];
}
