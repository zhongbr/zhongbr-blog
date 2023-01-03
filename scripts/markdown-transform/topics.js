const path = require('path');

const { markdownFilesPath } = require('../../config/paths');
const utils = require('./utils');

let topicsJson;
let topicsTagsIndexes;
const newestTopicNum = 10;
// 最近更新文章主题
const newestTopicJson = {
    topicName: '🔥最近更新',
    id: 'newest',
    icon: 'rp-naozhong',
    color: '#e88c9032',
    desc: '🔥🔥新鲜出炉的哦，走过路过千万不要错过~~'
};
// 未分类的标签文章
const othersTopicJson = {
    topicName: '未分类文章和标签',
    id: 'others',
    icon: 'rp-jihua',
    color: '#ffc85d32',
    desc: '🚀🚀虽然这些博客标签没有划分类别，也是不错的哟！'
};

async function init() {
    topicsJson = await utils.readYaml(undefined, path.join(markdownFilesPath, './topics.yaml'));
    topicsTagsIndexes = new Map([]);
    topicsJson?.topics?.forEach(topic => {
        topic?.tags?.forEach(tag => topicsTagsIndexes.set(tag, (topicsTagsIndexes.get(tag) || new Set()).add(topic)));
    });
    othersTopicJson.tags = new Set();
    newestTopicJson.passages = new Array(newestTopicNum);
}

function attachPostMetas(metas) {
    // 检查文章的标签，如果没有分类，就放到其他主题内
    if (metas.tags) {
        metas.tags?.forEach(tag => {
            if (!topicsTagsIndexes.get(tag)) {
                othersTopicJson.tags.add(tag);
            }
        })
    }
    // 根据 meta 内的 mdate 排序，只保存前 newestTopicsCount 篇文章
    newestTopicJson.passages.push(metas);
    newestTopicJson.passages.sort(({ mdate: m1 }, { mdate: m2 }) => {
        return new Date(m2) - new Date(m1);
    });
    newestTopicJson.passages = newestTopicJson.passages.slice(0, newestTopicNum);
}

function getTopicsJson() {
    // 将未分类文章的标签转为数组
    othersTopicJson.tags = Array.from(othersTopicJson.tags);
    // 整理最新更新的标签
    newestTopicJson.tags = new Set();
    newestTopicJson.passages.forEach(passage => {
        passage.tags?.forEach(tag => newestTopicJson.tags.add(tag));
    });
    newestTopicJson.tags = Array.from(newestTopicJson.tags);
    return {
        topics: [
            newestTopicJson,
            ...topicsJson.topics,
            othersTopicJson
        ]
    };
}

module.exports = {
    getTopicsJson,
    init,
    attachPostMetas
};
