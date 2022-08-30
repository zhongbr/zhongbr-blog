/*
 * @Description: table row
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:43:31
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:38:34
 */
import React, { useMemo } from 'react';
import { IBaseProps } from '@/types/markdown';
import styles from './style.module.less';

const TableRow: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    // justify if it is the table header
    const father = node.parent;
    const isThead = useMemo(() => {
        const index = father?.children?.indexOf(node);
        return index === 0;
    }, [father?.children, node]);

    if (isThead) {
        return (
            <thead id={node.key} className={styles.header}>
                <tr>{children}</tr>
            </thead>
        );
    }

    return <tr id={node.key}>{children}</tr>
};

export default TableRow;
