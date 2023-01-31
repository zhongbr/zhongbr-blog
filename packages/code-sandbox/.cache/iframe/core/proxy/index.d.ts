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
/**
 * 注册一个可以被其他 Window 通过 postMessage 调用的对象
 * @param serviceId 服务的名称
 * @param obj 要被代理的对象
 */
export declare function registerProxy<T extends Object>(serviceId: string, obj: T): () => void;
/**
 * 等待目标上下文的某个服务准备好
 * @param win 目标上下文
 * @param serviceId 要等待的服务
 * @param timeout 超时时间
 */
export declare function waitProxy(win: WindowProxy | Worker, serviceId: string, timeout?: number): Promise<unknown>;
/**
 * 调用 win 上下文中提供的服务
 * @param win 要调用的服务所在的上下文
 * @param serviceId 服务的名称
 * @param method 调用的方法
 * @param payload 要传递的参数
 * @param timeout 超时时间
 */
export declare function callProxy<T extends Object, M extends keyof T = any, P = T[M] extends (...args: unknown[]) => any ? Parameters<T[M]> : any>({ win, serviceId, method, payload, timeout }: ICallOpt<T, M, P>): Promise<unknown>;
