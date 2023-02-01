import { IBabelService, BabelServiceId } from "./type";
import { callProxy } from "../../../core/proxy";

let worker: Worker;

const serviceKeys: Array<keyof IBabelService> = ['jsx', 'esm2Amd'];
const service: IBabelService = serviceKeys.reduce((previousValue, currentValue) => {
    return {
        ...previousValue,
        [currentValue]: async (...args: unknown[]) => {
            if (!worker) {
                const BabelWorker = await import('./worker?worker&inline');
                worker = new BabelWorker.default();
            }
            return await callProxy<IBabelService>({
                win: worker,
                serviceId: BabelServiceId,
                method: currentValue,
                payload: args
            });
        }
    }
}, {} as IBabelService);

export default service;
