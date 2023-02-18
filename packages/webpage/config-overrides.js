const path = require('path');
const express = require("express");
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');
const { override, addWebpackAlias, addWebpackPlugin, addWebpackResolve } = require('customize-cra');
const addLessLoader = require('customize-cra-less-loader');

const cwd = process.cwd();

const appPackageJson = require(path.resolve(cwd, './package.json'));

let paths = {};

module.exports = {
    webpack: (config_, env) => {
        const config = override(
            addWebpackPlugin(new MonacoEditorWebpackPlugin({
                languages: ['javascript', 'typescript', 'html', 'css']
            })),
            addWebpackAlias({
                '@': paths.appSrc
            }),
            addLessLoader({
                cssLoaderOptions: {
                    importLoaders: 2,
                    sourceMap: true,
                    modules: {
                        localIdentName: '[local]_[hash:base64:5]',
                        exportLocalsConvention: 'camelCase'
                    },
                },
                lessLoaderOptions: {
                    sourceMap: true,
                },
            }),
        )(config_, env);

        config.resolve.fallback = {
            ...config.resolve.fallback || {},
            'process': require.resolve('process/browser')
        };

        return config;
    },
    paths: (paths_, env) => {
        // 把 create-react-app 内的 paths 映射到包内
        const reactPaths = Object.entries(paths_).reduce((cur, [key, value]) => {
            let newPath = value;
            if (!value.includes('node_modules') && typeof value === 'string') {
                newPath = path.resolve(__dirname, path.relative(cwd, value))
            }
            return {
                ...cur,
                [key]: newPath,
            };
        }, {});

        return paths = {
            ...reactPaths,
            // 构建的产物还是需要输出到项目的根目录
            appBuild: paths_.appBuild,
            postsSourceDir: path.resolve(cwd, appPackageJson['posts-markdown-files']),
            postsJsonDir: path.resolve(cwd, appPackageJson['markdown-compile-cache-path'], './md'),
            outerScriptDir: path.resolve(cwd, appPackageJson['outer-script-path'])
        };
    },
    devServer: (configFunction) => {
        return (proxy, allowedHost) => {
            const config = configFunction(proxy, allowedHost);
            // 给 dev-server 增加一个 markdown 的本地目录
            config.setupMiddlewares = (middleware, devServer) => {
                // add markdown json files to /md
                devServer.app.use('/md/', express.static(paths.postsJsonDir));
                devServer.app.use('/sources/', express.static(paths.postsSourceDir));
                devServer.app.use('/scripts/', express.static(paths.outerScriptDir));
                return middleware;
            };
            return config;
        };
    }
};
