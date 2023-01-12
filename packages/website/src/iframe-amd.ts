import {createAmdManager} from './utils/amd';
import {IEvent, IMessageType} from './types/iframe-sandbox';

const moduleManager = createAmdManager();
// 先在 iframe 内部挂载一个 AMD 模块管理的实例
moduleManager.mountToGlobal();

const parent = window.parent || window.opener;
console.log('[sandbox] parent', parent);
// 监听来自其他页面的消息，并根据消息渲染页面
window.addEventListener('message', async (e) => {
    if (e.source !== parent) {
        console.log('[sandbox] is not from parent window, ignored.', e);
    }
    const event = e.data as IEvent;
    console.log('[sandbox] receive message', event);
    let res: unknown[] = [];
    try {
        switch (event.type) {
            case IMessageType.Refresh: {
                window.location.reload();
                break;
            }
            case IMessageType.DefineModule: {
                const [moduleName, code, deps = []] = event.payload as [string, string, string[]];
                await moduleManager.define(moduleName, ['require', ...deps], code);
                break;
            }
            case IMessageType.RunModule: {
                const [moduleName] = event.payload as [string];
                await moduleManager.require_(moduleName);
                break;
            }
        }
    } catch (e) {
        parent.postMessage({
            id: event.id,
            type: IMessageType.Error,
            payload: [e]
        } as IEvent);
    }
    console.log('[sandbox] reply message', event);
    parent.postMessage({
        id: event.id,
        type: IMessageType.Reply,
        payload: res
    } as IEvent);
});

// 监听 iframe 页面报错
window.addEventListener('error', (e) => {
    parent.postMessage({
        id: Math.random().toString(),
        type: IMessageType.Error,
        payload: [e.error]
    });
    const root = document.getElementById('root');
    if (!root) return;
    root.innerText = `${e.error.toString()}${e.error.stack.toString()}`;
});

// 向父页面发送一条消息，通知页面已经加载
if (parent) {
    parent.postMessage({
        id: Math.random().toString(),
        type: IMessageType.IFrameReady,
        payload: []
    } as IEvent);
    console.log('[sandbox] iframe 页面加载完成');
}
