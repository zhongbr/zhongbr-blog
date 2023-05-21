import React, { useMemo } from 'react';
import clsx from 'clsx';
import { IBaseProps } from '@/types/markdown';
import styles from './style.module.scss';
import { nodeParent } from '@/components/Article/utils/traverse';

const TableCell: React.FC<IBaseProps> = (props) => {
    const { node, ast, children } = props;

    // get align configs from father and grandfather node
    const father = nodeParent(ast, node);
    const grandfather = nodeParent(ast, father);

    let align: React.CSSProperties['textAlign'] = 'center', isThead = false;
    if (father && grandfather) {
        const index = father.children.indexOf(node.key || '');
        align = grandfather.align?.[index] || 'center';
        isThead = grandfather?.children?.indexOf(father.key || '') === 0;
    }

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
