import babel from '@babel/standalone';
babel.registerPlugin('es-module-factory', (context, params) => {
    const { types: t } = context;
    let defaultExport;
    let importCount = 0;
    return {
        visitor: {
            ImportDeclaration: (path) => {
                let defaultImport = '';
                let properties = `{${path.node.specifiers.reduce((pre, spec) => {
                    if (t.isImportDefaultSpecifier(spec)) {
                        defaultImport = spec.local.name;
                        return pre;
                    }
                    return `${pre}, ${spec.local.name}`;
                }, '').slice(1)}}`;
                if (t.isImportNamespaceSpecifier(path.node.specifiers[0])) {
                    properties = path.node.specifiers[0].local.name;
                }
                const moduleId = `__import_module_${importCount++}`;
                const requireStatement = context.template([
                    `const ${moduleId} = await _require('${path.node.source.value}')`,
                    ...properties ? [`,${properties} = ${moduleId}`] : [],
                    ...defaultImport ? [`,${defaultImport} = __default_import(${moduleId})`] : [],
                ].join(''));
                path.replaceWith(requireStatement());
            },
            ExportDefaultDeclaration: (path) => {
                defaultExport = path.node.declaration;
                if (t.isExpression(defaultExport)) {
                    // const __default = 原本的导出
                    path.replaceWith(t.variableDeclaration('const', [
                        t.variableDeclarator(t.declareVariable(t.identifier('__default')).id, defaultExport)
                    ]));
                }
                else {
                    // 原本的声明语句
                    // const __default = 原本的标识符
                    path.replaceWithMultiple([
                        defaultExport,
                        t.variableDeclaration('const', [
                            t.variableDeclarator(t.declareVariable(t.identifier('__default')).id, defaultExport.id)
                        ]),
                    ]);
                }
            },
            ExportNamedDeclaration: (path) => {
                if (path.node.declaration) {
                    Reflect.set(path.node.declaration, '__export', true);
                    path.replaceWith(path.node.declaration);
                }
                else if (path.node.specifiers.length) {
                    path.node.specifiers.forEach(spec => params.namedExport.push(spec.local.name));
                    path.remove();
                }
            },
            Declaration: (path) => {
                if (Reflect.has(path.node, '__export')) {
                    if (t.isVariableDeclaration(path.node)) {
                        path.node.declarations.forEach(declarator => {
                            if (t.isIdentifier(declarator.id)) {
                                params.namedExport.push(declarator.id.name);
                            }
                        });
                    }
                    else if (t.isFunctionDeclaration(path.node)) {
                        params.namedExport.push(path.node.id.name);
                    }
                    else if (t.isClassDeclaration(path.node)) {
                        params.namedExport.push(path.node.id.name);
                    }
                    else if (t.isEnumDeclaration(path.node)) {
                        params.namedExport.push(path.node.id.name);
                    }
                }
            }
        },
        post: (state) => {
            state.path.replaceWith(t.program([
                t.expressionStatement(t.arrowFunctionExpression([
                    t.identifier('_require'),
                ], t.blockStatement([
                    context.template(`const __default_import = m => Reflect.has(m, 'default') ? m['default'] : m;`)(),
                    ...state.path.node.body,
                    t.returnStatement(t.objectExpression([
                        ...!!defaultExport ? [t.objectProperty(t.identifier('default'), t.identifier('__default'))] : [],
                        ...params.namedExport.map(name => t.objectProperty(t.identifier(name), t.identifier(name))),
                    ]))
                ]), true))
            ]));
        }
    };
});
//# sourceMappingURL=babel-plugin.js.map