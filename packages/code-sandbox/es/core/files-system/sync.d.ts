import { FilesSystem } from './types';
export declare const SyncServiceName = "code-sandbox-sync-files";
/**
 * 在 iframe 内调用，处理来自宿主窗口的同步消息，保持 iframe 内的 fs 和 外部页面的一致
 * @param fs iframe 内部的fs 对象
 */
export declare function initIframeFilesSyncService(fs: FilesSystem): Promise<() => void>;
/**
 * 在宿主页面内调用，分发 fs 的状态给 iframe 内的 fs 对象
 * @param fs 宿主页面的 fs 对象
 * @param iframe 要分发到的 iframe
 */
export declare function initMainFilesSyncCaller(fs: FilesSystem, iframe: HTMLIFrameElement): () => void;
