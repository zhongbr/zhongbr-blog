const { existsSync, rmSync, cpSync } = require('fs');
const path = require('path');

const resolveApp = (...relativePath) => path.resolve(process.cwd(), ...relativePath);
const resolvePackage = (...relativePath) => path.resolve(__dirname, ...relativePath);

const appPackageJson = require(resolveApp('./package.json'));

const targetPath = resolveApp(appPackageJson['blog-static-path']);
const sourcePath = resolvePackage('../build');

const scriptsPath = resolveApp(appPackageJson['outer-script-path']);
const scriptsTargetPath = resolveApp(appPackageJson['blog-static-path'], './scripts');

if (existsSync(targetPath)) {
    rmSync(targetPath, { recursive: true });
}

cpSync(sourcePath, targetPath, {
    recursive: true
});

cpSync(scriptsPath, scriptsTargetPath, {
    recursive: true
});
