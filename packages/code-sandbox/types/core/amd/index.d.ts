import { IAmdModuleManagerContext } from './types';
export declare function createAmdManager(root?: string, scriptTimeout?: number, logger?: IAmdModuleManagerContext['logger']): {
    require_: import("./types").IRequireFunc;
    define: import("./types").IDefine;
    _import: any;
    set: ({ target, resolve: _resolve }: {
        target?: HTMLElement;
        resolve?: IAmdModuleManagerContext['require_']['resolveDeps'];
    }) => void;
    onModuleUpdate(targets: string[] | undefined, cb: (moduleNames: string[]) => void): () => void;
    onModuleLoading(cb: (moduleName: string, url: string) => void): () => void;
    mountToGlobal(global_?: Window & typeof globalThis): () => void;
};
export type IAmdManager = ReturnType<typeof createAmdManager>;
/**
 * 创建一个全局使用的默认 AMD 管理上下文
 */
export declare const defaultManager: {
    require_: import("./types").IRequireFunc;
    define: import("./types").IDefine;
    _import: any;
    set: ({ target, resolve: _resolve }: {
        target?: HTMLElement;
        resolve?: IAmdModuleManagerContext['require_']['resolveDeps'];
    }) => void;
    onModuleUpdate(targets: string[] | undefined, cb: (moduleNames: string[]) => void): () => void;
    onModuleLoading(cb: (moduleName: string, url: string) => void): () => void;
    mountToGlobal(global_?: Window & typeof globalThis): () => void;
};
export declare const define: import("./types").IDefine, require_: import("./types").IRequireFunc, onModuleUpdate: (targets: string[] | undefined, cb: (moduleNames: string[]) => void) => () => void, _import: any, mountToGlobal: (global_?: Window & typeof globalThis) => () => void;
