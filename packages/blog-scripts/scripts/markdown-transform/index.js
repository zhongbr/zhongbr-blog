const path = require('path');
const fs = require('fs');
const { readFile, rm, copyFile } = require('fs/promises');

const files = require('./file-traverse');
const utils = require('./utils');
const markdown = require('./markdown-to-json');
const metas_ = require('./meta');
const topics = require('./topics');
const catalogue = require('./catalogue');
const { markdownJsonPath, markdownCompileCachePath, staticResourcePath, markdownFilesPath, catalogueFile, topicsFilePath, encodedPathsFile, staticResourcesMapPath, resolveApp } = require('../../config/paths');
const packageJson = require(resolveApp('./package.json'));
// 是否是生成 TSX 的模式
const md2Jsx = packageJson['markdown-to-jsx'];

const clear = async (dirs) => {
    for (const dir of dirs) {
        if (fs.existsSync(dir)) {
            await rm(dir, { recursive: true });
        }
    }
}

module.exports = async () => {
    // 清理旧的目录
    await clear([markdownCompileCachePath, staticResourcePath]);

    await topics.init();
    await catalogue.init();

    // 静态资源映射 Map
    const staticResourcesPathMap = new Map();

    await files.traverse(async (filePath) => {
        // 如果不是 markdown 文件，直接拷贝到目标目录
        if (!filePath.endsWith('.md')) {
            const dirname = path.dirname(filePath);
            // 确保目标目录存在
            utils.ensurePath(staticResourcePath);

            // 解析后缀名，记录静态资源和路径的映射关系
            const ext = path.parse(filePath).ext;
            const fileName = `${utils.md5(filePath)}${ext}`;
            staticResourcesPathMap.set(filePath, fileName);

            await copyFile(path.join(markdownFilesPath, filePath), path.resolve(staticResourcePath, './', fileName));
            return;
        }

        // markdown 文件需要进行转化之后，再保存到目标目录
        const fileTxt = await readFile(path.join(markdownFilesPath, filePath));
        const ast = await markdown.markdownToJson(fileTxt.toString());
        const metas = await metas_.parse(filePath, ast);
        metas_.traverse(ast, path.parse(filePath).dir);

        // 编辑中的文章暂不收录
        if (metas?.editing) {
            return;
        }

        // 编制索引
        catalogue.attachPostMetas(metas, filePath);

        // 让专栏判断并收集文章的 metas
        topics.attachPostMetas(metas, filePath);

        if (md2Jsx) {
            // 输出成 tsx
            const targetPath = utils.py(path.join(markdownJsonPath, filePath.replace(/.md$/, '/page.jsx')));
            utils.ensurePath(path.dirname(targetPath));
            // 保存文章
            await utils.write(
                targetPath,
                [
                    '/* eslint-disable */',
                    `import React from 'react';`,
                    `import { Article } from '@/components';`,
                    `const ast = ${JSON.stringify(ast)};`,
                    `const metas = ${JSON.stringify(metas)};`,
                    `export default () => <Article ast={ast} metas={metas} />;`
                ].join('\n')
            )
            return;
        }

        // 输出成 json
        const targetPath = path.join(markdownJsonPath, filePath.replace(/.md$/, '.json'));
        utils.ensurePath(path.dirname(targetPath));
        // 保存文章
        await utils.write(
            targetPath,
            JSON.stringify({
                ast,
                catalogue: metas
            })
        );
    });
    // 保存目录
    await utils.write(catalogueFile, JSON.stringify(catalogue.getCatalogue()));
    // 保存主题专栏数据
    await utils.write(topicsFilePath, JSON.stringify(topics.getTopicsJson()));
    // 保存文章路径编码映射
    await utils.write(encodedPathsFile, JSON.stringify(Array.from(utils.encodedPaths)));
    // 保存其他静态资源目录映射
    await utils.write(staticResourcesMapPath, JSON.stringify(Array.from(staticResourcesPathMap)));
}
