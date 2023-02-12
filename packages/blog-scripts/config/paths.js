const path = require('path');
const appPath = process.cwd();

const resolveApp = relative => path.resolve(appPath, relative);
const packageJson = require(resolveApp('./package.json'));

const markdownCompileCachePath = resolveApp(packageJson['markdown-compile-cache-path'])
const markdownJsonPath = resolveApp(`${markdownCompileCachePath}/md`)

module.exports = {
    // markdown files paths
    markdownFilesPath: resolveApp(packageJson['posts-markdown-files']),
    markdownCompileCachePath,
    markdownJsonPath,
    compileCacheFile: resolveApp(`${markdownCompileCachePath}/last-compile-hash.json`),
    catalogueFile: resolveApp(`${markdownJsonPath}/catalogue.json`),
    umdVersionFile: resolveApp(`${markdownCompileCachePath}/umd-version.json`),
    topicsFilePath: resolveApp(`${markdownJsonPath}/topic.json`)
}
