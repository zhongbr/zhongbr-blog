import React from "react";
import * as ReactNamespace from "react";
import { getService } from 'jsx-service';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'worker!@/jsx-service.worker.js';

import { useMessage } from '@/components';

const service = getService(new Worker(worker));
let message: ReturnType<typeof useMessage>;

export function useInitAmd() {
    message = useMessage();
}

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
            try {
                // eslint-disable-next-line no-eval
                _module = await eval(res.params.code)(_require);
            }
            catch (e) {
                message.fail({
                    title: '运行出错',
                    content: 'Demo代码执行出错，具体请查看 F12 控制台'
                });
                return;
            }
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

    _require.cache = cache;
    _require.factories = factories;

    // 默认导入 react AMD 模块，供内部 JSX 调用
    define('react', async () => ({
        'default': React,
        ...ReactNamespace
    }));

    return { _require, define };
}

/**
 * 创建一个全局使用的默认 AMD 管理上下文
 */
export const { define, _require } = createAmdManager();
