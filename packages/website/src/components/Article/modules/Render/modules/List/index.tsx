/*
 * @Description: list
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:44:40
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:35:49
 */
import React from 'react';
import { IBaseProps } from '@/types/markdown';

const List: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    if (node.ordered) {
        return <ol id={node.key}>{children}</ol>;
    }

    return <ul id={node.key}>{children}</ul>;
};

export default List;
