import { createEventSubscribeManager } from "../event";
import { IPlugin } from "../../plugins/types";
import { FilesSystem } from "../files-system";

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
    deps?: string[];
}
export type IRequireCallback = (modules: IModule | undefined | (IModule | undefined)[]) => void;

export interface IRequireFunc {
    (names: string[] | string, cb?: IRequireCallback): Promise<IModule | undefined | (IModule | undefined)[]>;
    cache: Map<string, IModule>;
    factories: Map<string, Factory | string>;
    dependencies: Map<string, string[]>;
    resolve: (moduleName: string, __dirname?: string) => string;
    moduleRequiringTasks: Map<string, [resolve: Function, reject: Function][]>;
}

export interface IDefine {
    (moduleName: string | Array<string> | Factory, dependencies_?: Factory | string | string[], factory?: Factory | string): IDefineDispose;
    amd: any;
}

export type IDefineDispose = () => void;

export interface IAmdModuleManagerContext {
    fs: FilesSystem;
    root: string;
    scriptTimeout: number;
    /**
     * 事件触发
     */
    eventSubscribeManager: ReturnType<typeof createEventSubscribeManager<IEventTypes>>;
    scriptLoader: IScriptLoader;
    define: IDefine;
    require: IRequireFunc;
    logger: Pick<Console, 'log' | 'info' | 'debug' | 'error' | 'warn'>;
    plugins: IPlugin[];
    pluginReduce: <T=any>(reducer: (preValue: T, plugin: IPlugin) => Promise<{ result: T, break?: boolean; }>, initValue: T) => Promise<T>;
}

export enum IEventTypes {
    ModuleUpdate = 'module-update',
    LoadingScript = 'loading-script',
    ModuleDeps = 'module-deps',
}
