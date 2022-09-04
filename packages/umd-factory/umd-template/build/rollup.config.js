/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 01:02:47
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-04 14:39:09
 */
const path = require('path');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const replace = require('@rollup/plugin-replace');

const babelOptions = require('./babel.config');
const packageJson = require('../package.json');

const appPath = process.cwd();
const isProd = packageJson['_umdEnvTag'] === 'prod';

const resolveApp = relative => path.resolve(appPath, relative);

module.exports = {
    configs: [
        {
            input: resolveApp('./src/index.js'),
            output: {
                file: resolveApp('./dist/index.umd.js'),
                format: 'umd',
                name: packageJson.name,
                amd: {
                    id: `lib/${packageJson.name}`
                }
            },
            externals: ['react', 'react-dom'],
            plugins: [
                postcss({
                    plugins: [autoprefixer()],
                    minimize: true,
                    sourceMap: !isProd,
                    autoModules: true,
                    use: {
                        sass: null,
                        stylus: null,
                        less: { javascriptEnabled: true }
                    },
                }),
                replace({
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
                }),
                nodeResolve(),
                commonjs(),
                babel(babelOptions),
            ]
        }
    ],
    resolveApp
};
