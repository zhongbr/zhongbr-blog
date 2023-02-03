import { IAmdModuleManagerContext } from './types';
import { IPlugin } from "../../plugins/types";
import { FilesSystem } from "../files-system";
export declare function createAmdManager(fs: FilesSystem, root?: string, scriptTimeout?: number, logger?: IAmdModuleManagerContext['logger']): {
    require_: import("./types").IRequireFunc;
    define: import("./types").IDefine;
    _import: any;
    onModuleUpdate(targets: string[] | undefined, cb: (moduleNames: string[]) => void): () => void;
    onModuleLoading(cb: (moduleName: string, url: string) => void): () => void;
    onModuleDeps(cb: (from: string[], to: string) => void): () => void;
    mountToGlobal(global_?: Window & typeof globalThis): () => void;
    setPlugins(plugins: IPlugin[]): void;
};
export declare type IAmdManager = ReturnType<typeof createAmdManager>;
