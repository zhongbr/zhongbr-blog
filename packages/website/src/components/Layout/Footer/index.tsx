'use client';
import React from 'react';

import styles from './index.module.scss';
import { Icon } from '@/components';

export interface IFooterProps {
    copyright?: { author: string; homepage: string; };
    PublicSecurityNo: string;
    PublicSecurity?: string;
    ICP?: string;
}

const Footer: React.FC<IFooterProps> = (props) => {
    const { copyright, PublicSecurityNo, PublicSecurity, ICP } = props;

    return (
        <div className={styles.footer_box}>
            <div className={styles.beian}>
                <Icon className="rp-jiankong1" />
                <span>网站备案：</span>
                <a
                    target="_blank"
                    href="https://beian.miit.gov.cn"
                    rel="noreferrer noopener"
                >
                    {ICP}
                </a>
                <a
                    target="_blank"
                    href={`http://beian.gov.cn/portal/registerSystemInfo?recordcode=${PublicSecurityNo}`}
                    rel="noopener noreferrer"
                >
                    {PublicSecurity}
                </a>
            </div>
            <div className={styles.copyright}>
                <span>©</span>
                <a target="_blank" href={copyright?.homepage}>{copyright?.author} {new Date().getFullYear()}</a>
            </div>
        </div>
    );
};

export default Footer;
