import { transform } from "@babel/standalone";
import { registerProxy } from '../../../core/proxy';
import { BabelServiceId, IBabelService, IImportDependencies } from './type';
import { esm2Amd } from "./plugins/esm-to-amd";

const service: IBabelService = {
    esm2Amd: async (code) => {
        const dependencies: IImportDependencies[] = [];
        const namedExport: string[] = [];
        const { code: result } = transform(code, {
            filename: 'code.ts',
            presets: ['typescript'],
            plugins: [
                [esm2Amd, { dependencies, namedExport }]
            ]
        });
        return [result, dependencies];
    },
    jsx: async (code) => {
        const { code: result } = transform(code, {
            filename: 'code.tsx',
            presets: ['react', 'typescript']
        });
        return result;
    }
};

registerProxy(BabelServiceId, service);
