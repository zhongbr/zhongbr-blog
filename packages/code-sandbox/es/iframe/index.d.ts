export interface IOptions {
    iframe: HTMLIFrameElement | null;
    index?: string;
    code?: string;
    html?: string;
    css?: string;
    className?: string;
    style?: string;
}
export declare const getSandboxRefresher: (opt: IOptions) => {
    refreshApp: () => Promise<void>;
    refreshIndex: () => Promise<void>;
    refreshHtml: () => Promise<void>;
    refreshStyle: () => Promise<void>;
};
export { getIframeHTML, iframeStyles } from './html';
export declare const setSandboxPlugins: (iframe: HTMLIFrameElement | null, pluginsId: string[]) => Promise<unknown>;
