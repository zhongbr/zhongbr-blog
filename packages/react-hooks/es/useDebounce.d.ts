export default function useDebounce<Fn extends (...args: any[]) => void>(fn: Fn, debbounce?: number): Fn;
