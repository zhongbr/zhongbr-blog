/*
 * @Description: yaml
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:43:41
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 19:13:53
 */
import React from 'react';

import { IBaseProps } from '@/types/markdown';
import styles from './style.module.less';

const Yaml: React.FC<IBaseProps> = (props) => {
    const { node } = props;

    return (
        <div id={node.key} className={styles.container}>
            <div className={styles.codeBlock}>{node.value}</div>
        </div>
    );
};

export default Yaml;
