/*
 * @Description: 头部
 * @Author: 张盼宏
 * @Date: 2022-08-27 09:47:30
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-28 01:18:50
 */
import React, { useMemo, useState } from 'react';
import clsx from 'clsx';

import { useNavigate, usePageConfig, ResponsiveEnum } from '@/hooks';

import { Switch, ISwitchProps } from '../Form';

import styles from './style.module.less';
import {Icon} from "@/components";

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
    const { setTheme, theme, widthLevel } = usePageConfig();

    const [fold, setFold] = useState(true);

    const onNavigate = (target: string) => {
        navigator(target);
    };

    const onChangeTheme: ISwitchProps['onChange'] = (value) => {
        if (value) {
            setTheme?.('dark-theme');
            return;
        }
        setTheme?.('light-theme');
    };

    const navLinksElements = (
        <div
            className={clsx(styles.navLinks)}
            data-fold={widthLevel === ResponsiveEnum.tiny}
        >
            {links.map(({name, target = './', icon}) => (
                <div
                    key={target}
                    className={styles.navLink}
                    onClick={() => onNavigate(target)}
                >
                    <span>{icon}</span>
                    <span>{name}</span>
                </div>
            ))}
            <div className={styles.switch}>
                <Switch
                    value={theme === 'dark-theme'}
                    onChange={onChangeTheme}
                    onContent={<span>🌛</span>}
                    offContent={<span>☀️</span>}
                />
            </div>
        </div>
    );

    return (
        <div className={clsx(styles.header, 'blur')}>
            <div className={styles.base}>
                <div
                    className={styles.titleContainer}
                    style={{ opacity: rate }}
                >
                    {title}
                </div>

                {widthLevel !== ResponsiveEnum.tiny ? (
                    /*屏幕宽度足够时直接平铺展示*/
                    navLinksElements
                ) : (
                    /*屏幕宽度足够时直接折叠，点击后展示*/
                    <div className={styles.foldContainer}>
                        <div onClick={() => setFold(!fold)} className={styles.fold}>
                            <Icon className={clsx('rp-arrow-down', styles.icon, fold ? styles.folded : styles.unfolded)} />
                            <span>菜单</span>
                        </div>
                        {!fold && navLinksElements}
                    </div>
                )}

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
                    className={styles.titleContainer}
                >
                    {title}
                </div>
            </div>
        </div>
    );
};

export default Header;
