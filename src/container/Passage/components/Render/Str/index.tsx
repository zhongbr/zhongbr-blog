/*
 * @Description: texts
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:44:22
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:37:00
 */
import React from 'react';
import { IBaseProps } from '@/types/markdown';

const Str: React.FC<IBaseProps> = (props) => {
    const { node } = props;

    return (
        <span id={node.key}>{node.value}</span>
    );
};

export default Str;
