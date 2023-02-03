// 同步 iframe 和 页面内的两个 FS 对象
import {callProxy, registerProxy, waitProxy} from '../proxy';
import {EventTypes, FilesSystem, IDirectory} from './types';
import {waitIframeReady} from "../../utils/iframe";

export const SyncServiceName = 'code-sandbox-sync-files';

interface IIframeSyncService {
    sync: (eventType: EventTypes, orderCount: number, path: string, ...args: unknown[]) => Promise<void>;
}

interface IMainSyncService {
    requestFs: () => Promise<string>;
}

/**
 * 在 iframe 内调用，处理来自宿主窗口的同步消息，保持 iframe 内的 fs 和 外部页面的一致
 * @param fs iframe 内部的fs 对象
 */
export async function initIframeFilesSyncService(fs: FilesSystem) {
    const cacheQueue: Map<number, [eventType: EventTypes, path: string, ...args: unknown[]]> = new Map();
    let currentCount = 0;

    const dispose = registerProxy<IIframeSyncService>(SyncServiceName, {
        sync: async (eventType, orderCount, path, ...args) => {
            // 把消息放入到消息队列里，确保消息按照顺序执行
            cacheQueue.set(orderCount, [eventType, path, ...args]);
            // 将当前顺序可以处理的消息都处理掉
            while (cacheQueue.get(currentCount)) {
                const [eventType, path, ...args] = cacheQueue.get(currentCount);
                cacheQueue.delete(currentCount);
                currentCount++;

                const [, dir_] = fs.pathReduce(path);
                const dir = dir_ as IDirectory;
                switch (eventType) {
                    case "transfer": {
                        fs.receive.apply(fs, args);
                        break;
                    }
                    case "dir-clear": {
                        dir.children.clear();
                        break;
                    }
                    case "dir-set": {
                        dir.children.set.apply(dir.children, args);
                        break;
                    }
                    case "dir-delete": {
                        dir.children.delete.apply(dir.children, args);
                        break;
                    }
                    case "files-change": {
                        fs.event.trigger(eventType, path, ...args);
                        break;
                    }
                }
            }
        }
    });

    // 主动调用宿主窗口获取一次数据
    const payload = await callProxy<IMainSyncService, 'requestFs'>({
        win: self.parent || self.opener || self.top,
        method: 'requestFs',
        serviceId: SyncServiceName,
        payload: []
    }) as string;
    if (payload) {
        fs.receive(payload);
        console.log('receive', payload, fs);
        return;
    }
    return dispose;
}

/**
 * 在宿主页面内调用，分发 fs 的状态给 iframe 内的 fs 对象
 * @param fs 宿主页面的 fs 对象
 * @param iframe 要分发到的 iframe
 */
export function initMainFilesSyncCaller(fs: FilesSystem, iframe: HTMLIFrameElement) {
    // 监听 fs 的事件，并调用 iframe 的服务，同步给 iframe
    const onEvent = (eventType: EventTypes) => {
        return fs.event.listen(eventType, async (...args) => {
            await waitIframeReady(iframe);
            await waitProxy(iframe.contentWindow, SyncServiceName);
            await callProxy<IIframeSyncService>({
                win: iframe.contentWindow,
                serviceId: SyncServiceName,
                method: 'sync',
                payload: [eventType, ...args]
            });
        });
    };
    const disposes: Array<() => void> = [];
    disposes.push(onEvent('transfer'));
    disposes.push(onEvent('dir-delete'));
    disposes.push(onEvent('dir-set'));
    disposes.push(onEvent('dir-clear'));
    disposes.push(onEvent('files-change'));
    // 创建服务，用于回应 iframe 主动发起的数据同步请求
    disposes.push(registerProxy<IMainSyncService>(SyncServiceName, {
        requestFs: async () => {
            // 将 fs 内的数据序列化之后传递给 iframe
            return fs.getDataPayload();
        }
    }));
    return () => {
        disposes.forEach(dispose => dispose());
    };
}
