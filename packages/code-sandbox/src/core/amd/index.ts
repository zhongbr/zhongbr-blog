import bindScriptLoaderToCtx from './scriptLoader';
import bindDefineToCtx from "./define";
import bindRequireToCtx from "./require";
import { IAmdModuleManagerContext, IEventTypes } from './types';
import { createEventSubscribeManager } from "../event";
import { Factory } from "./types";
import { IPlugin } from "../../plugins/types";

export function createAmdManager(root='/', scriptTimeout=10000, logger: IAmdModuleManagerContext['logger'] = console) {
    const ctx = {} as IAmdModuleManagerContext;
    ctx.eventSubscribeManager = createEventSubscribeManager();
    ctx.root = root;
    ctx.scriptTimeout = scriptTimeout;
    ctx.scriptContainerDom = document.body;
    ctx.logger = logger;
    ctx.plugins = [];
    // 遍历插件的方法
    ctx.pluginReduce = async (reducer, initValue) => {
        let result: any = initValue;
        for (const plugin of ctx.plugins) {
            const { result: res, break: break_ } = await reducer(result, plugin);
            if (break_) {
                return res;
            }
            result = res;
        }
        return result;
    };

    bindRequireToCtx(ctx);
    bindDefineToCtx(ctx);
    bindScriptLoaderToCtx(ctx);

    function importGlobalObjectScript(target: HTMLElement, url: string, name: string): Factory {
        // 返回一个导入脚本的异步函数作为模块的声明
        return async (_require) => {
            await ctx.scriptLoader.loadScript(target, url);
            return {
                'default': Reflect.get(window, name),
                ...Reflect.get(window, name)
            };
        };
    }

    const module_ = {
        require_: ctx.require_,
        define: ctx.define,
        _import: importGlobalObjectScript.bind(null, ctx.scriptContainerDom),
        set: ({ target, resolve: _resolve }: { target?: HTMLElement, resolve?: IAmdModuleManagerContext['require_']['resolveDeps']; }) => {
            if (_resolve) {
                ctx.require_.resolveDeps = _resolve;
            }
            if (target) {
                ctx.scriptContainerDom = target;
            }
        },
        onModuleUpdate(targets: string[] | undefined, cb: (moduleNames: string[]) => void) {
            return ctx.eventSubscribeManager.listen(IEventTypes.ModuleUpdate, (moduleName) => {
                if(!targets || targets.includes(moduleName as string)) {
                    cb([moduleName as string]);
                }
            });
        },
        onModuleLoading(cb: (moduleName: string, url: string) => void) {
            return ctx.eventSubscribeManager.listen(IEventTypes.LoadingScript, (moduleName, url) => {
                cb(moduleName as string, url as string);
            });
        },
        mountToGlobal(global_ = window) {
            const currentDefine = Reflect.get(global_, 'define');
            const currentRequire = Reflect.get(global_, 'require');

            Reflect.set(global_, 'define', ctx.define);
            Reflect.set(global_, 'require', ctx.require_);

            return () => {
                Reflect.set(global_, 'define', currentDefine);
                Reflect.set(global_, 'require', currentRequire);
            };
        },
        setPlugins(plugins: IPlugin[]) {
            ctx.plugins = plugins;
        }
    };

    ctx.define('module-manager', [], async () => ({
        default: module_,
        ...module_
    }));

    return module_;
}

export type IAmdManager = ReturnType<typeof createAmdManager>;

/**
 * 创建一个全局使用的默认 AMD 管理上下文
 */
export const defaultManager = createAmdManager();
export const { define, require_, onModuleUpdate, _import, mountToGlobal } = defaultManager;
