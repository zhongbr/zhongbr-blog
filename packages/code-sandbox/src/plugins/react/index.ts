import { BasePlugin } from '../types';

/**
 * 支持 引入 React 的垫片插件
 */
export class ReactPolyfill extends BasePlugin {
    constructor() {
        super();
        this.pluginId = 'react-polyfill';
    }

    async resolveModuleUrl(meta) {
        const { packageName } = meta;
        if (packageName.toLowerCase() === 'react') {
            meta.packageName = 'react';
            meta.file = '/umd/react.production.min.js';
        }
        if (packageName.toLowerCase().replace(/\W/g, '') === 'reactdom') {
            meta.packageName = 'react-dom';
            meta.file = '/umd/react-dom.production.min.js';
        }
        return meta;
    }
}
