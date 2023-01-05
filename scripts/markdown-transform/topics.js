const path = require('path');
const glob = require('glob');

const { markdownFilesPath } = require('../../config/paths');
const utils = require('./utils');

const compareMeta = ({ mdate: m1 }, { mdate: m2 }) => {
    return new Date(m2) - new Date(m1);
};

const topicsJson = {
    topics: []
};
const topicNameIndexes = {};
const topicsIndexes = {};
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

function getPostTopic(filePath) {
    const parsedPath = path.parse(filePath);
    // 如果在顶层目录，返回未分类 others
    if (parsedPath.dir === '.') {
        return 'others';
    }
    const [,topic] = parsedPath.dir.match(/\.\/([^\/]+)/);
    return topicNameIndexes[topic];
}

async function init() {
    othersTopicJson.tags = new Set();
    newestTopicJson.passages = new Array(newestTopicNum);

    topicsIndexes['others'] = othersTopicJson;
    topicsIndexes['newest'] = newestTopicJson;

    // 读取一级目录下的 topic.yaml，确定首页展示的栏目
    return new Promise((resolve, reject) => {
        glob(
            './*/topic.yaml',
            {
                cwd: markdownFilesPath
            },
            (err, topics) => {
                if (err) {
                    reject(err);
                    return;
                }
                Promise.all(topics.map(async topic => {
                    const yaml = await utils.readYaml(undefined, path.join(markdownFilesPath, topic));
                    const json = yaml.topic;
                    if (!json) {
                        return;
                    }
                    topicsJson.topics.push(json);
                    topicsIndexes[json.id] = json;
                    topicNameIndexes[json.topicName] = json.id;
                    json.tags = new Set();
                })).then(resolve, reject);
            }
        )
    });
}

function attachPostMetas(metas, filePath) {
    // 通过文章的路径，解析 topic
    const topic = getPostTopic(filePath);
    // 将文章的标签加入到 topic 的 tags 中
    if (metas.tags) {
        metas.tags.forEach(tag => {
            topicsIndexes[topic].tags.add(tag);
        })
    }
    // 如果文章有设置推荐，则加入对应的栏目
    if (metas.recommend && topicsIndexes[metas.recommend]) {
        topicsIndexes[metas.recommend].passages = topicsIndexes[metas.recommend].passages || [];
        topicsIndexes[metas.recommend].passages.push(metas);
    }
    // 根据 meta 内的 mdate 排序，只保存前 newestTopicsCount 篇文章
    newestTopicJson.passages.push(metas);
    newestTopicJson.passages.sort(compareMeta);
    newestTopicJson.passages = newestTopicJson.passages.slice(0, newestTopicNum);
}

function getTopicsJson() {
    // 为所有主题的文章进行排序
    topicsJson.topics?.forEach(topic => {
       topic.passages?.sort(compareMeta);
       topic.tags = Array.from(topic.tags);
    });
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
