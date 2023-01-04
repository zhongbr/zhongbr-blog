/*
 * @Description: url link
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:45:15
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:35:38
 */
import React from 'react';

import { IBaseProps } from '@/types/markdown';

import { PagesTable } from '../../Notions';
import { staticResourceUrl } from "../../../utils/static-resource-url";

const Link: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    const url = staticResourceUrl(node.url);

    // 如果是 csv 数据，使用 Notion 组件加载
    if (url?.endsWith('.csv')) {
        return (
            <PagesTable node={node} />
        )
    }

    return (
        <a id={node.key} href={url}>{children}</a>
    );
};

export default Link;
