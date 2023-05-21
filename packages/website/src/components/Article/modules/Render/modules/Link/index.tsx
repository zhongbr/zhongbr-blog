import React from 'react';

import { IBaseProps } from '@/types/markdown';

import styles from './style.module.scss';

const Link: React.FC<IBaseProps> = (props) => {
    const { node, children } = props;

    return (
        <a
            id={node.key}
            href={node.url}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
        >
            {children}
        </a>
    );
};

export default Link;
