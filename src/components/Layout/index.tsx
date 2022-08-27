/*
 * @Description: Layouts
 * @Author: 张盼宏
 * @Date: 2022-08-27 09:41:18
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-27 23:51:20
 */

import React from "react";
import clsx from 'clsx';

import Header, { IProps as HeaderProps } from './header';
import styles from './style.module.less';

console.log(styles);

export interface IProps {
    /** website logo */
    logo?: React.ReactNode;
    /** theme scope */
    theme?: string;
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
}

const Layout: React.FC<IProps> = (props) => {
    const { title = 'react-press', theme = 'default-theme', navLinks, children, rate, contentRef } = props;

    return (
        <div className={clsx([styles.layout, theme])}>
            <Header
                title={title}
                navLinks={navLinks}
                rate={rate}
            />
            <div className={styles.contentContainer} ref={contentRef}>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Layout;
