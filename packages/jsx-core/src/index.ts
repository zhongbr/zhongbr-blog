/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 16:13:38
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-04 18:11:06
 */
import * as t from '@babel/types';
import { parse, ParseResult } from "@babel/parser";
import _traverse from '@babel/traverse';
import _core from '@babel/core';
import _generator from '@babel/generator';

const traverse = _traverse.default;
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

export function parseModuleStatements(ast: ParseResult<t.File>): string {
    const imports: ImportStatement[] = [];

    traverse(ast, {
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
        }
    });

    const code = generator(ast);

    // generate imports to umd
    const importStatements = imports.map(({ namespace, defaultModule, packageName, subMoules }) => {
        if (namespace) {
            return `const ${namespace} = this['${packageName}'];`;
        }

        const defaultImport = defaultModule ? `const ${defaultModule} = this['${packageName}'].default;` : '';

        const subModuleImports = subMoules.length ? `const {${
            subMoules.map(([from, to]) => from === to ? to : `${from}: ${to}`).join(',')
        }} = this['${packageName}'];` : '';

        return [
            defaultImport,
            subModuleImports
        ].join('\n');
    }).join('\n');

    return `(() => function(){${importStatements}${code.code}})()`;
}

export function transformJsx(code: string): string {
    return _core.transformSync(code,{
        presets: ['@babel/preset-react'],
    });
}
