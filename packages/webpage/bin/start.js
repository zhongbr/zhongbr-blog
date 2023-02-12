const express = require('express');
const path = require('path');

const app = express();

const resolveApp = (...relativePath) => path.resolve(process.cwd(), ...relativePath);
const resolvePackage = (...relativePath) => path.resolve(__dirname, ...relativePath);

const appPackageJson = require(resolveApp('./package.json'));

app.use('/', express.static(resolvePackage('../build')));
app.use('/md/', express.static(resolveApp(appPackageJson['markdown-compile-cache-path'], './md')));
app.use('/source/', express.static(resolveApp(appPackageJson['posts-markdown-files'])));

app.listen(3000, () => {
    console.log('blog start at 3000');
});
