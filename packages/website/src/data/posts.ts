import { resolve } from 'path';
import { readFile } from 'fs/promises';

const POSTS_JSON_PATH = resolve(process.cwd(), '../', './demo-site/.md-cache/md');

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
    'use server';
    const file = await readFile(resolve(POSTS_JSON_PATH, './topic.json'));
    return JSON.parse(file.toString()) as { topics: ITopic[]; };
}

/**
 * 获取目录
 */
export async function getCatalogue() {
    'use server';
    const file = await readFile(resolve(POSTS_JSON_PATH, './catalogue.json'));
    return JSON.parse(file.toString()) as ICatalogue;
}

/**
 * 获取文章
 * @param path
 */
export async function getPassage(path: string) {
    'use server';
    const file = await readFile(resolve(POSTS_JSON_PATH, `./${path}`));
    return JSON.parse(file.toString()) as IPassage;
}
