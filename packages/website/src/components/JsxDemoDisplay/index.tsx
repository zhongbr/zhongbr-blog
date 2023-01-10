import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';

import { defaultManager, IModule, IAmdManager } from '@/utils/amd';
import { ISuspenseWrapper, suspensePromise } from '@/hooks/useSuspense';

import ErrorDisplay from '../ErrorDisplay';
import Splash from '../Splash';
import ErrorBoundary from '../ErrorBoundary';
import Module from './module';
import styles from './style.module.less';

export interface IProps {
    jsx: string;
    moduleManagerRef?: React.MutableRefObject<IAmdManager | undefined>;
}

// 用于区分每个组件对应模块的id
let displayId = 0;

const JsxDemoDisplay: React.FC<IProps> = (props) => {
    const { jsx, moduleManagerRef } = props;

    const moduleName = useMemo(() => `__DisplayModule${displayId++}`, []);

    const onFallback = (reset: () => void, error?: Error) => {
        const fallback = () => {
            moduleDispose = (moduleManagerRef?.current || defaultManager).define(moduleName, ['require'], previousJsx);
            reset();
        };

        return (
            <div className={styles.errorFallback}>
                <div className={styles.title}>
                    ❌ Demo执行出错了，检查下代码吧 😭😭
                </div>
                <ErrorDisplay error={error}/>
                <div>
                    <button className={styles.retryBtn} onClick={fallback}>点击此处重试</button>
                </div>
            </div>
        );
    }

    const ref = useRef(['', '']);
    const [previousJsx, previousModuleName] = ref.current;

    let moduleDispose = () => {};
    let eventDispose = () => {};
    const [,forceUpdate] = useState({});
    if (previousJsx !== jsx || previousModuleName !== moduleName) {
        ref.current = [jsx, moduleName];
        moduleDispose = (moduleManagerRef?.current || defaultManager).define(moduleName, ['require'], jsx);
        // 监听模块更新，刷新 demo
        // TODO: 目前监听了所有的模块更新，后续支持只监听使用到的模块
        eventDispose = (moduleManagerRef?.current || defaultManager).onModuleUpdate(undefined, () => {
            // 删除模块的缓存
            (moduleManagerRef?.current || defaultManager).require_.cache.delete(moduleName);
            // 强制刷新组件
            forceUpdate({});
        });
    }

    // 组件卸载后，卸载对应的模块和时间监听
    useEffect(() => {
        moduleDispose();
        eventDispose();
    }, []);

    const module_ = suspensePromise((moduleManagerRef?.current || defaultManager).require_(moduleName));

    return (
        <Suspense fallback={<Splash texts="🚀 加载中" />}>
            <ErrorBoundary
                renderFallback={onFallback}
            >
                <Module _module={module_ as ISuspenseWrapper<IModule>}/>
            </ErrorBoundary>
        </Suspense>
    );
};

JsxDemoDisplay.displayName = 'JsxDemoDisplay';
export default JsxDemoDisplay;
