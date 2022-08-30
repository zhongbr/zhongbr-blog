/*
 * @Description: url link
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:45:15
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:35:38
 */
import React from 'react';
import { IBaseProps } from '@/types/markdown';

const Link: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    return (
        <a id={node.key} href={node.url}>{children}</a>
    );
};

export default Link;
