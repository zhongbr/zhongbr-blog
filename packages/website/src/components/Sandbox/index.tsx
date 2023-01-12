import React, { useRef, useMemo } from 'react';
import clsx from 'clsx';

import { useAsyncEffect } from '@/hooks';
import { sendMessage } from "@/utils/post-message";

import Splash from '../Splash';
import { useIframeModule } from './hooks';
import styles from './style.module.less';
import {IMessageType} from "@/types/iframe-sandbox";

let id = 0;

export interface IProps {
    indexCode: string;
    settingsCode: string;
    demoCode: string;
    className?: string;
}

const Sandbox: React.FC<IProps> = props => {
    const { settingsCode, demoCode, indexCode, className } = props;
    const ref = useRef<HTMLIFrameElement>(null);

    const [depsName, indexName, moduleName] = useMemo(() => {
        id++;
        return [`/Settings`, '/index', `/App`];
    }, []);

    // 监听各自依赖的代码，变更后与 iframe 内部同步
    const [settingsLoading] = useIframeModule(ref.current, depsName, [], settingsCode, {
        onAfterRun: () => refreshIndex()
    });
    const [modulesLoading] = useIframeModule(ref.current, moduleName, [depsName], demoCode, {
        onAfterRun: () => refreshIndex()
    });
    const [indexLoading, refreshIndex] = useIframeModule(ref.current, indexName, [moduleName], indexCode);

    const loading = settingsLoading || modulesLoading || indexLoading;

    return (
        <div className={clsx(className, styles.sandboxContainer)}>
            {loading && (
                <div className={styles.splash}>
                    <Splash texts={"🚀 加载中..."}/>
                </div>
            )}
            <iframe
                className={styles.iframe}
                title="display demo"
                ref={ref}
                src="/iframe.html"
                allowFullScreen
            />
        </div>
    );
};

Sandbox.displayName = 'Sandbox';
export default Sandbox;
