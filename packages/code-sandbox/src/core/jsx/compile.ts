import { transform } from '@babel/standalone';
import './plugin';

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

    const { code: normalJs } = transform(code, {
        filename: 'code.tsx',
        presets: ['react', 'typescript'],
        plugins: [
            ['es-module-factory', { dependencies, namedExport }]
        ]
    });


    return [dependencies, normalJs];
}
