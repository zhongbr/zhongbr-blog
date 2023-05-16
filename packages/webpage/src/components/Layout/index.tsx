import React, { useRef } from "react";
import clsx from "clsx";

import Header, { IProps as HeaderProps } from './header';
import Footer, { IProps as FooterProps } from './footer';
import styles from './style.module.less';
import { useScrollRate } from "@/animations";

export interface IProps {
    /** website logo */
    logo?: React.ReactNode;
    /** blog title */
    title?: React.ReactNode;
    /** nav links on header */
    navLinks?: HeaderProps['navLinks'];
    /** children */
    children?: React.ReactNode;
    /** content ref */
    contentRef?: React.LegacyRef<HTMLDivElement>;
    /** footer */
    footerProps?: FooterProps;
}

const Layout: React.FC<IProps> = (props) => {
    const { title = 'react-press', navLinks, children, contentRef, footerProps } = props;

    const ref_ = useRef<HTMLDivElement>(null);

    const { rate } = useScrollRate(contentRef || ref_, 60);

    return (
        <div className={styles.layout}>
            <Header
                title={title}
                navLinks={navLinks}
                rate={rate}
            />
            <div
                className={clsx(styles.contentContainer)}
                ref={contentRef}
                style={{ '--scroll-header-height': `${(75 * (1 - rate)).toFixed(2)}px` } as React.CSSProperties}
            >
                {children}
                {footerProps && (
                    <Footer
                        className={styles.footer}
                        {...footerProps}
                    />
                )}
            </div>
        </div>
    );
}

export default Layout;
