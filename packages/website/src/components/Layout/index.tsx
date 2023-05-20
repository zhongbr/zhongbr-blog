import React from 'react';

import { FCWithChildren } from '@/types/react';
import Header, { IHeaderProps } from './Header';

import styles from './index.module.scss';

export interface ILayoutProps {
    headerPadding?: boolean;
    headerProps: IHeaderProps;
}

const ContainerElementId = '_container_element_id';
export const getContainerElement = () => document.getElementById(ContainerElementId);

const Layout: FCWithChildren<ILayoutProps> = (props) => {
    const { children, headerPadding = true, headerProps } = props;

    return (
        <div id={ContainerElementId} className={styles.page}>
            <Header {...headerProps} />
            {headerPadding && <div className={styles.content_box_padding} />}
            {children}
            <div style={{ overflow: 'hidden' }}/>
        </div>
    );
};

export { default as Footer } from './Footer';
export default Layout;
