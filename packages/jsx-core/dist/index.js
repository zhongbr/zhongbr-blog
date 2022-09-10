/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 16:13:38
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-07 22:18:39
 */
import * as t from '@babel/types';
import { parse } from "@babel/parser";
import _traverse from '@babel/traverse';
import _core from '@babel/core';
import _generator from '@babel/generator';
// @ts-ignore
const traverse = _traverse.default;
// @ts-ignore
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
    const sourceDeclares = [];
    traverse(ast, {
        enter: (path) => {
            var _a;
            const regexp = /\s*dep\((\w+),\s*(.*)\)/g;
            (_a = path.node.leadingComments) === null || _a === void 0 ? void 0 : _a.forEach(comment => {
                const groups = Array.from(comment.value.matchAll(regexp));
                groups === null || groups === void 0 ? void 0 : groups.forEach(([, name, cdn, path]) => {
                    sourceDeclares.push({
                        name,
                        cdn,
                        path
                    });
                });
            });
        },
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
        },
    });
    const code = generator(ast);
    // generate imports to umd
    const importStatements = imports.map(({ namespace, defaultModule, packageName, subMoules }) => {
        if (namespace) {
            return `const ${namespace} = this['${packageName}'];`;
        }
        const defaultImport = defaultModule ? `const ${defaultModule} = this['${packageName}'].default;` : '';
        const subModuleImports = (subMoules === null || subMoules === void 0 ? void 0 : subMoules.length) ? `const {${subMoules.map(([from, to]) => from === to ? to : `${from}: ${to}`).join(',')}} = this['${packageName}'];` : '';
        return [
            defaultImport,
            subModuleImports
        ].join('\n');
    }).join('\n');
    return [`(() => function(){${importStatements}${code.code}})()`, imports.map(imp => imp.packageName), sourceDeclares];
}
export function transformJsx(code) {
    return _core.transformSync(code, {
        presets: ['@babel/preset-react'],
    }).code;
}
export default function (code) {
    const [res, imports, sources] = parseModuleStatements(getAstFromCode(code));
    return [transformJsx(res), imports, sources];
}
