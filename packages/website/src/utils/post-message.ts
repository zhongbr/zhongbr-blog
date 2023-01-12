import { IEvent, IMessageType } from '../types/iframe-sandbox';

export type IMessage<T extends Object> = T & {
    id: string | number;
};

const handlers = new Map<Pick<Window, 'postMessage'>, Map<string | number, [Function, Function]>>();

window.addEventListener('message', (e) => {
    const source = e.source as Window;
    const resolvers = handlers.get(source);
    if (!resolvers) {
        return;
    }
    const { id: messageId, type: type_, payload = [] } = e.data as IEvent;
    const [resolve, reject] = resolvers.get(messageId) || [];
    if (type_ !== IMessageType.Error) {
        resolve?.(e);
    }
    else {
        reject?.(...payload);
    }
});

/**
 * 发送消息到指定的对象，并等待回应
 * @param target 接受消息的 window
 * @param message 消息的内容，需要包含一个唯一的消息 id 用来区分
 * @param timeout 消息的超时时间
 */
export const sendMessage = async <
    T extends Object,
    RE extends Pick<Window, 'postMessage'>,
    R = any
>(target: RE, message: IMessage<T>, timeout=20000) => {
    return new Promise((resolve, reject) => {
        let targetHandlers: Map<string | number, [Function, Function]> | undefined = handlers.get(target);
        if (!targetHandlers) {
            targetHandlers = new Map();
            handlers.set(target, targetHandlers);
        }
        const _timeout = setTimeout(() => {
            reject(`[send message] wait reply for message ${message.id} time out.`);
            targetHandlers?.delete(message.id);
        }, timeout);
        targetHandlers?.set(message.id, [
            (payload: R) => {
                resolve(payload);
                targetHandlers?.delete(message.id);
                clearTimeout(_timeout);
            },
            (error: Error) => {
                reject(error);
                targetHandlers?.delete(message.id);
                clearTimeout(_timeout);
            }
        ]);
        target.postMessage(message);
    });
};
