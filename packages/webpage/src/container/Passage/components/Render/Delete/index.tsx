/*
 * @Description: texts with delete line
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:46:15
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:33:44
 */
import React from 'react';
import { IBaseProps } from '@/types/markdown';
import styles from './style.module.less';

const Delete: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    return (
        <span id={node.key} className={styles.delete}>{children}</span>
    );
};

export default Delete;
