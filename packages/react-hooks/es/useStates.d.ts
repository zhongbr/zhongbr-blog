export type Dispatch<T> = (payload: Partial<T> | (() => Partial<T>), cb?: (states: T) => void) => void;
export type SetStatesRes<T> = [T, Dispatch<T>, () => void];
export default function useStates<T>(initStates: T): SetStatesRes<T>;
