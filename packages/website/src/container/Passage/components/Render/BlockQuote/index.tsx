/*
 * @Description: quote block
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:45:58
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 18:55:36
 */
import React from 'react';
import Paper from "@mui/material/Paper";

import { IBaseProps } from '@/types/markdown';
import styles from './style.module.less';

const BlockQuote: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    return (
        <Paper id={node.key} className={styles.blockQuote} variant="outlined">
            {children}
        </Paper>
    );
};

export default BlockQuote;
