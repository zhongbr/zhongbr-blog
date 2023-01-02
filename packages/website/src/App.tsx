/*
 * @Description: 入口
 * @Author: 张盼宏
 * @Date: 2022-08-27 10:15:53
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-11 10:46:58
 */
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import routers from "@/config/routers";
import { title as titleText, navLinks, titleLink } from '@/config/meta';

import { Layout, Icon, Splash, MessageProvider } from './components';
import { PageConfigContext, IPageConfig, useStates, usePersistFn, useDarkMode } from './hooks';
import { useScrollRate } from './animations';

import "./app.less";

function App() {
    const element = useRoutes(routers);

    const { setTheme } = useDarkMode();

    const { rate, ref } = useScrollRate<HTMLDivElement>(60);
    const [states, setStates, resetStates] = useStates<IPageConfig>({
        title: titleText,
        target: titleLink,
        loading: true
    });

    const onPageReady = usePersistFn(() => {
        console.log('on page ready');
        setStates({
            loading: false
        });
    });

    const title = (
        <span className="title">
            <Icon className="rp-quanyi icon"/>
            {states.title}
        </span>
    );

    const splash = <Splash texts="🚀🚀页面加载中..."/>;

    return (
        <PageConfigContext.Provider value={{ ...states, rate, scrollRef: ref, setStates, resetStates, setTheme, onPageReady }}>
            <MessageProvider>
                <Layout
                    rate={rate}
                    title={title}
                    navLinks={navLinks}
                    contentRef={ref}
                    footerProps={states.footer}
                >
                    <Suspense fallback={splash}>
                        {states.loading && splash}
                        <div style={{ display: states.loading ? 'none' : 'block' }}>
                            {element}
                        </div>
                    </Suspense>
                </Layout>
            </MessageProvider>
        </PageConfigContext.Provider>
    );
}

export default App;
