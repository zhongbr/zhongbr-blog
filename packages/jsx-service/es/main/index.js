import { Event, EventTypeEnum } from '../types/worker.js';
export function getService(worker) {
    const resolvers = new Map([]);
    worker.onmessage = (event) => {
        var _a;
        const data = event.data;
        console.log('main, receive message', event);
        (_a = resolvers.get(data.EventId)) === null || _a === void 0 ? void 0 : _a(data);
    };
    console.log('---------- worker service bound ------------');
    return {
        transformJsxCode: (code, timeoutMs = 10000) => {
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
            });
        }
    };
}
//# sourceMappingURL=index.js.map