export type PromiseRes<T> = T extends Promise<infer P> ? P : unknown;
export const PlaygroundGetCodeSymbol = 'playground-get-code';
export interface IPlaygroundCode {
    demo?: string;
    deps?: Array<{ url: string; obj: string; id: string; }>
}
