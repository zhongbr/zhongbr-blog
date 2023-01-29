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
    catalogueFile: resolveApp(`${markdownJsonPath}/catalogue.json`),
    umdVersionFile: resolveApp(`${markdownCompileCachePath}/umd-version.json`),
    topicsFilePath: resolveApp(`${markdownJsonPath}/topic.json`)
}
