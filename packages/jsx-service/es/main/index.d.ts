import { IEvent, IJsxCodeTransformResp } from '../types/worker.js';
export declare function getService(worker: Worker): {
    transformJsxCode: (code: string, timeoutMs?: number) => Promise<IEvent<IJsxCodeTransformResp>>;
};
