export interface IOptions {
    iframe: HTMLIFrameElement | null;
    index?: string;
    code?: string;
    settings?: string;
    css?: string;
    className?: string;
    style?: string;
}
export declare const getSandboxRefresher: (opt: IOptions) => {
    refreshApp: () => Promise<void>;
    refreshIndex: () => Promise<void>;
    refreshSettings: () => Promise<void>;
    refreshStyle: () => Promise<void>;
};
export { getIframeHTML, iframeStyles } from './html';
