type WithoutPromise<T> = T extends Promise<infer P> ? P : never;
export default function useAsyncFn<Fn extends (...args: any[]) => Promise<any>>(fn: Fn): [Fn, WithoutPromise<ReturnType<Fn>>, boolean];
export {};
