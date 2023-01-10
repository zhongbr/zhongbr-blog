import babel from '@babel/standalone';
import './babel-plugin.js';

export interface IImportDependencies {
    uri: string;
    defaultDependency: string,
    namespaceDependency: string;
    namedDependencies: string[];
}

export async function transformJsxComponentCode(code: string): Promise<[IImportDependencies[], string]> {
    console.log('------------ 🚀 start transform jsx code ------------');

    const dependencies: IImportDependencies[] = [];
    const namedExport: string[] = [];

    const { code: normalJs } = babel.transform(code, {
        filename: 'code.tsx',
        presets: ['react', 'typescript'],
        plugins: [
            ['es-module-factory', { dependencies, namedExport }]
        ]
    });


    return [dependencies, normalJs];
}
