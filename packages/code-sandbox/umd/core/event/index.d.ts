export interface Handler {
    (...params: unknown[]): void;
    filter?: (...params: unknown[]) => boolean;
    once?: boolean;
}
export declare const createEventSubscribeManager: <K = string>() => {
    trigger: (key: K, ...params: unknown[]) => void;
    listen: (key: K, cb: Handler, filter?: Handler['filter']) => () => void;
    once: (key: K, cb: Handler, filter?: Handler['filter'], onTimeout?: () => void, timeout?: number) => () => void;
};
