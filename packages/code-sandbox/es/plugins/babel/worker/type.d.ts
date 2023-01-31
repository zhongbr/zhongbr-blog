export interface IImportDependencies {
    uri: string;
    defaultDependency: string;
    namespaceDependency: string;
    namedDependencies: string[];
}
export interface IBabelService {
    esm2Amd: (code: string) => Promise<[string, IImportDependencies[]]>;
    jsx: (code: string) => Promise<string>;
}
export declare const BabelServiceId = "code-sandbox-babel-service";
