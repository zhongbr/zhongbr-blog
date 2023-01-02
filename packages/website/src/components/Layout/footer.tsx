import React, {useMemo} from 'react';
import moment from 'moment';

import {ICP, PublicSecurity, PublicSecurityNo, AuthorCopyRight} from '@/config/meta';
import Icon from '@/components/Icon';

import styles from './footer.module.less';

export interface IProps {
    showICP?: boolean;
    showPublicSecurity?: boolean;
    showCopyRight?: boolean;
    content?: React.ReactNode;
}

const Footer: React.FC<IProps> = (props) => {
    const {showICP, showPublicSecurity, showCopyRight = true, content} = props;
    const date = useMemo(() => moment(), []);

    return (
        <div className={styles.footer}>
            {(showICP || showPublicSecurity) && (
                <div className={styles.beian}>
                    <span>
                        <Icon className="rp-zixun"/>
                        <span style={{marginLeft: '8px'}}>网站备案</span>
                    </span>
                    {showICP && <a href="https://beian.miit.gov.cn">{ICP}</a>}
                    {showPublicSecurity && <a
                        href={`http://beian.gov.cn/portal/registerSystemInfo?recordcode=${PublicSecurityNo}`}
                    >
                        {PublicSecurity}
                    </a>}
                </div>
            )}
            {showCopyRight && <div>
                ©{AuthorCopyRight} {date.year()}
            </div>}
            {content}
        </div>
    );
}

Footer.displayName = 'Footer';
export default Footer;
