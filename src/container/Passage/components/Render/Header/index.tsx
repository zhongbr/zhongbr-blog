/*
 * @Description: title headers
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:45:44
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 19:05:48
 */
import React from 'react';

import { useNavigate } from "@/hooks";
import { IBaseProps } from '@/types/markdown';

import styles from './style.module.less';
import Typography, { TypographyProps } from "@mui/material/Typography";

const variants = new Map<number, TypographyProps['variant']>([
    [1, 'h3'],
    [2, 'h4'],
    [3, 'h5'],
    [4, 'h6'],
]);

const Header: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    const navigator = useNavigate();

    const onClickTitle = () => {
        navigator(`#${node.key}`);
    };

    const variant = variants.get(node.depth || -1) || 'h6';

    return (
        <Typography
            id={node.key}
            className={styles.title}
            onClick={onClickTitle}
            variant={variant}
            gutterBottom
        >
            {children}
        </Typography>
    );
};

export default Header;
