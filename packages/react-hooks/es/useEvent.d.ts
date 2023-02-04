export default function usePersistFn<Fn extends (...args: any[]) => any>(fn: Fn): Fn;
