import { FilesSystem } from '../core/files-system';
export interface IOptions {
    fs?: FilesSystem;
    iframe: HTMLIFrameElement | null;
}
export declare const JSEntry = "/index.js";
export declare const StylesEntry = "/styles.css";
export declare const HTMLEntry = "/index.html";
export declare const getSandboxRefresher: (opt: IOptions) => (payload?: string[]) => Promise<void>;
export { getIframeHTML, iframeStyles } from './html';
export declare const setSandboxPlugins: (iframe: HTMLIFrameElement | null, pluginsId: string[]) => Promise<unknown>;
