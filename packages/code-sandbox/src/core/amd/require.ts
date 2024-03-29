import path from 'path-browserify';

import { IAmdModuleManagerContext, IRequireCtx, IRequireFunc, IModule, IEventTypes } from "./types";
import { IFile } from "../files-system/types";

type PromiseRes<T> = T extends Promise<infer P> ? P : unknown;

export default function bindRequireToCtx (ctx: IAmdModuleManagerContext) {
    const cache: IRequireFunc['cache'] = new Map();
    const factories: IRequireFunc['factories'] = new Map();
    const dependencies: IRequireFunc['dependencies'] = new Map();
    const moduleRequiringTasks: IRequireFunc['moduleRequiringTasks'] = new Map();

    const parseModuleName = function(moduleName: string): [string, string | undefined, string | undefined] {
        const [, name, version, file] = moduleName.match(/(^@?[^/@]+)(?:@([^/]+))?(.*)/) || [];
        return [name!, version, file];
    }

    const resolve: IRequireFunc['resolve'] = (moduleName, __filepath) => {
        if (['require', 'module', 'exports'].includes(moduleName)) {
            return moduleName;
        }
        if (path.isAbsolute(moduleName)) {
            return moduleName;
        }
        if (moduleName.startsWith('.')) {
            if (!__filepath) {
                throw new Error(`[amd] can't not resolve relative path ${moduleName} without __dirname`);
            }
            return path.resolve(path.dirname(__filepath), moduleName);
        }
        if (moduleName.startsWith('/')) {
            return path.resolve(ctx.root, moduleName);
        }
        const [modulePath] = parseModuleName(moduleName);
        return path.resolve(ctx.root, 'node_modules', modulePath!);
    };

    const resolveDeps = async (_packageName: string, _version: string, _file: string) => {
        const params = {
            packageName: _packageName,
            version: _version,
            file: _file
        };
        // 调用插件的 resolveModuleUrl 钩子
        const res = await ctx.pluginReduce(
            async (preValue, plugin) => {
                const res = await plugin.resolveModuleUrl(preValue as typeof params);
                if (typeof res === 'string') {
                    return {
                        result: res as unknown as typeof preValue,
                        break: true
                    };
                }
                return { result: res as typeof preValue };
            },
            params as string | typeof params
        );
        return res as string;
    };

    const moduleFactory = async (moduleName: string, _this: IRequireCtx): Promise<IModule | undefined> => {
        const modulePath = resolve(moduleName, _this.__dirname);

        // 检查本模块是否有其他的 require 任务正在运行，如果有直接等待第一个任务的结果，避免重复生成模块
        if (moduleRequiringTasks.has(modulePath)) {
            return await new Promise((resolve, reject) => {
                const tasks = moduleRequiringTasks.get(modulePath);
                tasks!.push([resolve, reject]);
                ctx.logger.log(`[amd] require ${moduleName}, already has task requiring, waiting tasks: ${tasks!.length}.`);
            });
        }
        ctx.logger.log('[amd] start require', modulePath);
        moduleRequiringTasks.set(modulePath, []);

        // 加载到模块后调用这个函数
        const clearAllTasks = (err: Error | undefined, module_?: IModule) => {
            // resolve 掉在加载过程中又触发的其他加载请求
            const tasks = moduleRequiringTasks.get(modulePath);
            if (tasks?.length) {
                tasks.forEach(([resolve, reject], index) => {
                    ctx.logger.log('[amd] resolve item', index, moduleName);
                    if (err) {
                        reject(err);
                    }
                    resolve(module_!);
                });
            }
            // 等到触发了其他任务的 resolve 后把 Error 抛出去
            moduleRequiringTasks.delete(modulePath);
            if (err) {
                throw err;
            }
            return module_!;
        }

        // 检查缓存，如果缓存中有直接取缓存里的
        if (cache.has(modulePath)) {
            ctx.logger.log(`[amd] require ${moduleName}, resolved from cache`);
            return clearAllTasks(undefined, cache.get(modulePath)!);
        }

        // 尝试获取模块的声明
        let factory = factories.get(modulePath);
        // 没有获取到的情况处理，会尝试自动解决依赖
        if (!factory) {
            // 对于不是本地模块的，尝试从远程加载模块
            if (!moduleName.startsWith('.') && !path.isAbsolute(moduleName)) {
                const [name, version, file] = parseModuleName(moduleName);
                const scriptUrl = await resolveDeps(name, version, file);
                // 分发加载模块的事件
                ctx.eventSubscribeManager.trigger(IEventTypes.LoadingScript, moduleName, scriptUrl);
                if (typeof scriptUrl === 'string') {
                    await ctx.scriptLoader.loadScript(document.body, scriptUrl, moduleName);
                    factory = factories.get(modulePath);
                    ctx.logger.log('[amd] script loaded', factory, modulePath);
                }
            }
            // 本地模块，尝试从 fs 里读取文件
            else {
                const [exist, file] = ctx.fs.pathReduce(modulePath);
                if (exist && Reflect.has(file, 'content')) {
                    const content = (file as IFile).content;
                    factories.set(modulePath, content);
                    factory = content;
                }
            }
            // 加载完后，仍然没有模块声明的，抛出异常
            if (!factory) {
                const err = new Error(`[amd] module error: ${modulePath} does not exist.`);
                return clearAllTasks(err);
            }
        }

        // 记录模块所有的依赖
        const moduleDeps: string[] = [];
        const requireCtx = { __dirname: modulePath, deps: moduleDeps };
        const require_ = getRequireFunc(requireCtx);
        // 这是声明时预先给定的依赖
        let depModuleNames = dependencies.get(modulePath);

        // 拿到声明后，开始调用插件的钩子，修改模块的依赖信息或者声明
        if (typeof factory === 'string') {
            const { deps: _depModuleNames, factory: factory_ } = await ctx.pluginReduce(async (preValue, plugin) => {
                const result = await plugin.beforeModuleGenerate(_this, preValue);
                return { result: { ...result, name: moduleName } };
            }, { name: moduleName, deps: depModuleNames, factory } as { name: string, deps?: string[]; factory: string; });
            factory = factory_ as typeof factory;
            depModuleNames = _depModuleNames;
        }

        // 拿到声明，开始生成模块，来一个 commonjs 三件套
        const _exports = {};
        const commonjs = {
            require: require_,
            module: { exports: _exports },
            exports: _exports
        };

        // 先加载模块的依赖，特殊处理 commonjs 的三个依赖
        let deps: IModule[] = [];
        if (depModuleNames?.length) {
            deps = await Promise.all(depModuleNames.map(depName => {
                if (commonjs[depName]) return commonjs[depName];
                return require_(depName);
            }));
        }

        try {
            // 执行 factory ，拿到模块
            let exportsReturn: IModule;
            if (typeof factory === 'string') {
                // eslint-disable-next-line no-eval
                exportsReturn = await eval(factory)(...deps);
            }
            else {
                exportsReturn = await factory(...deps);
            }

            // 分发模块的依赖事件
            ctx.eventSubscribeManager.trigger(IEventTypes.ModuleDeps, requireCtx);

            // 先判断 exports 对象是否挂载了内容，如果没有就使用 factory 的返回值
            const module_ = (() => {
                if (Object.keys(commonjs.module.exports).length || typeof commonjs.module.exports !== 'object') {
                    return commonjs.module.exports;
                }
                return exportsReturn;
            })() as IModule;

            cache.set(modulePath, module_);
            ctx.logger.log('[amd] resolve module tasks head', modulePath, module_);
            return clearAllTasks(undefined, module_);
        } catch (err) {
            return clearAllTasks(err as Error, undefined);
        }
    };

    const getRequireFunc = (_this: IRequireCtx): IRequireFunc => {
        return Object.assign(async (...args: Parameters<IRequireFunc>) => {
            const [moduleNames_, cb] = args;

            // 调用 插件 require 钩子，处理模块名称
            const moduleNames = await ctx.pluginReduce(async (preValue, plugin) => {
                return {
                    result: await plugin.require(_this, preValue)
                };
            }, moduleNames_);

            // 记录模块本次 require 的依赖
            if (typeof moduleNames === 'string') {
                _this.deps?.push(resolve(moduleNames, _this.__dirname));
            }
            else {
                _this.deps?.push(...moduleNames.reduce((previousValue, currentValue) => {
                    previousValue.push(resolve(currentValue, _this.__dirname));
                    return previousValue;
                },[]));
            }

            let modules: PromiseRes<ReturnType<IRequireFunc>>;
            if (Array.isArray(moduleNames)) {
                modules = await Promise.all(moduleNames.map(name => moduleFactory(name, _this)));
            }
            else {
                modules = await moduleFactory(moduleNames, _this);
            }
            cb?.(modules);
            return modules;
        }, {
            cache,
            factories,
            resolve,
            dependencies,
            moduleRequiringTasks,
            resolveDeps
        });
    };

    ctx.require = getRequireFunc({ __dirname: ctx.root });
}
