const path = require('path');
const { readFile, copyFile } = require('fs/promises');

const files = require('./file-traverse');
const utils = require('./utils');
const markdown = require('./markdown-to-json');
const metas_ = require('./meta');
const topics = require('./topics');
const catalogue = require('./catalogue');
const { markdownJsonPath, markdownFilesPath, catalogueFile, topicsFilePath } = require('../../config/paths');

module.exports = async () => {
    await topics.init();
    await catalogue.init();
    await files.traverse(async (filePath) => {
        // 如果不是 markdown 文件，直接拷贝到目标目录
        if (!filePath.endsWith('.md')) {
            const dirname = path.dirname(filePath);
            const targetDirname = path.join(markdownJsonPath, dirname);
            // 确保目标目录存在
            utils.ensurePath(targetDirname);
            await copyFile(path.join(markdownFilesPath, filePath), path.join(markdownJsonPath, filePath));
            return;
        }
        // markdown 文件需要进行转化之后，再保存到目标目录
        const fileTxt = await readFile(path.join(markdownFilesPath, filePath));
        const ast = await markdown.markdownToJson(fileTxt.toString());
        const metas = await metas_.parse(filePath, ast);

        // 编辑中的文章暂不收录
        if (metas?.editing) {
            return;
        }

        // 编制索引
        catalogue.attachPostMetas(metas, filePath);

        // 让专栏判断并收集文章的 metas
        topics.attachPostMetas(metas, filePath);

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
    await utils.write(catalogueFile, JSON.stringify(catalogue.getCatalogue()));
    await utils.write(topicsFilePath, JSON.stringify(topics.getTopicsJson()));
}
