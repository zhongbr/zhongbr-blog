/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 01:13:24
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-04 01:45:32
 */
const { uglify } = require('rollup-plugin-uglify');
const { configs } = require('./rollup.config');

configs.map((config) => {
    config.plugins = [
        ...config.plugins,
        uglify()
    ];

    config.output.sourcemap = false;

    return config;
});

module.exports = configs;
