/*
 * @Description: paragraph
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:52:35
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 19:08:58
 */
import React from 'react';
import Typography from "@mui/material/Typography";

import { IBaseProps } from '@/types/markdown';

import styles from './style.module.less';

export interface IProps extends IBaseProps {
    children: React.ReactNode;
}

const Paragraph: React.FC<IProps> = (props) => {
    const { node, children } = props;

    return (
        <Typography id={node.key} className={styles.paragraph} variant="body1" paragraph>
            {children}
        </Typography>
    );
};

export default Paragraph;
