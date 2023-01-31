import BabelWorker from './worker?worker&inline';
import { IBabelService, BabelServiceId } from "./type";
import { callProxy } from "../../../core/proxy";

const worker = new BabelWorker();

const serviceKeys: Array<keyof IBabelService> = ['jsx', 'esm2Amd'];
const service: IBabelService = serviceKeys.reduce((previousValue, currentValue) => {
    return {
        ...previousValue,
        [currentValue]: async (...args: unknown[]) => {
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
