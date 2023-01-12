import { IAmdModuleManagerContext } from "./types";
import { IDefineDispose, IDefine, Factory, IEventTypes } from "./types";

export default function bindDefineToCtx(ctx: IAmdModuleManagerContext) {
    function define(factory: Factory | string): IDefineDispose;
    function define(dependencies_: string[], factory: Factory | string): IDefineDispose;
    function define(moduleName: string, dependencies_: string[], factory: Factory | string): IDefineDispose;
    function define(moduleName: string | Array<string> | Factory, dependencies_?: Factory | string | string[], factory?: Factory | string): IDefineDispose {
        if (typeof moduleName === 'function') {
            factory = moduleName;
            dependencies_ = ['require', 'exports', 'module'];
            moduleName = ctx.scriptLoader.getLoadingModuleName();
        }
        if (Array.isArray(moduleName)) {
            factory = dependencies_ as (Factory | string);
            dependencies_ = moduleName;
            moduleName = ctx.scriptLoader.getLoadingModuleName();
        }
        console.log('[amd] define module', moduleName, dependencies_);

        const modulePath = ctx.require_.resolve(moduleName);
        const { factories, cache, dependencies } = ctx.require_;

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
        ctx.eventSubscribeManager.trigger(IEventTypes.ModuleUpdate, modulePath);
        factories.set(modulePath, factory!);
        dependencies.set(modulePath, dependencies_ as string[]);
        return () => {
            console.log('[amd] module dispose', moduleName);
            factories.delete(modulePath);
        }
    }

    ctx.define = Object.assign(define, {
        amd: {}
    }) as IDefine;
}
