/*
 * @Description: horizontal rule
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:44:58
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:34:51
 */
import React from 'react';
import { IBaseProps } from '@/types/markdown';
import styles from './style.module.less';

const HorizontalRule: React.FC<IBaseProps> = (props) => {
    const { node } = props;
    return (
        <div id={node.key} className={styles.horizontalRule}/>
    );
};

export default HorizontalRule;
