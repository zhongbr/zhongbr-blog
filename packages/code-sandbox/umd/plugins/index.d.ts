import { BasePlugin, IPlugin } from './types';
/**
 * 默认的兜底插件
 */
export declare class DefaultPlugin extends BasePlugin {
    constructor();
    resolveModuleUrl(meta: any): Promise<string>;
    beforeModuleGenerate(ctx: any, meta: any): Promise<any>;
}
export declare const registerPlugins: (_plugins: IPlugin[]) => string[];
export declare const getPlugins: () => string[];
