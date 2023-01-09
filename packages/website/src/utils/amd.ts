import React from "react";
import * as ReactNamespace from "react";
import ReactDOM from "react-dom";
import * as ReactDomNamespace from "react-dom";
import path from 'path-browserify';

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

export type Factory = (...modules: unknown[]) => Promise<IModule>;
export type DefineDispose = () => void;

export type IRequireCallback = (modules: IModule | (IModule | undefined)[] | undefined) => void;

export interface RequireFunc {
    (moduleNames: string[] | string, cb?: IRequireCallback): Promise<IModule | (IModule | undefined)[] | undefined>;
    cache: Map<string, IModule>;
    factories: Map<string, Factory | string>;
    resolve: (modulePath: string, __dirname?: string) => string;
}

export interface RequireContext {
    __dirname: string;
}

/**
 * 创建一个 AMD 模块管理对象，对外提供 define 和 _require 函数
 */
export function createAmdManager(baseDir = '/', scriptTimeout = 5000) {
    // 事件分发
    const eventSubscribeManager = createEventSubscribeManager();
    // 模块的声明
    const factories = new Map<string, Factory | string>();
    // 模块加载前的依赖信息
    const dependencies = new Map<string, string[]>();
    // 加载过的模块缓存
    const cache = new Map<string, IModule>();
    // 加载中的模块
    const loading = new Map<string, [Function, Function][]>();
    // 加载中的模块的名称，供匿名模块使用
    let loadingModuleName = '';
    const waitingModuleQueue: Function[] = [];

    const loadScript = async (dom: HTMLElement, url: string, moduleName = 'globalObj') => {
        // 由于有可能存在匿名模块，为了能区分开这些模块，一次只能加载一个脚本
        if (loadingModuleName) {
            await new Promise(resolve => waitingModuleQueue.push(resolve));
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.onload = () => {
                resolve(null);
                loadingModuleName = '';
                // 加载下一个脚本
                waitingModuleQueue.shift()?.();
            }

            script.onerror = (err) => {
                reject(err);
                loadingModuleName = '';
                // 加载下一个脚本
                waitingModuleQueue.shift()?.();
            }

            // 设置一个超时时间
            setTimeout(() => {
                reject(new Error(`load module ${moduleName} timeout`));
                // 加载下一个脚本
                waitingModuleQueue.shift()?.();
            }, scriptTimeout);

            script.crossOrigin = 'anonymous';
            script.src = url;
            script.type = 'text/javascript';

            loadingModuleName = moduleName;
            dom.appendChild(script);
        });
    }

    // 解析模块名称
    const parseModuleName = function(moduleName: string): [string, string | undefined, string | undefined] {
        const [, name, version, file] = moduleName.match(/(^@?[^/@]+)(?:@([^/]+))?(.*)/) || [];
        return [name!, version, file];
    }

    // 获取本地不存在的依赖的 url 的方法
    let resolveDeps = async function (packageName: string, version?: string, file?: string): Promise<string | boolean> {
        const versionSuffix = version ? `@${version}` : '';
        const fileSuffix = file ? `${file}` : '';
        // `return false` to cancel auto require deps.
        return `https://unpkg.com/${packageName}${versionSuffix}${fileSuffix}`;
    }

    // 本地插入脚本时的目标 dom
    let insertScriptTarget: HTMLElement = document.body;

    /**
     * 计算相对路径
     * @param modulePath_ 模块的路径
     * @param __dirname 当前的模块路径
     */
    function resolve(modulePath_: string, __dirname?: string): string {
        const [modulePath] = parseModuleName(modulePath_);
        if (path.isAbsolute(modulePath!)) {
            return modulePath!;
        }
        if (modulePath!.startsWith('.')) {
            if (!__dirname) {
                throw new Error(`[amd] can't not resolve relative path ${modulePath} without __dirname`);
            }
            return path.resolve(__dirname, modulePath!);
        }
        return path.resolve(baseDir, 'node_modules', modulePath!);
    }

    function _getRequireFunc(requireCtx: RequireContext): RequireFunc {
        return Object.assign(requirePrototype.bind(null, requireCtx), {
            factories: requirePrototype.factories,
            cache: requirePrototype.cache,
            resolve: requirePrototype.resolve
        });
    }


    function define(factory: Factory | string): DefineDispose;
    function define(dependencies_: string[], factory: Factory | string): DefineDispose;
    function define(moduleName: string, dependencies_: string[], factory: Factory | string): DefineDispose;
    function define(moduleName: string | Array<string> | Factory, dependencies_?: Factory | string | string[], factory?: Factory | string): DefineDispose {
        if (typeof moduleName === 'function') {
            factory = moduleName;
            dependencies_ = [];
            moduleName = loadingModuleName;
        }
        if (Array.isArray(moduleName)) {
            factory = dependencies_ as (Factory | string);
            dependencies_ = moduleName;
            moduleName = loadingModuleName;
        }
        const modulePath = resolve(moduleName);
        if (factories.has(modulePath)) {
            factories.delete(modulePath);
        }
        if (cache.has(modulePath)) {
            cache.delete(modulePath);
        }
        if (dependencies.has(modulePath)) {
            dependencies.delete(modulePath);
        }
        // 通知该模块的更新
        eventSubscribeManager.trigger('update', modulePath);
        factories.set(modulePath, factory!);
        dependencies.set(modulePath, dependencies_ as string[]);
        return () => {
            factories.delete(modulePath);
        }
    }

    /**
     * 调用生成模块
     * @param moduleName 模块的标识
     * @param callerModuleThis 调用模块的上下文信息
     */
    const generateModule = async (moduleName: string, callerModuleThis: RequireContext) => {
        // 初始化 service
        if (!service) {
            service = getService(new Worker(worker));
        }

        // 计算模块的绝对路径
        const modulePath = resolve(moduleName, callerModuleThis?.__dirname);
        if (cache.has(modulePath)) {
            return cache.get(modulePath);
        }

        const requireCtx: RequireContext = { __dirname: modulePath };
        const requireFunc = _getRequireFunc(requireCtx);

        // 尝试从模块声明的 Map 里读取
        let factory = factories.get(modulePath);
        if (!factory) {
            // 如果不是绝对路径或者相对路径，且本地没有，先尝试自动引入依赖，并调用其 factory
            if (!moduleName.startsWith('.') && !path.isAbsolute(moduleName)) {
                // 没有加载中，开始加载
                if (!loading.get(modulePath)) {
                    // 加载中的脚本，加个标志
                    loading.set(modulePath, []);
                    const [name, version, file] = parseModuleName(moduleName);
                    const scriptUrl = await resolveDeps(name, version, file);
                    // 成功获取到链接之后，就动态导入该脚本
                    if (typeof scriptUrl === 'string') {
                        // 先插入脚本
                        await loadScript(insertScriptTarget, scriptUrl, moduleName);
                        // 重新读取 factory
                        factory = factories.get(modulePath);
                    }
                    // 将加载期间的其他 require 调用的 resolve 也调用了
                    const queue = loading.get(modulePath);
                    loading.delete(modulePath);
                    queue?.forEach(([resolve, reject]) => {
                        !!factory ? resolve(factory) : reject();
                    });
                }
                // 否则等待加载中的任务完成，避免重复加载
                else {
                    factory = await new Promise((resolve, reject) => loading.get(modulePath)?.push([resolve, reject]));
                }
            }
            // 如果仍然没有 factory ，报错
            if (!factory) {
                throw new Error(`[amd] module error: ${modulePath} does not exist.`);
            }
        }

        const depModuleNames = dependencies.get(modulePath);
        let deps: IModule[] = [];
        // 先请求所有的依赖模块
        if (depModuleNames?.length) {
            deps = await requireFunc(depModuleNames) as IModule[];
        }

        let exportsReturn: IModule;

        if (typeof factory === 'string') {
            const res = await service.transformJsxCode(factory);
            if (!res.params.code) {
                throw new Error(`[amd] module error: ${modulePath} failed to compile code`);
            }
            // eslint-disable-next-line no-eval
            exportsReturn = await eval(res.params.code)(...deps);
        }
        else {
            exportsReturn = await factory(...deps);
        }
        cache.set(modulePath, exportsReturn);
        return exportsReturn;
    };

    /**
     * 导入模块
     * @param ctx require 的上下文，包含有调用方的信息
     * @param moduleNames 模块的标识
     */
    async function requirePrototype(ctx: RequireContext, moduleNames: string | string[], cb?: IRequireCallback) {
        let modules: IModule | (IModule | undefined)[] | undefined;
        if (Array.isArray(moduleNames)) {
            modules = await Promise.all(moduleNames.map(moduleName => generateModule(moduleName, ctx)));
        }
        else {
            modules = await generateModule(moduleNames, ctx);
        }
        cb?.(modules);
        return modules;
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

    /**
     * 导入挂载对象到全局的脚本
     * @param target
     * @param url
     * @param name
     */
    function importGlobalObjectScript(target: HTMLElement, url: string, name: string): Factory {
        // 返回一个导入脚本的异步函数作为模块的声明
        return async (_require) => {
            await loadScript(target, url);
            return {
                'default': Reflect.get(window, name),
                ...Reflect.get(window, name)
            };
        };
    }

    let unmountFromGlobal: () => void = () => {};
    /**
     * 将当前 AMD 模块上下文挂载到全局
     */
    function mountToGlobal() {
        const currentDefine = Reflect.get(window, 'define');
        const currentRequire = Reflect.get(window, 'require');

        Reflect.set(window, 'define', define);
        Reflect.set(window, 'require', require_);

        unmountFromGlobal = () => {
            Reflect.set(window, 'define', currentDefine);
            Reflect.set(window, 'require', currentRequire);
        };
        return unmountFromGlobal;
    }

    requirePrototype.cache = cache;
    requirePrototype.factories = factories;
    requirePrototype.resolve = resolve;

    // 基准的 require 上下文
    const baseRequireCtx = {
        __dirname: baseDir
    };
    const require_ = _getRequireFunc(baseRequireCtx);

    // 在 define 函数上挂载一个 amd 属性，支持标准 amd API
    Reflect.set(define, 'amd', {});

    // 默认导入 react AMD 模块，供内部 JSX 调用
    define('react', [], async () => {
        return {
            'default': React,
            ...ReactNamespace
        };
    });
    define('react-dom', [], async () => {
        return {
            'default': ReactDOM,
            ...ReactDomNamespace
        };
    });
    define('require', [], async () => {
        return Object.assign(require_, {
            default: require_
        });
    });

    return {
        require_,
        define,
        onModuleUpdate,
        _import: importGlobalObjectScript.bind(null, insertScriptTarget),
        mountToGlobal,
        unmountFromGlobal,
        set: ({ target, resolve: _resolve }: { target?: HTMLElement, resolve?: typeof resolveDeps; }) => {
            if (_resolve) {
                resolveDeps = _resolve;
            }
            if (target) {
                insertScriptTarget = target;
            }
        }
    };
}

export type IAmdManager = ReturnType<typeof createAmdManager>;

/**
 * 创建一个全局使用的默认 AMD 管理上下文
 */
export const defaultManager = createAmdManager();
export const { define, require_, onModuleUpdate, _import, mountToGlobal } = defaultManager;
