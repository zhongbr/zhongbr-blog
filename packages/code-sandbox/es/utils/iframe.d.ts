/**
 * 注册主进程中的服务，监听消息
 */
export declare const initMainThreadService: () => () => void;
/**
 * 主页面中，等待指定的 iframe 运行环境加载完成
 * @param iframe 要等待的 iframe
 * @param timeout 超时时间
 */
export declare const waitIframeReady: (iframe: HTMLIFrameElement, timeout?: number) => Promise<void>;
/**
 * 通知外部容器，iframe 内部已经加载完成的函数
 */
export declare const iframeReady: () => Promise<unknown>;
/**
 * 监听指定的 iframe 内加载模块
 * @param iframe 要监听的 iframe
 * @param cb 回调函数
 */
export declare const onIframeLoadingModule: (iframe: HTMLIFrameElement, cb: (moduleName: string, extraInfo: string) => void) => void;
/**
 * 通知外部容器，iframe 内部正在加载模块的函数
 * @param moduleName
 * @param extraInfo
 */
export declare const iframeLoadingModule: (moduleName: string, extraInfo: string) => Promise<unknown>;
