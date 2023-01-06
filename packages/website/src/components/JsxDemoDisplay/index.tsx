import React, { useMemo, Suspense, useState } from 'react';
import * as ReactNamespace from 'react';
import { getService } from 'jsx-service';

import { useAsyncEffect } from '@/hooks';
import { define, IModule, _require } from '@/utils/amd';
import { ISuspenseWrapper, suspensePromise } from '@/hooks/useSuspense';

import Splash from '../Splash';
import Module from './module';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'worker!@/jsx-service.worker.js';

// JSX代码转换 worker 服务
const service = getService(new Worker(worker, { type: 'module' }));

export interface IProps {
    jsx: string;
}

// 用于区分每个组件对应模块的id
let displayId = 0;

// 声明 AMD 模块供内部调用
define('react', async () => ({
    'default': React,
    ...ReactNamespace
}));

const JsxDemoDisplay: React.FC<IProps> = props => {
    const { jsx } = props;

    const moduleName = useMemo(() => `DisplayModule${displayId++}`, []);
    const [ready, setReady] = useState(false);

    useAsyncEffect(async () => {
        setReady(false);
        const result = await service.transformJsxCode(jsx, 10000);
        // eslint-disable-next-line no-eval
        define(moduleName, eval(result.params.code));
        setReady(true);
    }, [jsx, moduleName]);

    const fallback = <Splash texts="🚀 加载中" />;

    if (!ready) {
        return fallback;
    }

    const _module = suspensePromise(_require(moduleName));

    return (
        <Suspense fallback={fallback}>
            <Module _module={_module as ISuspenseWrapper<IModule>}/>
        </Suspense>
    );
};

JsxDemoDisplay.displayName = 'JsxDemoDisplay';
export default JsxDemoDisplay;
