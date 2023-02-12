import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import CodeSandbox, { CodeSandboxDom } from '@zhongbr/code-sandbox';

import Icon from "../Icon";
import Splash from '../Splash';
import styles from './style.module.less';

export interface IProps {
    indexCode?: string;
    htmlCode?: string;
    demoCode: string;
    cssCode?: string;
    className?: string;
}

const Sandbox: React.FC<IProps> = props => {
    const { htmlCode, demoCode, indexCode, cssCode, className } = props;

    const [loading, setLoading] = useState(true);
    const [loadingModuleName, setLoadingModuleName] = useState(['', '']);

    const sandbox = useRef<CodeSandboxDom>(null);

    const onLoadingModule = (moduleName: string, url: string) => {
        setLoadingModuleName([moduleName, url]);
    };

    const onReady = () => {
        setLoading(false);
    }

    const onFullScreen = () => {
        sandbox.current?.iframe.requestFullscreen();
    };

    const onRefresh = async () => {
        await sandbox.current?.refresh();
    };

    useEffect(() => {
        setLoading(true);
    }, [demoCode, indexCode, htmlCode, cssCode, setLoading]);

    return (
        <div className={clsx(className, styles.sandboxContainer)}>
            <div className={styles.header}>
                <div className={styles.right}>
                    <div className={styles.item} onClick={onRefresh}>
                        <Icon className="rp-daichuli"/>
                        <span>刷新</span>
                    </div>
                    <div className={styles.item} onClick={onFullScreen}>
                        <Icon className="rp-jiankong1"/>
                        <span>全屏</span>
                    </div>
                </div>
            </div>
            <div className={styles.body}>
                {loading && (
                    <div className={styles.splash}>
                        <Splash
                            texts={
                                <div className={styles.packageInfo}>
                                    <div className={styles.name}>🚀 {loadingModuleName?.[0]} 加载中...</div>
                                    <div className={styles.url}>{loadingModuleName?.[1]}</div>
                                </div>
                            }
                            full={false}
                        />
                    </div>
                )}
                <CodeSandbox
                    className={clsx(styles.iframe, {[styles.notFullScreen]: false})}
                    code={demoCode}
                    index={indexCode}
                    html={htmlCode}
                    css={cssCode}
                    onLoadingModule={onLoadingModule}
                    onReady={onReady}
                    ref={sandbox}
                />
            </div>
        </div>
    );
};

Sandbox.displayName = 'Sandbox';
export default Sandbox;
