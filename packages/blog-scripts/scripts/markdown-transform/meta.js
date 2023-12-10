const path = require('path');
const fs = require('fs');
const utils = require('./utils');
const {markdownFilesPath} = require('../../config/paths');

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
        "http://i.imgs.ovh/2023/12/10/fUDwe.jpeg",
        "http://i.imgs.ovh/2023/12/10/fUEO3.jpeg",
        "http://i.imgs.ovh/2023/12/10/fUTD9.jpeg",
        "http://i.imgs.ovh/2023/12/10/fU9ZO.jpeg",
        "http://i.imgs.ovh/2023/12/10/fUNjD.jpeg",
        "http://i.imgs.ovh/2023/12/10/fUGKH.jpeg",
        "http://i.imgs.ovh/2023/12/10/fUvLo.jpeg",
        "http://i.imgs.ovh/2023/12/10/fUy0A.jpeg",
        "http://i.imgs.ovh/2023/12/10/fiCt5.jpeg",
        "http://i.imgs.ovh/2023/12/10/fiL3X.jpeg",
        "http://i.imgs.ovh/2023/12/10/fiXOU.jpeg",
        "http://i.imgs.ovh/2023/12/10/firE0.jpeg",
        "http://i.imgs.ovh/2023/12/10/fiFlC.jpeg",
        "http://i.imgs.ovh/2023/12/10/fiAKt.jpeg",
        "http://i.imgs.ovh/2023/12/10/fiZ4m.jpeg",
        "http://i.imgs.ovh/2023/12/10/finLN.jpeg",
        "http://i.imgs.ovh/2023/12/10/fiH0R.jpeg",
        "http://i.imgs.ovh/2023/12/10/fiM1p.jpeg"
    ]
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
    const jsonPath = filePath.replace(/\.md$/, '.json');

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

function traverse(ast, filePath, parent = null, index = 0) {
    // 增加 key 属性
    if (parent) {
        ast.key = `${parent.key}-${index}`;
    } else {
        ast.key = `${index}`;
    }
    // 处理 url
    if (['Link', 'Image'].includes(ast.type)) {
        let url = decodeURIComponent(ast.url);
        // 只处理内部链接，将相对链接改为相对文章根目录的链接
        if (!url.startsWith('http') && !url.startsWith('//')) {
            if (!path.isAbsolute(url)) {
                if (!url.startsWith('.')) {
                    url = './' + url;
                }
                ast.url = path.join(filePath, url);
            }
        }
    }
    if (ast.children) {
        ast.children.forEach((child, index) => traverse(child, filePath, ast, index));
    }
}

module.exports = {
    parse,
    traverse
};
