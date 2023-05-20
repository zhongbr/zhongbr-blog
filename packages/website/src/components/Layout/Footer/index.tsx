'use client';
import React from 'react';
import clsx from 'clsx';

import styles from './index.module.scss';
import { Icon } from '@/components';

const copyright = { author: 'Zhongbr\'s Blog 🚀', homepage: 'https://github.com/zhongbr' };
const ICP = '鄂ICP备19008487号-1';
const PublicSecurity = '鄂公网安备42011102003165号';
const PublicSecurityNo = '42011102003165';

export interface IFooterProps {
    className?: string;
}

const Footer: React.FC<IFooterProps> = (props) => {
    return (
        <div className={clsx(props.className, styles.footer_box, 'no-default-styles')}>
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
                <span>© Copyright</span>
                <a target="_blank" href={copyright?.homepage}>{copyright?.author} {new Date().getFullYear()}</a>
            </div>
        </div>
    );
};

export default Footer;
