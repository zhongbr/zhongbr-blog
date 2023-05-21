import TopicJSON from '@/app/posts/article/md/topic.json';
import CatalogueJSON from '@/app/posts/article/md/catalogue.json';

export interface IPassage {
    title: string;
    tags: string[];
    author: string;
    summary: string;
    mdate: string;
    'header-img': string;
    'json-path': string;
    cover: string;
    icon: string;
    visible: boolean;
}

export interface ITopic {
    id: string;
    icon: string;
    topicName: string;
    desc: string;
    tags: string[];
    color?: string;
    passages?: Array<IPassage>;
}

export interface ICatalogue {
    [filename: string]: IPassage;
}

/**
 * 读取博客主题列表
 */
export async function getTopics() {
    return TopicJSON as unknown as { topics:  ITopic[]; };
}

/**
 * 获取目录
 */
export async function getCatalogue() {
    return CatalogueJSON as unknown as ICatalogue;
}
