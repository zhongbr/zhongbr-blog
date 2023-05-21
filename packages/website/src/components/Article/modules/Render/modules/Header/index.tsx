/*
 * @Description: title headers
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:45:44
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 19:05:48
 */
import React from 'react';

import { IBaseProps } from '@/types/markdown';

import styles from './style.module.scss';

const Header: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    const props_ = {
        id: node.key,
        className: styles.title
    };

    switch (node.depth) {
        case 1: return <h1 {...props_}>{children}</h1>;
        case 2: return <h2 {...props_}>{children}</h2>;
        case 3: return <h3 {...props_}>{children}</h3>;
        case 4: return <h4 {...props_}>{children}</h4>;
        case 5: return <h5 {...props_}>{children}</h5>;
        default: return <h6 {...props_}>{children}</h6>;
    }
};

export default Header;
