/*
 * @Description: table
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:38:16
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:37:42
 */
import React from 'react';
import { IBaseProps } from '@/types/markdown';
import styles from './style.module.less';

const Table: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    return (
        <table
            id={node.key}
            className={styles.table}
        >
            {children}
        </table>
    );
};

export default Table;
