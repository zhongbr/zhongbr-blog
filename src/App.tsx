/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-08-27 10:15:53
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-27 23:41:13
 */
import React from 'react';
import { useRoutes } from 'react-router-dom';

import { Layout, Icon } from './components'
import { PageConfigContext, IPageConfig, useStates } from './hooks';
import { useScrollRate } from './animations';
import { title, navLinks, titleLink } from './config/meta';
import routers from "@/config/routers";

import "./app.less";

function App() {
    const router = useRoutes(routers);

    const { rate, ref } = useScrollRate(100);
    const [states, setStates] = useStates<IPageConfig>({
        title: title,
        target: titleLink
    })

    return (
        <Layout
            rate={rate}
            title={
                <span className="title">
                    <Icon className="rp-yuedu icon"/>
                    {states.title}
                </span>
            }
            navLinks={navLinks}
        >
            <PageConfigContext.Provider value={{ ...states, scrollRef: ref, setStates }}>
                {router}
            </PageConfigContext.Provider>
        </Layout>
    );
}

export default App;
