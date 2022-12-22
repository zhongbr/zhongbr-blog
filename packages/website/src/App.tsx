/*
 * @Description: 入口
 * @Author: 张盼宏
 * @Date: 2022-08-27 10:15:53
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-11 10:46:58
 */
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import Pager from '@mui/material/Paper';

import routers from "@/config/routers";
import { title as titleText, navLinks, titleLink } from '@/config/meta';

import { Layout, Icon, Loading } from './components';
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
                <Suspense fallback={
                    <Pager>
                        <Loading texts="页面加载中..."/>
                    </Pager>
                }>
                    {element}
                </Suspense>
            </PageConfigContext.Provider>
        </Layout>
    );
}

export default App;
