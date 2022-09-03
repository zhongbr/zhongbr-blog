/*
 * @Description: image
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:45:24
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 19:19:24
 */
import React from 'react';
import { IBaseProps } from '@/types/markdown';
import styles from './style.module.less';

const Image: React.FC<IBaseProps> = (props) => {
    const { node } = props;

    return (
        <img
            id={node.key}
            className={styles.img}
            src={node.url}
            alt={node.alt}
        />
    );
};

export default Image;
