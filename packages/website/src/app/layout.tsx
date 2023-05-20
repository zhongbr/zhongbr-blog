import React from 'react';
import { Metadata } from 'next';

import { FCWithChildren } from '@/types/react';
import { Icon, Layout } from '@/components';
import { IHeaderProps } from '@/components/Layout/Header';

import '@/styles/index.scss';
import '@/styles/no-scrollbar.scss';

const title = 'Zhongbr\'s Blog 🚀';
const navLinks: IHeaderProps['navLinks'] = [
    { title: 'Github', icon: <Icon className="rp-yaoqing" />, url: 'https://github.com/zhongbr' },
    { title: '全部文章', icon: <Icon className="rp-baogao" />, url: '/posts' },
    { title: 'Playground', icon: <Icon className="rp-faxian" />, url: '/playground' },
];

export const metadata: Metadata = {
    title,
    description: 'Always believe that something wonderful is about to happen.',
};

const getElementType = (element: JSX.Element | JSX.Element[] | undefined) => {
    if (!element || Array.isArray(element)) return {};
    return Reflect.get(element, 'type');
};

const RootLayout: FCWithChildren = ({ children }) => {
    const type = getElementType(children);
    console.log(type, Reflect.get(type, 'test'));

    return (
        <html lang="en">
            <body className="light-theme">
                <Layout
                    headerPadding={Reflect.get(type, 'headerPadding') !== false}
                    headerProps={{ title, navLinks }}
                >
                    {children}
                </Layout>
            </body>
        </html>
    );
};

export default RootLayout;
