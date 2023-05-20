import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import styles from './index.module.scss';

export interface IHeaderProps {
    title: string;
    navLinks?: { title: string; icon: React.ReactNode; url: string; }[];
}

const Index: React.FC<IHeaderProps> = (props) => {
    const { title = '博客', navLinks = [] } = props;

    return (
        <div className={clsx('no-default-styles', 'blur', styles.header)}>
            <div className={styles.title}>
                <Link href="/">{title}</Link>
            </div>
            <div className={styles.nav_links}>
                {navLinks.map(link => (
                    <Link
                        className={styles.link}
                        href={link.url}
                        key={link.url + link.title}
                        target={link.url.startsWith('http') ? '_blank' : undefined}
                    >
                        {link.icon}
                        <span>{link.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Index;
