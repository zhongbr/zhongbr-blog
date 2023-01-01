import React, { useMemo } from 'react';
import moment from 'moment';

import { ICP, PublicSecurity, PublicSecurityNo, AuthorCopyRight } from '@/config/meta';
import Icon from '@/components/Icon';

import styles from './style.module.less';

const Footer: React.FC = () => {
    const date = useMemo(() => moment(), []);

    return (
        <div className={styles.footer}>
            <div className={styles.beian}>
                <span>
                    <Icon className="rp-zixun"/>
                    <span style={{ marginLeft: '8px' }}>网站备案</span>
                </span>
                <a href="https://beian.miit.gov.cn">{ICP}</a>
                <a href={`http://beian.gov.cn/portal/registerSystemInfo?recordcode=${PublicSecurityNo}`}>{PublicSecurity}</a>
            </div>
            <div>
                ©{AuthorCopyRight} {date.year()}
            </div>
        </div>
    );
}

Footer.displayName = 'Footer';
export default Footer;
