/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 16:13:38
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-04 18:06:37
 */
import * as t from '@babel/types';
import { parse } from "@babel/parser";
import _traverse from '@babel/traverse';
import _core from '@babel/core';
import _generator from '@babel/generator';
const traverse = _traverse.default;
const generator = _generator.default;
export function getAstFromCode(code) {
    return parse(code, {
        sourceType: 'module',
        plugins: [
            'jsx',
            'typescript'
        ]
    });
}
export function parseModuleStatements(ast) {
    const imports = [];
    traverse(ast, {
        ImportDeclaration: (path) => {
            const node = path.node;
            const { specifiers, source } = node;
            const statement = {
                packageName: source.value
            };
            specifiers.map((spe) => {
                if (t.isImportNamespaceSpecifier(spe)) {
                    statement.namespace = spe.local.name;
                }
                else if (t.isImportDefaultSpecifier(spe)) {
                    statement.defaultModule = spe.local.name;
                }
                else {
                    statement.subMoules = statement.subMoules || [];
                    statement.subMoules.push([spe.imported.name, spe.local.name]);
                }
            });
            imports.push(statement);
            path.remove();
        },
        ExportDefaultDeclaration: (path) => {
            const node = path.node;
            path.replaceWith(t.returnStatement(node.declaration));
        }
    });
    const code = generator(ast);
    const importStatements = imports.map(({ namespace, defaultModule, packageName, subMoules }) => {
        if (namespace) {
            return `const ${namespace} = this['${packageName}'];`;
        }
        const defaultImport = defaultModule ? `const ${defaultModule} = this['${packageName}'].default;` : '';
        const subModuleImports = subMoules.length ? `const {${subMoules.map(([from, to]) => from === to ? to : `${from}: ${to}`).join(',')}} = this['${packageName}'];` : '';
        return [defaultImport, subModuleImports].join('\n');
    }).join('\n');
    return `(() => function(){${importStatements}${code.code}})()`;
}
export function transformJsx(code) {
    return _core.transformSync(code, {
        presets: ['@babel/preset-react'],
    });
}
