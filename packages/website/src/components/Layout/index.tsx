import React from 'react';

import { FCWithChildren } from '@/types/react';
import Header, { IHeaderProps } from './Header';
import Footer, { IFooterProps } from './Footer';

import styles from './index.module.scss';

export interface ILayoutProps {
    headerPadding?: boolean;
    headerProps: IHeaderProps;
    footerProps: IFooterProps;
}

const ContainerElementId = '_container_element_id';
export const getContainerElement = () => document.getElementById(ContainerElementId);

const Layout: FCWithChildren<ILayoutProps> = (props) => {
    const { children, headerPadding = true, headerProps, footerProps } = props;

    return (
        <div id={ContainerElementId} className={styles.page}>
            <Header {...headerProps} />
            {headerPadding && <div className={styles.content_box_padding} />}
            {children}
            <Footer {...footerProps}/>
        </div>
    );
};

export default Layout;
