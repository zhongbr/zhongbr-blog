import './plugin';
export interface IImportDependencies {
    uri: string;
    defaultDependency: string;
    namespaceDependency: string;
    namedDependencies: string[];
}
export declare function transformJsxComponentCode(code: string): Promise<[IImportDependencies[], string]>;
