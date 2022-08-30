/*
 * @Description: title headers
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:45:44
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:34:20
 */
import React from 'react';

import { useNavigate } from "@/hooks";
import { IBaseProps } from '@/types/markdown';

import styles from './style.module.less';

const Header: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    const navigator = useNavigate();

    const onClickTitle = () => {
        navigator(`#${node.key}`);
    };

    switch (node.depth) {
        case 1:
            return (
                <h1
                    id={node.key}
                    className={styles.title}
                    onClick={onClickTitle}
                >
                    {children}
                </h1>);
        case 2:
            return (
                <h2
                    id={node.key}
                    className={styles.title}
                    onClick={onClickTitle}
                >
                    {children}
                </h2>);
        case 3:
            return (
                <h3
                    id={node.key}
                    className={styles.title}
                    onClick={onClickTitle}
                >
                    {children}
                </h3>);
        case 4:
            return (
                <h4
                    id={node.key}
                    className={styles.title}
                    onClick={onClickTitle}
                >
                    {children}
                </h4>);
        case 5:
            return (
                <h5
                    id={node.key}
                    className={styles.title}
                    onClick={onClickTitle}
                >
                    {children}
                </h5>);
        default:
            return (
                <span
                    id={node.key}
                    className={styles.title}
                    onClick={onClickTitle}
                >
            {children}
        </span>);
    }
};

export default Header;
