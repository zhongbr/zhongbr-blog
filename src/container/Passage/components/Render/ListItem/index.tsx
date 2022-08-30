/*
 * @Description: list item
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:44:30
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:36:09
 */
import React from 'react';
import { IBaseProps } from '@/types/markdown';

const ListItem: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    return (
        <li id={node.key}>
            {children}
        </li>
    );
};

export default ListItem;
