import React, { useRef, useMemo, useState } from 'react';
import clsx from 'clsx';

import { useMessage } from '@/hooks';

import Splash from '../Splash';
import { useIframeModule } from './hooks';
import styles from './style.module.less';
import { IMessageType } from "@/types/iframe-sandbox";

export interface IProps {
    indexCode: string;
    settingsCode: string;
    demoCode: string;
    className?: string;
}

const Sandbox: React.FC<IProps> = props => {
    const { settingsCode, demoCode, indexCode, className } = props;
    const ref = useRef<HTMLIFrameElement>(null);
    const [loadingModuleName, setLoadingModuleName] = useState(['', '']);

    const [depsName, indexName, moduleName] = useMemo(() => {
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
    useMessage((e) => {
        return e.source === ref.current?.contentWindow && e.data?.type === IMessageType.LoadingModule;
    }, (e: MessageEvent) => {
        const [moduleName, url] = e.data.payload || [];
        setLoadingModuleName([moduleName, url]);
    });

    return (
        <div className={clsx(className, styles.sandboxContainer)}>
            {loading && (
                <div className={styles.splash}>
                    <Splash texts={
                        <div style={{ textAlign: 'center' }}>
                            <div>🚀 {loadingModuleName?.[0]} 加载中...</div>
                            <div>{loadingModuleName?.[1]}</div>
                        </div>}
                    />
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
