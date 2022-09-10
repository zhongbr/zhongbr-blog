/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 16:13:38
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-07 22:20:58
 */
import * as t from '@babel/types';
import { parse, ParseResult } from "@babel/parser";
import _traverse from '@babel/traverse';
import _core from '@babel/core';
import _generator from '@babel/generator';

// @ts-ignore
const traverse = _traverse.default;
// @ts-ignore
const generator = _generator.default;

export function getAstFromCode(code: string) {
    return parse(code, {
        sourceType: 'module',
        plugins: [
            'jsx',
            'typescript'
        ]
    })
}

export interface ImportStatement {
    packageName: string;
    subMoules?: [string, string][];
    defaultModule?: string;
    namespace?: string;
}

export interface SourceDeclare {
    name: string;
    cdn?: string;
    path?: string;
}

export function parseModuleStatements(ast: ParseResult<t.File>): [string, string[], SourceDeclare[]] {
    const imports: ImportStatement[] = [];
    const sourceDeclares: SourceDeclare[] = [];

    traverse(ast, {
        enter: (path) => {
            const regexp = /\s*dep\((\w+),\s*(.*)\)/g
            console.log(path.node.leadingComments);
            path.node.leadingComments?.forEach(comment => {
                const groups = Array.from(comment.value.matchAll(regexp));
                groups?.forEach(([,name, cdn, path]) => {
                    sourceDeclares.push({
                        name,
                        cdn,
                        path
                    });
                })
            });
        },
        ImportDeclaration: (path) => {
            const node = path.node as t.ImportDeclaration;
            const { specifiers, source } = node;

            const statement: ImportStatement = {
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
                    statement.subMoules.push([(spe.imported as t.Identifier).name, spe.local.name]);
                }
            });

            imports.push(statement);
            path.remove();
        },
        ExportDefaultDeclaration: (path) => {
            const node = path.node as t.ExportDefaultDeclaration;
            path.replaceWith(t.returnStatement(node.declaration as t.Expression));
        },

    });

    const code = generator(ast);

    // generate imports to umd
    const importStatements = imports.map(({ namespace, defaultModule, packageName, subMoules }) => {
        if (namespace) {
            return `const ${namespace} = this['${packageName}'];`;
        }

        const defaultImport = defaultModule ? `const ${defaultModule} = this['${packageName}'].default;` : '';

        const subModuleImports = subMoules?.length ? `const {${
            subMoules.map(([from, to]) => from === to ? to : `${from}: ${to}`).join(',')
        }} = this['${packageName}'];` : '';

        return [
            defaultImport,
            subModuleImports
        ].join('\n');
    }).join('\n');

    return [`(() => function(){${importStatements}${code.code}})()`, imports.map(imp => imp.packageName), sourceDeclares];
}

export function transformJsx(code: string): string {
    return _core.transformSync(code,{
        presets: ['@babel/preset-react'],
    }).code;
}

export default function (code: string) {
    const [res, imports, sources] = parseModuleStatements(getAstFromCode(code));
    return [transformJsx(res), imports, sources];
}
