import { registerProxy } from '../core/proxy';
import { BasePlugin, IPlugin } from './types';

let pluginsId: string[] = [];

/**
 * 默认的兜底插件
 */
export class DefaultPlugin extends BasePlugin {
    constructor() {
        super();
        this.pluginId = 'default-plugin';
    }

    async resolveModuleUrl(meta) {
        const { packageName, version, file } = meta;
        const versionSuffix = version ? `@${version}` : '';
        const fileSuffix = file ? `${file}` : '';
        // `return false` to cancel auto require deps.
        return `https://unpkg.com/${packageName}${versionSuffix}${fileSuffix}`;
    }

    async beforeModuleGenerate(ctx, meta) {
        // 把代码段包装为函数
        meta.factory = `async (require, exports, module) => {\n${meta.factory}\n}`;
        meta.deps = ['require', 'exports', 'module'];
        return meta;
    }
}

export const registerPlugins = (_plugins: IPlugin[]) => {
    const plugins = _plugins.concat(new DefaultPlugin());
    plugins.forEach(plugin => {
        registerProxy(plugin.pluginId, plugin);
    });
    pluginsId = plugins.map(plugin => plugin.pluginId);
    return pluginsId;
};

export const getPlugins = () => {
    return pluginsId;
}
