/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-08-27 10:15:53
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 22:47:21
 */
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import routers from "@/config/routers";
import { title as titleText, navLinks, titleLink } from '@/config/meta';

import { Layout, Icon } from './components';
import { PageConfigContext, IPageConfig, useStates } from './hooks';
import { useScrollRate } from './animations';

import "./app.less";

function App() {
    const element = useRoutes(routers);

    const { rate, ref } = useScrollRate<HTMLDivElement>(60);
    const [states, setStates] = useStates<IPageConfig>({
        title: titleText,
        target: titleLink
    })

    const title = (
        <span className="title">
            <Icon className="rp-yuedu icon"/>
            {states.title}
        </span>
    );

    return (
        <Layout
            rate={rate}
            title={title}
            navLinks={navLinks}
            contentRef={ref}
        >
            <PageConfigContext.Provider value={{ ...states, rate, scrollRef: ref, setStates }}>
                <Suspense fallback={null}>
                    {element}
                </Suspense>
            </PageConfigContext.Provider>
        </Layout>
    );
}

export default App;
