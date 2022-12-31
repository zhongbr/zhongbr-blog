/*
 * @Description: catalogue
 * @Author: 张盼宏
 * @Date: 2022-08-28 12:52:39
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 23:03:44
 */
import axios from 'axios';

export interface IPassage {
    title: string;
    tags: string[];
    author: string;
    summary: string;
    mdate: string;
    'header-img': string;
    'json-path': string;
    cover: string;
}

export interface ICatalogue {
    [filename: string]: IPassage;
}

export default async function getPassagesCatalogue() {
    return await axios.get<ICatalogue>('/md/catalogue.json');
}
