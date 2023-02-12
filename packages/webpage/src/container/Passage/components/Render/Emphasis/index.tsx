/*
 * @Description: italic texts
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:46:23
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:34:02
 */
import React from 'react';
import { IBaseProps } from '@/types/markdown';
import styles from './style.module.less';

const Emphasis: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    return (
        <span id={node.key} className={styles.emphasis}>{children}</span>
    );
};

export default Emphasis;
