export type PromiseRes<T> = T extends Promise<infer P> ? P : unknown;
