/*
 * @Description: paths
 * @Author: 张盼宏
 * @Date: 2022-09-03 23:21:28
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 23:37:32
 */
const path = require('path');
const appPath = process.cwd();

const resolveApp = relative => path.resolve(appPath, relative);

const markdownCompileCachePath = resolveApp('./.md-cache')
const markdownJsonPath = resolveApp(`${markdownCompileCachePath}/md`)


    module.exports = {
    // markdown files paths
    markdownFilesPath: resolveApp('./posts'),
    markdownCompileCachePath,
    markdownJsonPath,
    compileCacheFile: resolveApp(`${markdownCompileCachePath}/last-compile-hash.json`),
    catalogueFile: resolveApp(`${markdownJsonPath}/catalogue.json`)
}
