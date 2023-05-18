import React from 'react';

import { FCWithChildren } from '@/types/react';
import Header, { IHeaderProps } from './Header';
import Footer, { IFooterProps } from './Footer';

import styles from './index.module.scss';

export interface ILayoutProps {
    headerProps: IHeaderProps;
    footerProps: IFooterProps;
}

const Layout: FCWithChildren<ILayoutProps> = (props) => {
    const { children, headerProps, footerProps } = props;

    return (
        <div>
            <Header {...headerProps} />
            <div className={styles.content_box}>
                {children}
            </div>
            <Footer {...footerProps}/>
        </div>
    );
};

export default Layout;
