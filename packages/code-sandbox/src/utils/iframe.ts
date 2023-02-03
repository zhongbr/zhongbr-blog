import { createEventSubscribeManager } from '../core/event';
import { callProxy, registerProxy } from '../core/proxy';

const EVENT_KEY = 'iframe-message-type';
const NOTIFICATION_SERVICE = 'iframe-notification-service';

interface INotificationService {
    /** iframe 加载完成 */
    iframeReady: (e: MessageEvent) => Promise<boolean>;
    iframeLoadingModule: (moduleName: string, moduleUrl: string, e: MessageEvent) => Promise<void>;
}

const emitter = createEventSubscribeManager<keyof INotificationService>();

/**
 * 注册主进程中的服务，监听消息
 */
export const initMainThreadService = async () => {
    const service: INotificationService = {
        iframeReady: async (e) => {
            console.log('iframe ready', e);
            emitter.trigger('iframeReady', e);
            return true;
        },
        iframeLoadingModule: async (moduleName, moduleUrl, e) => {
            emitter.trigger('iframeLoadingModule', moduleName, moduleUrl, e);
        }
    }
    registerProxy(NOTIFICATION_SERVICE, service);
};

/**
 * 主页面中，等待指定的 iframe 运行环境加载完成
 * @param iframe 要等待的 iframe
 * @param timeout 超时时间
 */
export const waitIframeReady = async (iframe: HTMLIFrameElement, timeout=10000) => {
    // 被动监听 iframe 发送的消息来得知 iframe 已经加载，避免调用时 iframe 端还未准备好而导致的消息丢失
    const listenTask = new Promise<null>((resolve, reject) => {
        if (iframe.getAttribute('data-iframe-status') !== 'ready') {
            emitter.once(
                'iframeReady',
                (...args) => {
                    iframe.setAttribute('data-iframe-status', 'ready');
                    resolve(null);
                },
                (e: MessageEvent) => e.source === iframe.contentWindow,
                reject,
                timeout
            );
        }
        else {
            resolve(null);
        }
    });
    // 主动调用 iframe 暴露的接口查询是否准备好
    const queryTask = async () => {
        // 先等待 iframe 加载好
        await new Promise(resolve => {
            const onload = () => {
                iframe.setAttribute('data-iframe-status', 'loaded');
                resolve(null);
                iframe.removeEventListener('load', onload);
            };
            iframe.addEventListener('load', onload);
        });
        // 等待 iframe 内的 js 环境准备好
        await callProxy<Pick<INotificationService, 'iframeReady'>>({
            win: iframe.contentWindow,
            serviceId: NOTIFICATION_SERVICE,
            method: 'iframeReady',
            payload: [],
            timeout
        });
    };
    // 两个查询方式 race，取返回快的结果
    return Promise.race([listenTask, queryTask()]);
}

/**
 * 通知外部容器，iframe 内部已经加载完成的函数
 */
export const iframeReady = async () => {
    registerProxy<Pick<INotificationService, 'iframeReady'>>(NOTIFICATION_SERVICE, {
        iframeReady: async () => {
            return true;
        }
    });
    const parent = window.top || window.parent || window.opener;
    if (!parent) return;
    return callProxy<INotificationService>({
        win: parent,
        serviceId: NOTIFICATION_SERVICE,
        method: 'iframeReady',
        payload: []
    });
}

/**
 * 监听指定的 iframe 内加载模块
 * @param iframe 要监听的 iframe
 * @param cb 回调函数
 */
export const onIframeLoadingModule = (iframe: HTMLIFrameElement, cb: (moduleName: string, extraInfo: string) => void) => {
    emitter.listen('iframeLoadingModule', cb, (moduleName, extraInfo, e: MessageEvent) => e.source === iframe.contentWindow);
};

/**
 * 通知外部容器，iframe 内部正在加载模块的函数
 * @param moduleName
 * @param extraInfo
 */
export const iframeLoadingModule = async (moduleName: string, extraInfo: string) => {
    const parent = window.top || window.parent || window.opener;
    if (!parent) return;
    return callProxy<INotificationService>({
        win: parent,
        serviceId: NOTIFICATION_SERVICE,
        method: 'iframeLoadingModule',
        payload: [moduleName, extraInfo]
    });
};
