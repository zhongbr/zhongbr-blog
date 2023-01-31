import { IPlugin } from '../plugins/types';
/**
 * 由于 plugin 是在调用端声明的，iframe 与其需要通过 postMessage 来通信
 * @param pluginsServiceId
 */
export declare function generatePlugins(pluginsServiceId: string[]): IPlugin[];
