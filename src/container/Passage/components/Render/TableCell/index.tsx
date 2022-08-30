/*
 * @Description: table cell
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:43:54
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:38:18
 */
import React, { useMemo } from 'react';
import clsx from 'clsx';
import { IBaseProps } from '@/types/markdown';
import styles from './style.module.less';

const TableCell: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    // get align configs from father and grandfather node
    const father = node.parent;
    const grandfather = father?.parent;
    const align = useMemo(() => {
        if (!father || !grandfather) {
            return 'center';
        }
        const index = father.children.indexOf(node);
        return grandfather.align?.[index] || 'center';
    }, [node, father, grandfather]);

    // justify if it is in the table header
    const isThead = useMemo(() => {
        if (!father || !grandfather) {
            return false;
        }
        const index = grandfather?.children?.indexOf(father);
        return index === 0;
    }, [father, grandfather]);

    return (
        <td
            id={node.key}
            className={clsx([styles.tableCell], { [styles.header]: isThead })}
            style={{ textAlign: isThead ? 'center' : align }}
        >
            {children}
        </td>
    );
};

export default TableCell;
