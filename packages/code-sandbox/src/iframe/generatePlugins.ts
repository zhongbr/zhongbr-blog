import { callProxy, waitProxy } from '../core/proxy';
import { IPlugin } from '../plugins/types';

/**
 * 由于 plugin 是在调用端声明的，iframe 与其需要通过 postMessage 来通信
 * @param pluginsServiceId
 */
export function generatePlugins(pluginsServiceId: string[]): IPlugin[] {
    const parent = window.parent || window.top || window.opener;

    const generateMethod = (key: keyof IPlugin, serviceId: string) => async (...args) => {
        await waitProxy(parent, serviceId);
        return await callProxy<IPlugin>({
            win: parent,
            serviceId,
            method: key,
            payload: args
        });
    }

    return pluginsServiceId.map(serviceId => {
        const keys: Array<keyof IPlugin> = ['require', 'beforeModuleGenerate', 'resolveModuleUrl'];
        return keys.reduce((pre, key) => {
            return {
                ...pre,
                [key]: generateMethod(key, serviceId)
            };
        }, {} as IPlugin);
    });
}
