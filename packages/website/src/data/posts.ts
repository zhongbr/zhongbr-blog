import { resolve } from 'path';
import { readFile } from 'fs/promises';

const POSTS_JSON_PATH = resolve(__dirname, '../../../../', './demo-site/.md-cache/md');

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

/**
 * 读取博客主题列表
 */
export async function getTopics() {
    'use server';
    const file = await readFile(resolve(POSTS_JSON_PATH, './topic.json'));
    return JSON.parse(file.toString()) as { topics: ITopic[]; };
}
