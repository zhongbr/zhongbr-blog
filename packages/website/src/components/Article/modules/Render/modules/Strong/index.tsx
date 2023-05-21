/*
 * @Description: strong texts
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:43:18
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:37:19
 */
import React from 'react';
import { IBaseProps } from '@/types/markdown';
import styles from './style.module.scss';

const Strong: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    return (
        <span id={node.key} className={styles.strong}>{children}</span>
    );
};

export default Strong;
