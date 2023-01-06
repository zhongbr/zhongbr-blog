import { Event, EventTypeEnum, IEvent, IJsxCodeTransformResp } from '../types/worker.js';

export function getService(worker: Worker) {
    const resolvers = new Map<Event['EventId'], Function>([]);
    worker.onmessage = (event) => {
        const data = event.data as IEvent;
        resolvers.get(data.EventId)?.(data);
    };

    console.log('---------- worker service bound ------------');
    console.log(worker, resolvers);

    return {
        transformJsxCode: (code: string, timeoutMs=10000): Promise<IEvent<IJsxCodeTransformResp>> => {
            return new Promise((resolve, reject) => {
                const event = new Event({
                    EventType: EventTypeEnum.JsxCodeTransform,
                    params: {
                        code
                    }
                });

                resolvers.set(event.EventId, resolve);
                worker.postMessage(event);

                setTimeout(() => {
                    reject();
                    resolvers.delete(event.EventId);
                }, timeoutMs);
            })
        }
    }
}
