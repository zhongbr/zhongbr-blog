import clsx from 'clsx';
import React from 'react';

import styles from './index.module.scss';
import './rp.css';

export interface IIconProps {
    /** icon font class name */
    className: string;
    text?: string;
    textClassName?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export default function Icon(props: IIconProps) {
    const { className, text, textClassName, onClick } = props;

    const icon = <i
        onClick={onClick}
        style={{ fontSize: 'unset' }}
        className={clsx(['iconfont', className])}
    />;

    if (!text) {
        return icon;
    }

    return (
        <div className={styles.iconTextContainer} onClick={onClick}>
            <div className={styles.icon}>
                {icon}
            </div>
            <div className={clsx(textClassName, styles.textContainer)}>
                {text}
            </div>
        </div>
    );
}
