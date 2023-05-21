/*
 * @Description: html block
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:45:31
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:35:03
 */
import React from 'react';
import { IBaseProps } from '@/types/markdown';

const Html: React.FC<IBaseProps> = (props) => {
    const { node } = props;

    return (
        <div id={node.key} dangerouslySetInnerHTML={{ __html: node.value }}/>
    );
};

export default Html;
