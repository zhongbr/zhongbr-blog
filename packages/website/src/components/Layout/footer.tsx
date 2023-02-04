import React, {useMemo} from 'react';
import moment from 'moment';
import clsx from 'clsx';

import { AuthorCopyRight, ICP, PublicSecurity, PublicSecurityNo } from '@/config/meta';
import Icon from '@/components/Icon';
import { ResponsiveEnum, usePageConfig } from '@/hooks';

import styles from './footer.module.less';

export interface IProps {
    showICP?: boolean;
    showPublicSecurity?: boolean;
    showCopyRight?: boolean;
    className?: string;
    content?: React.ReactNode;
}

const Footer: React.FC<IProps> = (props) => {
    const { showICP, showPublicSecurity, showCopyRight = true, content, className } = props;
    const date = useMemo(() => moment(), []);
    const { widthLevel } = usePageConfig();

    return (
        <div className={clsx(styles.footer, className)}>
            {(showICP || showPublicSecurity) && (
                <div className={clsx(styles.beian, widthLevel === ResponsiveEnum.tiny ? styles.tiny : undefined)}>
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
            {showCopyRight && (
                <div
                    className={styles.copyright}
                    onClick={() => window.open('https://github.com/zhongbr/zhongbr-blog', '_blank')}
                >
                    ©{AuthorCopyRight} {date.year()}
                </div>
            )}
            {content}
        </div>
    );
}

Footer.displayName = 'Footer';
export default Footer;
