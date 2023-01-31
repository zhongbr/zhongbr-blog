import React, { Suspense, useRef } from 'react';
import { useRoutes } from 'react-router-dom';
import { registerPlugins } from '@zhongbr/code-sandbox';
import { EsmToAmdPlugin, JsxPlugin } from '@zhongbr/code-sandbox/plugins/babel';
// @ts-ignore
import { ReactPolyfill } from '@zhongbr/code-sandbox/plugins/react';

import routers from "@/config/routers";
import { navLinks, title as titleText, titleLink } from '@/config/meta';
import { useInitCopy } from '@/utils/copy';

import { Icon, Layout, Splash, useMessage } from './components';
import { IPageConfig, PageConfigContext, ResponsiveEnum, usePersistFn, useStates, useThemeManager, useResponsive } from './hooks';

import "./app.less";

registerPlugins([
    new EsmToAmdPlugin(),
    new JsxPlugin(),
    new ReactPolyfill()
]);

const setBodyTheme = (theme: string) => {
    document.body.classList.forEach((className) => {
        if (className.endsWith('-theme')) {
            document.body.classList.remove(className);
        }
    });
    document.body.classList.add(theme);
};

function App() {
    const element = useRoutes(routers);
    const ref = useRef<HTMLDivElement>(null);

    const message = useMessage();

    const [states, setStates, resetStates] = useStates<IPageConfig>({
        title: titleText,
        target: titleLink,
        loading: true,
        theme: 'light-theme',
        widthLevel: ResponsiveEnum.normal,
        screenWidth: window.innerWidth,
    });

    const setTheme = usePersistFn((theme: string) => {
        setStates({ theme });
        setBodyTheme(theme);
    });

    useInitCopy();

    useThemeManager((theme) => {
        const localTheme = localStorage.getItem('theme');
        if (localTheme) {
            setTheme(localStorage.getItem('theme') as string);
            if (theme !== localTheme) {
                message.success({
                    title: '主题变化提醒',
                    content:
                        <span>检测到系统主题发生变化，
                        <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                setStates({ theme })
                            }}
                        >
                            <Icon className="rp-faxian"/>
                            点击同步切换
                        </span>
                    </span>
                });
            }
            return;
        }
        setTheme(theme);
    });

    useResponsive((level, width) => {
        setStates({
            widthLevel: level,
            screenWidth: width
        });
    });

    const onPageReady = usePersistFn(() => {
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
        <PageConfigContext.Provider value={{ ...states, scrollRef: ref, setStates, resetStates, setTheme, onPageReady }}>
            <Layout
                title={title}
                navLinks={navLinks}
                contentRef={ref}
                footerProps={states.footer}
            >
                <Suspense fallback={splash}>
                    {states.loading && splash}
                    <div style={{ visibility: states.loading ? 'hidden' : 'visible', height: '100%' }}>
                        {element}
                    </div>
                </Suspense>
            </Layout>
        </PageConfigContext.Provider>
    );
}

export default App;
