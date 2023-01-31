import { IRequireCtx } from '../core/amd/types';
/**
 * 依赖元数据
 */
export interface IResolveModuleMeta {
    packageName: string;
    version?: string;
    file?: string;
}
export interface IDefineModuleMeta {
    name: string;
    deps?: string[];
    factory: string;
}
export interface IPlugin {
    pluginId: string;
    /**
     * 确定依赖的引用地址钩子
     * @param meta 依赖的元数据信息
     * @return result 元数据信息或者依赖的地址，返回地址时，会直接短路，后续插件的本钩子将不再执行
     */
    resolveModuleUrl: (meta: IResolveModuleMeta) => Promise<string | IResolveModuleMeta>;
    /**
     * 引用模块之前的钩子，可以用于将对 A 的 require 映射到 B 模块上
     * @param ctx 调用 require 时的上下文
     * @param modules 即将被 require 的模块名称
     * @return modules 真正被 require 的名称
     */
    require: (ctx: IRequireCtx, modules: string[] | string) => Promise<string[] | string>;
    /**
     * 模块生成之前的钩子
     * @param ctx 调用即将生成的模块的上下文
     * @param meta 传入即将生成的模块的元数据
     * @return meta 处理后的元数据
     */
    beforeModuleGenerate: (ctx: IRequireCtx, meta: IDefineModuleMeta) => Promise<Omit<IDefineModuleMeta, 'name'>>;
}
export declare class BasePlugin implements IPlugin {
    pluginId: string;
    resolveModuleUrl(meta: IResolveModuleMeta): Promise<IResolveModuleMeta | string>;
    require(ctx: IRequireCtx, modules: string[] | string): Promise<string | string[]>;
    beforeModuleGenerate(ctx: IRequireCtx, meta: IDefineModuleMeta): Promise<IDefineModuleMeta>;
}
