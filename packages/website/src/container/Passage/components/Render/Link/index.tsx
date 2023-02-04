import React from 'react';

import { IBaseProps } from '@/types/markdown';

import { PagesTable } from '../../Notions';
import { staticResourceUrl } from "../../../utils/static-resource-url";
import styles from './style.module.less';

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
        <a
            id={node.key}
            href={url}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
        >
            {children}
        </a>
    );
};

export default Link;
