/*
 * @Description: 头部
 * @Author: 张盼宏
 * @Date: 2022-08-27 09:47:30
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-28 01:18:50
 */
import React, {useMemo} from 'react';

import { useNavigate } from '@/hooks';

import styles from './style.module.less';
import clsx from "clsx";

export interface NavLink {
    name?: React.ReactNode;
    target?: string;
    icon?: React.ReactNode;
}

export interface IProps {
    title?: React.ReactNode;
    navLinks?: NavLink[];
    rate?: number;
}

const Header: React.FC<IProps> = (props) => {
    const { title, navLinks = [], rate = 0 } = props;

    const links = useMemo(() => {
        return [...navLinks].reverse();
    }, [navLinks]);

    const navigator = useNavigate();

    const onNavigate = (target: string) => {
        console.log('nav', target);
        navigator(target);
    };

    return (
        <div className={styles.header}>
            <div className={styles.base}>
                <div
                    className={styles.title}
                    style={{ opacity: rate }}
                >
                    {title}
                </div>

                <div className={styles.navLinks}>
                    {links.map(({ name, target = './', icon }) => (
                        <div
                            key={target}
                            className={styles.navLink}
                            onClick={() => onNavigate(target)}
                        >
                            <span>{icon}</span>
                            <span>{name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={clsx(styles.initTitle)}
                style={{
                    display: rate === 1 ? 'none' : undefined,
                    height: `${(75 * (1 - rate)).toFixed(2)}px`
                }}
            >
                <div
                    style={{
                        opacity: 1 - (rate || 0),
                        top: `-${(rate * 50).toFixed(2)}px`
                    }}
                    className={styles.title}
                >
                    {title}
                </div>
            </div>
        </div>
    );
};

export default Header;
