import React, { Suspense, useEffect, useMemo, useRef } from 'react';

import { _require, define, IModule } from '@/utils/amd';
import { ISuspenseWrapper, suspensePromise } from '@/hooks/useSuspense';

import Splash from '../Splash';
import ErrorBoundary from '../ErrorBoundary';
import Module from './module';
import styles from './style.module.less';

export interface IProps {
    jsx: string;
}

// 用于区分每个组件对应模块的id
let displayId = 0;

const JsxDemoDisplay: React.FC<IProps> = props => {
    const { jsx } = props;

    const moduleName = useMemo(() => `DisplayModule${displayId++}`, []);
    const ref = useRef(['', '']);

    const [previousJsx, previousModuleName] = ref.current || [];

    let dispose = () => {};
    const onFallback = (reset: () => void, error?: Error) => {
        const fallback = () => {
            dispose = define(moduleName, previousJsx);
            reset();
        };

        return (
            <div className={styles.errorFallback}>
                <div className={styles.title}>
                    ❌ Demo执行出错了，检查下代码吧 😭😭
                </div>
                <div className={styles.errorStack}>
                    <div className={styles.title}>
                        {error?.name}: {error?.message}
                    </div>
                    <div className={styles.content}>
                        {error?.stack}
                    </div>
                </div>
                <div>
                    <button className={styles.retryBtn} onClick={fallback}>点击此处重试</button>
                </div>
            </div>
        );
    }

    if (previousJsx !== jsx || previousModuleName !== moduleName) {
        ref.current = [jsx, moduleName];
        dispose = define(moduleName, jsx);
    }

    useEffect(() => dispose, []);

    const _module = suspensePromise(_require(moduleName));

    return (
        <Suspense fallback={<Splash texts="🚀 加载中" />}>
            <ErrorBoundary
                renderFallback={onFallback}
            >
                <Module _module={_module as ISuspenseWrapper<IModule>}/>
            </ErrorBoundary>
        </Suspense>
    );
};

JsxDemoDisplay.displayName = 'JsxDemoDisplay';
export default JsxDemoDisplay;
