const { existsSync, rmSync, cpSync } = require('fs');
const path = require("path");

const resolveApp = (...relativePath) => path.resolve(process.cwd(), ...relativePath);
const resolvePackage = (...relativePath) => path.resolve(__dirname, ...relativePath);

const appPackageJson = require(resolveApp('./package.json'));

const targetPath = resolveApp(appPackageJson['blog-static-path']);
const sourcePath = resolvePackage('../build');

if (existsSync(targetPath)) {
    rmSync(targetPath);
}

cpSync(sourcePath, targetPath, {
    recursive: true
});
