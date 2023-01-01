import React, { useMemo } from 'react';
import moment from 'moment';

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
                <a href="https://beian.miit.gov.cn">鄂ICP备19008487号-1</a>
                <a href="http://beian.gov.cn/portal/registerSystemInfo?recordcode=42011102003165">鄂公网安备42011102003165号</a>
            </div>
            <div>
                ©Zhongbr {date.year()}
            </div>
        </div>
    );
}

Footer.displayName = 'Footer';
export default Footer;
