/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 22:51:52
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-04 23:31:37
 */
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const path = require("path");

const cwd = process.cwd();

const resolveApp = relative => path.resolve(cwd, relative);

const dist = resolveApp('./dist');

webpack(webpackConfig, (err, status) => {
    if (err) {
        throw err;
    }
    console.log(status);
});
