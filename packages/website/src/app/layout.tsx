import React from 'react';
import { Metadata } from 'next';

import { FCWithChildren } from '@/types/react';
import { Layout } from '@/components';
import { IHeaderProps } from '@/components/Layout/Header';

import '@/styles/index.scss';

const title = 'Zhongbr\'s Blog 🚀';
const navLinks: IHeaderProps['navLinks'] = [
    { title: '全部文章', icon: <span>📚</span>, url: '/test' },
    { title: 'Playground', icon: <span>🚩</span>, url: '/test' }
];

export const metadata: Metadata = {
    title,
    description: 'Always believe that something wonderful is about to happen.',
};

const RootLayout: FCWithChildren = ({ children }) => {
    return (
        <html lang="en">
            <body className="light-theme">
                <Layout
                    headerProps={{ title, navLinks }}
                    footerProps={{ copyright: { author: 'Zhongbr\'s Blog 🚀', homepage: 'https://github.com/zhongbr' } }}
                >
                    {children}
                </Layout>
            </body>
        </html>
    );
};

export default RootLayout;
