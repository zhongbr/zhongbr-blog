/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 22:30:48
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-05 00:10:28
 */
const path = require('path');
const autoprefixer = require('autoprefixer');
const packageJson = require('../package.json');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const cwd = process.cwd();

const resolveApp = relative => path.resolve(cwd, relative);

module.exports = {
    mode: 'none',
    target: 'web',
    entry: {
        app: resolveApp('./src/index.js')
    },
    output: {
        path: resolveApp('./dist'),
        filename: 'index.umd.js',
        library: {
            name: packageJson.name,
            type: 'umd'
        }
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                terserOptions: {
                    output: {
                        beautify: false,
                        comments: false,
                    },
                    compress: {
                        drop_console: true,
                        comparisons: false
                    }
                }
            })
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        mainFields: ['module', 'browser', 'main']
    },
    externals: {
        'react': 'react',
        'react-dom': 'react-dom'
    },
    plugins: [
        new DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
    ],
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.js$/,
                        use: [
                            { loader: 'babel-loader' }
                        ],
                        include: resolveApp('./src')
                    },
                    {
                        test: /\.(le|c)ss/,
                        use: [
                            {
                                loader: 'less-loader',
                                options: {
                                    lessOptions: {
                                        javascriptEnabled: true
                                    }
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    postcssOptions: {
                                        plugins: [
                                            require('postcss-flexbugs-fixes'),
                                            autoprefixer({
                                                overrideBrowserslist: [
                                                    '>1%',
                                                    'last 4 versions',
                                                    'Firefox ESR',
                                                    'not ie < 9',
                                                ],
                                                flexbox: 'no-2009',
                                            }),
                                        ],
                                    }
                                },
                            },
                            {
                                loader: require.resolve('style-loader'),
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
