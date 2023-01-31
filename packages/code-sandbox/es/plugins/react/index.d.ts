import { BasePlugin } from '../types';
/**
 * 支持 引入 React 的垫片插件
 */
export declare class ReactPolyfill extends BasePlugin {
    constructor();
    resolveModuleUrl(meta: any): Promise<any>;
}
