import path from 'path-browserify';
import { getService } from 'jsx-service';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'worker!@/jsx-service.worker.js';

import { PromiseRes } from "@/types/utils";
import { IAmdModuleManagerContext, IRequireCtx, IRequireFunc, IModule, IEventTypes } from "./types";

let service: ReturnType<typeof getService>;

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
        const [modulePath] = parseModuleName(moduleName);
        return path.resolve(ctx.root, 'node_modules', modulePath!);
    };

    const resolveDeps: IRequireFunc['resolveDeps'] = async (packageName, version, file) => {
        const versionSuffix = version ? `@${version}` : '';
        let file_ = file;
        // React and React dom doesn't specific `unpkg` filed in `package.json`,
        // set umd path manually.
        if (['react', 'react-dom'].includes(packageName) && !file_) {
            file_ = `/umd/${packageName}.production.min.js`;
        }
        const fileSuffix = file_ ? `${file_}` : '';
        // `return false` to cancel auto require deps.
        return `https://unpkg.com/${packageName}${versionSuffix}${fileSuffix}`;
    };

    const moduleFactory = async (moduleName: string, _this: IRequireCtx): Promise<IModule | undefined> => {
        if (!service) service = getService(new Worker(worker));

        const modulePath = resolve(moduleName, _this.__dirname);

        // 检查本模块是否有其他的 require 任务正在运行，如果有直接等待第一个任务的结果，避免重复生成模块
        if (moduleRequiringTasks.has(modulePath)) {
            return await new Promise((resolve, reject) => {
                const tasks = moduleRequiringTasks.get(modulePath);
                tasks!.push([resolve, reject]);
                console.log(`[amd] require ${moduleName}, already has task requiring, waiting tasks: ${tasks!.length}.`);
            });
        }
        console.log('[amd] start require', modulePath);
        moduleRequiringTasks.set(modulePath, []);

        // 加载到模块后调用这个函数
        const clearAllTasks = (err: Error | undefined, module_?: IModule) => {
            // resolve 掉在加载过程中又触发的其他加载请求
            const tasks = moduleRequiringTasks.get(modulePath);
            if (tasks?.length) {
                tasks.forEach(([resolve, reject], index) => {
                    console.log('[amd] resolve item', index, moduleName);
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
            console.log(`[amd] require ${moduleName}, resolved from cache`);
            return clearAllTasks(undefined, cache.get(modulePath)!);
        };

        const require_ = getRequireFunc({ __dirname: modulePath });

        // 尝试获取模块的声明
        let factory = factories.get(modulePath);
        // 没有获取到的情况处理，会尝试自动解决依赖
        if (!factory) {
            // 对于不是本地模块的，先尝试自动加载依赖
            if (!moduleName.startsWith('.') && !moduleName.startsWith('__') && !path.isAbsolute(moduleName)) {
                const [name, version, file] = parseModuleName(moduleName);
                const scriptUrl = await require_.resolveDeps(name, version, file);
                // 分发加载模块的事件
                ctx.eventSubscribeManager.trigger(IEventTypes.LoadingScript, moduleName, scriptUrl);
                if (typeof scriptUrl === 'string') {
                    await ctx.scriptLoader.loadScript(ctx.scriptContainerDom, scriptUrl, moduleName);
                    factory = factories.get(modulePath);
                    console.log('[amd] script loaded', factory, modulePath);
                }
            }
            // 加载完后，仍然没有模块声明的，抛出异常
            if (!factory) {
                const err = new Error(`[amd] module error: ${modulePath} does not exist.`);
                return clearAllTasks(err);
            }
        }

        // 拿到声明，开始生成模块，来一个 commonjs 三件套
        const _exports = {};
        const commonjs = {
            require: require_,
            module: { exports: _exports },
            exports: _exports
        };

        // 先加载模块的依赖，特殊处理 commonjs 的三个依赖
        const depModuleNames = dependencies.get(modulePath);
        let deps: IModule[] = [];
        if (depModuleNames?.length) {
            // 从依赖中剔除掉 commonjs 的三件套，这三个不是一般的模块，记录三个对象的位置
            const [indexes, depsNames] = depModuleNames?.reduce(([indexes, depsNames], item, index) => {
                if (Object.keys(commonjs).includes(item)) {
                    return [Object.assign(indexes, { [item]: index }), depsNames];
                }
                return [indexes, depsNames.concat(item)];
            }, [{}, [] as string[]])
            deps = await require_(depsNames) as IModule[];
            // 把 commonjs 三件套按照原来的位置放回去
            Object.entries(indexes).forEach(([dep, index]) => {
                // @ts-ignore
                deps = [...deps.slice(0, index - 1), commonjs[dep], ...deps.slice(index)];
            });
        }

        try {
            // 执行 factory ，拿到模块
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

            // 先判断 exports 对象是否挂载了内容，如果没有就使用 factory 的返回值
            const module_ = (() => {
                if (Object.keys(commonjs.exports).length) {
                    return commonjs.exports;
                }
                if (Object.keys(commonjs.module.exports).length) {
                    return commonjs.module.exports;
                }
                return exportsReturn;
            })() as IModule;
            cache.set(modulePath, module_);
            console.log('[amd] resolve module tasks head', modulePath, module_);
            return clearAllTasks(undefined, module_);
        } catch (err) {
            return clearAllTasks(err as Error, undefined);
        }
    };

    const requireProto= async (_this: IRequireCtx, ...args: Parameters<IRequireFunc>) => {
        const [moduleNames, cb] = args;
        let modules: PromiseRes<ReturnType<IRequireFunc>>;
        if (Array.isArray(moduleNames)) {
            modules = await Promise.all(moduleNames.map(name => moduleFactory(name, _this)));
        }
        else {
            modules = await moduleFactory(moduleNames, _this);
        }
        cb?.(modules);
        return modules;
    };

    const getRequireFunc = (_this: IRequireCtx): IRequireFunc => {
        return Object.assign(requireProto.bind(null, _this), {
            cache,
            factories,
            resolve,
            dependencies,
            moduleRequiringTasks,
            // 这么取值是为了可以从外部覆盖掉 resolveDeps 的逻辑
            resolveDeps: ctx?.require_?.resolveDeps || resolveDeps
        });
    };

    ctx.require_ = getRequireFunc({ __dirname: ctx.root });
}
