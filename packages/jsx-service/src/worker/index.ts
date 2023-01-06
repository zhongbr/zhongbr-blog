import { JsxCodeTransformHandler } from '../jsx-core/index.js';
import { EventTypeEnum, Event, IEvent, Handler } from '../types/worker.js';

const handlers = new Map<EventTypeEnum, Handler>([
    [EventTypeEnum.JsxCodeTransform, JsxCodeTransformHandler]
]);

export const startJsxServiceWorker = () => {
    console.log('-------------🚀 jsx service worker started --------------');
    onmessage = async function (e) {
        console.log('---------- receive message -----------');
        console.log(e);
        const event = new Event(e.data);
        event.reply(await handlers.get(event.EventType)?.(event));
    };
};
