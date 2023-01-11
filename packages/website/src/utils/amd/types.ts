import { createEventSubscribeManager } from "../event-subscribe";

export interface IModule {
    'default': any;
    [key: string]: any;
}

export type Factory = (...modules: unknown[]) => Promise<IModule>;

export interface IScriptLoadTask {
    (...args: any): void;
    moduleName: string;
}

export interface IScriptLoader {
    getLoadingModuleName: () => string;
    scriptLoadingTasks: Array<IScriptLoadTask>;
    loadScript: (dom: HTMLElement, url: string, moduleName?: string) => Promise<unknown>;
}

export interface IRequireCtx {
    __dirname: string;
}
export type IRequireCallback = (modules: IModule | undefined | (IModule | undefined)[]) => void;

export interface IRequireFunc {
    (names: string[] | string, cb?: IRequireCallback): Promise<IModule | undefined | (IModule | undefined)[]>;
    cache: Map<string, IModule>;
    factories: Map<string, Factory | string>;
    dependencies: Map<string, string[]>;
    resolve: (moduleName: string, __dirname?: string) => string;
    resolveDeps: (name: string, version?: string, path?: string) => Promise<string | boolean>;
    moduleRequiringTasks: Map<string, [resolve: Function, reject: Function][]>;
}

export type IDefineDispose = () => void;

export interface IAmdModuleManagerContext {
    root: string;
    scriptContainerDom: HTMLElement;
    scriptTimeout: number;
    /**
     * 事件触发
     */
    eventSubscribeManager: ReturnType<typeof createEventSubscribeManager>;
    scriptLoader: IScriptLoader;
    define(moduleName: string | Array<string> | Factory, dependencies_?: Factory | string | string[], factory?: Factory | string): IDefineDispose;
    require_: IRequireFunc;
}

export enum IEventTypes {
    ModuleUpdate = 'module-update',
    LoadingScript = 'loading-script'
}
