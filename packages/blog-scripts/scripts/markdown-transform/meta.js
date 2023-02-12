const path = require('path');
const fs = require('fs');
const utils = require('./utils');
const { markdownFilesPath } = require('../../config/paths');

/**
 * 随机返回数组内的一个元素
 * @returns {*}
 */
Array.prototype.random = function () {
    this.sort(() => Math.random() > 0.5 ? -1 : 1);
    return this[Math.floor(Math.random() * Math.floor(Math.random() * 100) * this.length) % this.length];
}

// 随机生成一张封面图片
function randomCoverImage() {
    const imagesPools = [
        'https://i.328888.xyz/2022/12/31/ndOVF.jpeg',
        'https://i.328888.xyz/2022/12/31/nd2oZ.jpeg',
        'https://i.328888.xyz/2022/12/31/ndbjH.jpeg',
        'https://i.328888.xyz/2022/12/31/ndj6Q.jpeg',
        'https://i.328888.xyz/2022/12/31/nd8QE.jpeg',
        'https://i.328888.xyz/2022/12/31/ndNlC.jpeg',
        'https://i.328888.xyz/2022/12/31/ndrgP.jpeg',
        'https://i.328888.xyz/2022/12/31/nd3LX.jpeg',
        'https://i.328888.xyz/2022/12/31/ndcnt.jpeg',
        'https://i.328888.xyz/2022/12/31/ndmRJ.jpeg',
        'https://i.328888.xyz/2022/12/31/ndpoc.jpeg',
        'https://i.328888.xyz/2023/01/01/tZMoa.jpeg',
        'https://i.328888.xyz/2023/01/01/tZLcw.jpeg',
        'https://i.328888.xyz/2023/01/01/tZTfx.jpeg',
        'https://i.328888.xyz/2023/01/01/tZa8k.jpeg',
        'https://i.328888.xyz/2023/01/01/tZ1FL.jpeg',
        'https://i.328888.xyz/2023/01/01/tZQYp.jpeg',
        'https://i.328888.xyz/2023/01/01/tZqwU.jpeg',
        'https://i.328888.xyz/2023/01/01/tZuxv.jpeg',
        'https://i.328888.xyz/2023/01/01/tiZM3.jpeg',
        'https://i.328888.xyz/2023/01/01/tiVty.jpeg',
        'https://i.328888.xyz/2023/01/01/tifc5.jpeg',
    ];
    return imagesPools.random();
}

// 随机生成一个 emoji 作为 icon
function randomEmojiIcon() {
    const emojiPools = [
        '🚀', '🔥', '🐒', '🐵', '🍀', '🎄', '🐳', '🦉', '🐞', '🐿', '🐰', '🍉', '🍋', '💊', '🐑',
        '🐮', '🍺', '💻', '📱', '☁️', '🌧', '❄️', '☀️', '🌛', '⭐️', '🌏', '🦁', '🐻', '🐭', '🐍',
    ];
    return emojiPools.random();
}

async function parse(filePath, ast) {
    const filename = path.basename(filePath);
    // 尝试匹配发布日期
    const date = filename.match(/20(?:-?\d{2}){3}/)?.[0];
    const title = filename
        // 去掉文件名开头的日期
        .replace(/\.md$/, '').replace(/20(\d{2}-){3}/, '')
        // 去掉文件中哈希值
        .replace(/[0-9a-e]{10}[0-9a-f]*/, '')
        .trim();
    const children = ast?.children || [];
    const ymlChild = children?.[0];
    const jsonPath = filePath.replace(/\.md$/, '.json').replace(/^\.\//, '');

    // 没有设置元数据的文章默认不显示
    if (ymlChild?.type !== 'Yaml') {
        return {
            title,
            'json-path': jsonPath,
            mdate: (await new Promise(resolve => fs.stat(path.join(markdownFilesPath, filename), resolve))).mdate,
            cover: randomCoverImage(),
            icon: randomEmojiIcon(),
            tags: ['无标签'],
            visible: false
        };
    }

    const doc = await utils.readYaml(ymlChild?.value);
    // 隐藏元数据的代码块
    ymlChild.visible = false;
    return {
        title,
        'json-path': jsonPath,
        mdate: date,
        cover: randomCoverImage(),
        icon: randomEmojiIcon(),
        visible: true,
        ...doc
    };
}

module.exports = {
    parse
};
