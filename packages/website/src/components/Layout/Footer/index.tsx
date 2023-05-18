'use client';
import React from 'react';

import styles from './index.module.scss';

export interface IFooterProps {
    copyright?: { author: string; homepage: string; };
}

const Footer: React.FC<IFooterProps> = (props) => {
    const { copyright } = props;

    return (
        <div className={styles.footer_box}>
            <div className={styles.copyright}>
                <span>©</span>
                <a target="_blank" href={copyright?.homepage}>{copyright?.author} {new Date().getFullYear()}</a>
            </div>
        </div>
    );
};

export default Footer;
