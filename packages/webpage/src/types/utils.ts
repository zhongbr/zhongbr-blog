export type PromiseRes<T> = T extends Promise<infer P> ? P : unknown;
export const PlaygroundGetCodeSymbol = 'playground-get-code';
export interface IPlaygroundCode {
    index?: string;
    demo?: string;
    html?: string;
    css?: string;
}