/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 22:25:58
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-05 23:43:03
 */
module.exports = {
    // plugins: [
    //     [
    //         '@babel/plugin-proposal-decorators',
    //         {
    //             legacy: true
    //         }
    //     ],
    //     [
    //         '@babel/plugin-proposal-class-properties',
    //         {
    //             loose: true
    //         }
    //     ],
    //     '@babel/plugin-transform-runtime'
    // ],
    presets: [
        [
            '@babel/env',
            {
                modules: false,
                useBuiltIns: 'usage',
                corejs: 3,
            }
        ],
        '@babel/preset-typescript',
        ['@babel/preset-react', {
            runtime: 'automatic'
        }]
    ]
};
