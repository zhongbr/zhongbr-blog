import { callProxy, registerProxy } from '../proxy';
import { IService, ServiceName } from './types';
// @ts-ignore
import worker_ from './worker.worker?worker&inline';

let service: IService;

/**
 * 给本地页面使用的 service
 */
export const getJsxService: () => IService = () => {
    if (service) return service;
    const worker = worker_();
    // 在主进程生成一个调用 worker 内方法的代理对象
    service = {
        transformJsxComponentCode: async (code: string) => {
            return await callProxy<IService>({
                win: worker,
                serviceId: ServiceName,
                method: 'transformJsxComponentCode',
                payload: [code],
            }) as ReturnType<IService['transformJsxComponentCode']>;
        }
    };
    // 将worker代理对象注册未主进程的代理对象，供其他的 iframe 等调用
    registerProxy<IService>(ServiceName, service);
}
