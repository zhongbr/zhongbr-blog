import React from 'react';
import clsx from "clsx";

import styles from './group.module.less';

export interface IProps {
    rowCount?: number;
    gap?: string;
    className?: string;
    children: React.ReactNode;
}

const Group: React.FC<IProps> = props => {
    const { rowCount=3, gap='16px', className, children } = props;

    return (
        <div
            className={clsx(styles.cardGroup, className)}
            style={{ '--gap': gap, '--row-count': rowCount } as React.CSSProperties}
        >
            {children}
        </div>
    );
};

Group.displayName = 'Group';
export default Group;
