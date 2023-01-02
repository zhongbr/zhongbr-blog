/*
 * @Description: Layouts
 * @Author: 张盼宏
 * @Date: 2022-08-27 09:41:18
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-28 01:18:50
 */

import React from "react";

import { useInitCopy } from '@/utils/copy';
import Header, { IProps as HeaderProps } from './header';
import Footer, { IProps as FooterProps } from './footer';
import styles from './style.module.less';

export interface IProps {
    /** website logo */
    logo?: React.ReactNode;
    /** blog title */
    title?: React.ReactNode;
    /** nav links on header */
    navLinks?: HeaderProps['navLinks'];
    /** children */
    children?: React.ReactNode;
    /** rate */
    rate?: number;
    /** content ref */
    contentRef?: React.LegacyRef<HTMLDivElement>;
    /** footer */
    footerProps?: FooterProps;
}

const Layout: React.FC<IProps> = (props) => {
    const { title = 'react-press', navLinks, children, rate, contentRef, footerProps } = props;

    useInitCopy();

    return (
        <div className={styles.layout}>
            <Header
                title={title}
                navLinks={navLinks}
                rate={rate}
            />
            <div className={styles.contentContainer} ref={contentRef}>
                <div className={styles.padding} />
                <div className={styles.content}>
                    {children}
                </div>
                {footerProps && (
                    <Footer {...footerProps}/>
                )}
            </div>
        </div>
    );
}

export default Layout;
