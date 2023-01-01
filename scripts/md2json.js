/*
 * @Description: compile markdown to json
 * @Author: 张盼宏
 * @Date: 2022-08-28 11:26:36
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-08 23:31:27
 */
const chalk = require('react-dev-utils/chalk');
const path = require('path');
const { existsSync } = require('fs');
const { readFile, readdir, appendFile, writeFile, mkdir } = require('fs/promises');
const yaml = require('js-yaml');

const { markdownFilesPath, markdownJsonPath, markdownCompileCachePath, catalogueFile, topicsFilePath } = require('../config/paths');
const topicsYamlPath = path.join(markdownFilesPath, './topics.yaml');

/**
 * 随机返回数组内的一个元素
 * @param r 倍数
 * @returns {*}
 */
Array.prototype.random = function (r= 10) {
    return this[Math.floor(Math.random() * r * this.length) % this.length];
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
    ];
    return imagesPools.random();
}

// 随机生成一个 emoji 作为 icon
function randomEmojiIcon() {
    const emojiPools = ['🚀', '🔥', '🐒', '🐵', '🍀', '🎄', '🐳', '🦉', '🐞', '🐿', '🐰', '🍉', '🍋', '💊', '🐑'];
    return emojiPools.random();
}

async function readYaml(content, path) {
    if (!content) {
        content = await readFile(path);
    }
    return new Promise((resolve) => {
        yaml.loadAll(content, doc => resolve(doc));
    });
}

/** write files */
async function write(target, content) {
    if (!existsSync(target)) {
        console.log('append', target);
        return appendFile(target, content);
    }
    return writeFile(target, content);
}

/** catalogue */
async function generateCatalogue(filename, ast) {
    const date = filename.match(/20(?:-?\d{2}){3}/)?.[0];
    const title = filename.replace(/\.md$/, '').replace(/20(\d{2}-){3}/, '');
    const children = ast?.children || [];
    const ymlChild = children?.[0];

    if (ymlChild?.type === 'Yaml') {
        const doc = await readYaml(ymlChild?.value);
        return {
            title,
            'json-path': `${date}-${title}.json`,
            mdate: date,
            cover: randomCoverImage(),
            icon: randomEmojiIcon(),
            ...doc
        };
    }

    return Promise.resolve({
        title,
    });
}

async function startCompile() {
    // import parser
    const { parse } = await import('md2json');
    console.log('load md2json 🚀', parse);

    // 加载 首页展示的主题 配置
    const topicsJson = await readYaml(undefined, topicsYamlPath);
    const topicsJsonIndexes = new Map(topicsJson?.topics?.map(topic => [topic.id, topic]));

    // 最近更新文章主题
    const newestTopicJson = {
        topicName: '🔥最近更新',
        id: 'newest',
        icon: 'rp-naozhong',
        color: '#e88c9032',
        desc: '🔥🔥新鲜出炉的哦，走过路过千万不要错过~~'
    };

    // 其他主题
    const topicsTagsIndexes = new Map([]);
    topicsJson?.topics?.forEach(topic => {
        topic?.tags?.forEach(tag => topicsTagsIndexes.set(tag, (topicsTagsIndexes.get(tag) || new Set()).add(topic)));
    })
    const othersTopicJson = {
        topicName: '未分类文章和标签',
        id: 'others',
        icon: 'rp-jihua',
        color: '#ffc85d32',
        desc: '🚀🚀虽然这些博客标签没有划分类别，也是不错的哟！'
    };

    // check dir exist
    for (const path1 of [markdownFilesPath, markdownJsonPath, markdownCompileCachePath]) {
        if (!existsSync(path1)) {
            console.log(chalk.yellow(`mkdir ${path1}`))
            await mkdir(path1);
        }
    }

    // load catalogue
    let catalogue = {};
    if (existsSync(catalogueFile)) {
        const jsonBuffer = await readFile(catalogueFile);
        catalogue = JSON.parse(jsonBuffer.toString());
    }

    // start compile markdown files
    const files = await readdir(markdownFilesPath);
    for (const file of files) {
        console.log('->', file);
        if (!file.endsWith('.md')) {
            continue;
        }
        const jsonName = file.replace(/\.md$/, '.json');
        console.log(chalk.blue(`attach file: ${file}`));

        const sourcePath = path.join(markdownFilesPath, file);
        const targetPath = path.join(markdownJsonPath, jsonName);

        const buffer = await readFile(sourcePath);

        const ast = parse(buffer.toString());

        const metas = await generateCatalogue(file, ast);

        if (metas?.editing) {
            continue;
        }

        // 如果是精选文章
        if (metas?.recommend) {
            const topic = topicsJsonIndexes.get(metas.recommend);
            topic.passages = topic.passages || [];
            topic.passages.push(metas);
        }

        // 检查文章的标签，如果没有分类，就放到其他主题内
        if (metas.tags) {
            metas.tags?.forEach(tag => {
                if (!topicsTagsIndexes.get(tag)) {
                    othersTopicJson.tags = othersTopicJson.tags || new Set();
                    console.log(othersTopicJson.tags);
                    othersTopicJson.tags.add(tag);
                }
            })
        }

        catalogue[file] = metas;
        await write(targetPath, JSON.stringify({
            ast,
            catalogue: catalogue[file]
        }));

        console.log(chalk.green(`${file} compiled to ${jsonName}`));
    }

    // 读取所有文章的元数据，排序获取前5篇作为最近更新栏目的内容
    const metasArr = Object.values(catalogue);
    metasArr.sort((meta1, meta2) => new Date(meta1.mdate) - new Date(meta2.mdate));
    const tags = new Set();
    metasArr.slice(metasArr.length - 5).forEach(meta => {
        meta?.tags?.forEach(tag => tags.add(tag));
    });
    newestTopicJson.tags = Array.from(tags);
    newestTopicJson.passages = metasArr.slice(metasArr.length - 5);
    topicsJson.topics.unshift(newestTopicJson);

    // 在主题内增加一个其他主题
    if (othersTopicJson.tags) {
        othersTopicJson.tags = Array.from(othersTopicJson.tags);
        topicsJson.topics.push(othersTopicJson);
    }

    await write(catalogueFile, JSON.stringify(catalogue));
    await write(topicsFilePath, JSON.stringify(topicsJson));
}

startCompile().then();
