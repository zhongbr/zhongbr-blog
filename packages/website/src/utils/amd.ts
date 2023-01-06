export interface IModule {
    'default': any;
    [key: string]: any;
}

export type Factory = (__require: typeof _require) => Promise<IModule>;

const ModulesMap = new Map<string, Factory>();
const cache = new Map<string, IModule>();

export function define(moduleName: string, factory: Factory) {
    if (ModulesMap.has(moduleName)) {
        throw new Error(`[amd] module error: ${moduleName} has been used.`);
    }
    ModulesMap.set(moduleName, factory);
}

const generateModule = async (moduleName: string) => {
    if (cache.has(moduleName)) {
        return cache.get(moduleName);
    }
    const _module = await ModulesMap.get(moduleName)?.(_require);
    if (!_module) {
        throw new Error(`[amd] module error: ${moduleName} does not exist.`);
    }
    cache.set(moduleName, _module);
    return _module;
};

export async function _require(moduleNames: string | string[]) {
    if (Array.isArray(moduleNames)) {
        return Promise.all(moduleNames.map(moduleName => generateModule(moduleName)));
    }
    return generateModule(moduleNames);
}

_require.cache = cache;
