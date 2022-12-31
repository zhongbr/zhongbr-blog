/*
 * @Description: catalogue
 * @Author: 张盼宏
 * @Date: 2022-08-28 12:52:39
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 23:03:48
 */
import axios from 'axios';

import { Node } from '@/types/markdown';
import { IPassage } from './catalogue';

export interface IResp {
    ast: Node;
    catalogue: IPassage;
}

export default async function getPassageContent(params: { path: string; }) {
    return await axios.get<IResp>(`/md/${params.path}?r=${Math.random()}`);
}
