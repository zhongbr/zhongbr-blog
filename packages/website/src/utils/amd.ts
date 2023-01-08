import React from "react";
import * as ReactNamespace from "react";
import { getService } from 'jsx-service';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'worker!@/jsx-service.worker.js';

import { createEventSubscribeManager } from './event-subscribe';

let service: ReturnType<typeof getService>;

export interface IModule {
    'default': any;
    [key: string]: any;
}

export type Factory = (_require: RequireFunc) => Promise<IModule>;

export interface RequireFunc {
    (moduleNames: string[] | string): Promise<IModule | (IModule | undefined)[] | undefined>;
    cache: Map<string, IModule>;
    factories: Map<string, Factory | string>;
}

/**
 * 创建一个 AMD 模块管理对象，对外提供 define 和 _require 函数
 */
export function createAmdManager() {
    const eventSubscribeManager = createEventSubscribeManager();
    const factories = new Map<string, Factory | string>();
    const cache = new Map<string, IModule>();

    /**
     * 声明一个模块
     * @param moduleName 模块的名称
     * @param factory 生成模块的函数，或者字符串
     */
    function define(moduleName: string, factory: Factory | string) {
        if (factories.has(moduleName)) {
            factories.delete(moduleName);
        }
        if (cache.has(moduleName)) {
            cache.delete(moduleName);
        }
        // 通知该模块的更新
        eventSubscribeManager.trigger('update', moduleName);
        factories.set(moduleName, factory);
        return () => {
            factories.delete(moduleName);
        }
    }

    /**
     * 调用生成模块
     * @param moduleName 模块的标识
     */
    const generateModule = async (moduleName: string) => {
        // 初始化 service
        if (!service) {
            service = getService(new Worker(worker));
        }
        if (cache.has(moduleName)) {
            return cache.get(moduleName);
        }
        const factory = await factories.get(moduleName);
        if (!factory) {
            throw new Error(`[amd] module error: ${moduleName} does not exist.`);
        }
        let _module: IModule;
        if (typeof factory === 'string') {
            const res = await service.transformJsxCode(factory);
            if (!res.params.code) {
                throw new Error(`[amd] module error: ${moduleName} failed to compile code`);
            }
            // eslint-disable-next-line no-eval
            _module = await eval(res.params.code)(_require);
        }
        else {
            _module = await factory(_require);
        }
        cache.set(moduleName, _module);
        return _module;
    };

    /**
     * 导入模块
     * @param moduleNames 模块的标识
     */
    async function _require(moduleNames: string | string[]) {
        if (Array.isArray(moduleNames)) {
            return Promise.all(moduleNames.map(moduleName => generateModule(moduleName)));
        }
        return generateModule(moduleNames);
    }

    /**
     * 监听模块更新
     * @param targets 要监听的模块
     * @param cb 回调函数
     */
    function onModuleUpdate(targets: string[] | undefined, cb: (moduleNames: string[]) => void) {
        return  eventSubscribeManager.listen('update', (moduleName) => {
            if(!targets || targets.includes(moduleName as string)) {
                cb([moduleName as string]);
            }
        });
    }

    function importScript(url: string, objectName: string, target: HTMLElement) {
        return () => new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.onload = () => {
                resolve({ 'default': Reflect.get(window, objectName), ...Reflect.get(window, objectName) });
            }

            script.onerror = () => {
                reject(new Error('import script failed'));
            }

            script.crossOrigin = 'anonymous';
            script.src = url;
            script.type = 'text/javascript';

            target.appendChild(script);
        });
    }

    _require.cache = cache;
    _require.factories = factories;

    // 默认导入 react AMD 模块，供内部 JSX 调用
    define('react', async () => ({
        'default': React,
        ...ReactNamespace
    }));

    return { _require, define, onModuleUpdate, importScript };
}

export type IAmdManager = ReturnType<typeof createAmdManager>;

/**
 * 创建一个全局使用的默认 AMD 管理上下文
 */
export const defaultManager = createAmdManager();
export const { define, _require, onModuleUpdate, importScript } = defaultManager;
