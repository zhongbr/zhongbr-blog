var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import babel from '@babel/standalone';
import './babel-plugin.js';
export function transformJsxComponentCode(code) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('------------ 🚀 start transform jsx code ------------');
        const dependencies = [];
        const namedExport = [];
        const { code: normalJs } = babel.transform(code, {
            filename: 'code.tsx',
            presets: ['react', 'typescript'],
            plugins: [
                ['es-module-factory', { dependencies, namedExport }]
            ]
        });
        return [dependencies, normalJs];
    });
}
//# sourceMappingURL=compile.js.map