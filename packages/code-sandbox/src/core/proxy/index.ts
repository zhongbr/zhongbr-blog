import logger from '../../utils/logger';

export interface IMessageType {
    id: string | number;
    receiver?: string;
    method?: string;
    payload: unknown[];
    error: boolean;
    timeout?: number;
    __proxy_internal: 'reply' | 'call' | 'wait' | 'wait-reply';
}

export interface ICallOpt<T, M, P> {
    timeout?: number;
    win: WindowProxy | Worker;
    serviceId: string;
    method: M;
    payload: P;
}

// 当前消息的id，每次自增
let MessageID = 0;
const getMessageId = () => MessageID++;

// 已注册的服务
const services = new Set();
// 等待服务注册的回调
const waitServiceCallbacks: Map<string, Function[]> = new Map();
// 监听等待服务的消息
self.addEventListener('message', e => {
    const message = e.data as IMessageType;
    // 不是代理的消息忽略
    if (typeof message !== 'object' || Reflect.get(message, '__proxy_internal') !== 'wait') {
        return;
    }
    // 去除等待服务id
    const serviceId = message.receiver;
    // 插入一个回调函数，回复消息，设置一个超时时间
    const timeout_ = setTimeout(() => {
        const callbacks = (waitServiceCallbacks.get(serviceId) || []).filter(c => c !== callback);
        waitServiceCallbacks.set(serviceId, callbacks);
        (e.source || self).postMessage({
            __proxy_internal: 'wait-reply',
            error: true,
            id: message.id,
            payload: [`[proxy]wait for service ${serviceId} timeout.`]
        } as IMessageType, {
            targetOrigin: '*'
        });
    }, message!.timeout);
    const callback = () => {
        clearTimeout(timeout_);
        (e.source || self).postMessage({
            __proxy_internal: 'wait-reply',
            id: message.id,
            error: false,
            payload: []
        } as IMessageType, {
            targetOrigin: '*'
        });
        const callbacks = (waitServiceCallbacks.get(serviceId) || []).filter(c => c !== callback);
        waitServiceCallbacks.set(serviceId, callbacks);
    };
    // 将回调函数加入队列
    const callbacks = waitServiceCallbacks.get(serviceId) || [];
    callbacks.push(callback);
    waitServiceCallbacks.set(serviceId, callbacks);
    // 如果服务已经注册过了，直接调用 callback
    if (services.has(serviceId)) {
        callback();
    }
});

/**
 * 注册一个可以被其他 Window 通过 postMessage 调用的对象
 * @param serviceId 服务的名称
 * @param obj 要被代理的对象
 */
export function registerProxy<T extends Object>(serviceId: string, obj: T) {
    // 如果有等待这个服务的回调，现在就可以调用了
    const callbacks = waitServiceCallbacks.get(serviceId);
    if (callbacks) callbacks.forEach(callback => callback());
    // 监听事件
    const serviceHandler = async e => {
        const message = e.data as IMessageType;
        // 不是代理的消息忽略
        if (typeof message !== 'object' || Reflect.get(message, '__proxy_internal') !== 'call') {
            return;
        }
        if (message.receiver === serviceId) {
            const method = Reflect.get(obj, message.method) as unknown | ((...args: unknown[]) => unknown);
            // 调用了不存在的方法，回复对方一个错误
            if (!method) {
                (e.source || self).postMessage({
                    __proxy_internal: 'reply',
                    id: message.id,
                    error: true,
                    payload: [`[proxy] method \`${message.method}\` does not exist on remote object ${message.receiver} or it is not a function.`]
                } as IMessageType, {
                    targetOrigin: '*'
                });
            }
            let res: unknown = method;
            if (typeof method === "function") {
                // 调用方法回复结果
                res = await method.call(obj, ...message.payload, e);
            }
            logger.debug('[proxy] reply', self?.location?.href || 'worker', e.source, message.receiver, message.method, (e.source || self));
            (e.source || self).postMessage({
                __proxy_internal: 'reply',
                id: message.id,
                error: false,
                payload: [res]
            } as IMessageType, {
                targetOrigin: '*'
            });
        }
    };
    self.addEventListener('message', serviceHandler);
    return () => {
        self.removeEventListener('message', serviceHandler);
    };
}

/**
 * 等待目标上下文的某个服务准备好
 * @param win 目标上下文
 * @param serviceId 要等待的服务
 * @param timeout 超时时间
 */
export async function waitProxy(win: WindowProxy | Worker, serviceId: string, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const messageId = getMessageId();
        // 监听的自己的事件，处理回复的消息
        const timeout_ = setTimeout(() => {
            self.removeEventListener('message', callback);
            reject(`[proxy] wait for ${serviceId} timeout .`);
        }, timeout);
        const callback: EventListener = (e: MessageEvent) => {
            if ((e.source || self) !== win) return;
            const message = e.data as IMessageType;
            if (typeof message !== 'object' || Reflect.get(message, '__proxy_internal') !== 'wait-reply' || message.id !== messageId) {
                return;
            }
            resolve(null);
            clearTimeout(timeout_);
            self.removeEventListener('message', callback);
        };
        self.addEventListener('message', callback);
        // 向目标上下文发送一个消息，表示自己在等待某个服务完成
        win.postMessage({
            __proxy_internal: 'wait',
            receiver: serviceId,
            payload: [],
            error: false,
            id: messageId
        } as IMessageType, {
            targetOrigin: '*'
        });
    });
}

/**
 * 调用 win 上下文中提供的服务
 * @param win 要调用的服务所在的上下文
 * @param serviceId 服务的名称
 * @param method 调用的方法
 * @param payload 要传递的参数
 * @param timeout 超时时间
 */
export async function callProxy<
    T extends Object,
    M extends keyof T = any,
    P = T[M] extends (...args: unknown[]) => any ? Parameters<T[M]> : any
>({ win, serviceId, method, payload, timeout = 10000 }: ICallOpt<T, M, P>) {
    return new Promise<unknown>((resolve, reject) => {
        const messageId = getMessageId();
        // 如果调用的是 worker，需要在 worker 上监听
        let handler: Pick<Window, 'removeEventListener' | 'addEventListener'> = self;
        if (win instanceof Worker) {
            handler = win;
        }
        // 注册等待回复的消息
        let timeout_ = setTimeout(() => {
            reject(`call remote object ${serviceId} method ${method.toString()} timeout`);
            handler.removeEventListener('message', callback);
        }, timeout);
        const callback: EventListener = (e: MessageEvent) => {
            if (!(win instanceof Worker) && (e.source || self) !== win) return;
            const message = e.data as IMessageType;
            if (typeof message !== 'object' || Reflect.get(message, '__proxy_internal') !== 'reply' || message.id !== messageId) return;
            handler.removeEventListener('message', callback);
            clearTimeout(timeout_);
            logger.debug('[proxy] receive reply', self?.location?.href || 'worker', message.id);
            if (message.error) {
                reject(message.payload[0]);
                return;
            }
            resolve(message.payload[0]);
        };
        handler.addEventListener('message', callback);
        logger.debug('[proxy] call', self?.location?.href || 'worker', serviceId, method);
        // 调用远程的方法
        win.postMessage({
            id: messageId,
            __proxy_internal: 'call',
            receiver: serviceId,
            method,
            payload,
            error: false
        } as IMessageType, {
            targetOrigin: '*'
        });
    });
}
