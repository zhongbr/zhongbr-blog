import React from 'react';
import { IBaseProps } from '@/types/markdown';
import styles from './style.module.scss';
import { nodeParent } from '@/components/Article/utils/traverse';

const TableRow: React.FC<IBaseProps> = (props) => {
    const { node, ast, children } = props;

    const father = nodeParent(ast, node);
    const isThead = father?.children?.indexOf?.(node?.key || '') === 0;

    if (isThead) {
        return (
            <thead id={node.key} className={styles.header}>
                <tr>{children}</tr>
            </thead>
        );
    }

    return <tr id={node.key}>{children}</tr>;
};

export default TableRow;
