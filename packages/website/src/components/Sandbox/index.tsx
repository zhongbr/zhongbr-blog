import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import CodeSandbox from '@zhongbr/code-sandbox';

import Splash from '../Splash';
import styles from './style.module.less';

export interface IProps {
    indexCode: string;
    settingsCode: string;
    demoCode: string;
    cssCode: string;
    className?: string;
}

const Sandbox: React.FC<IProps> = props => {
    const { settingsCode, demoCode, indexCode, cssCode, className } = props;

    const [loading, setLoading] = useState(true);
    const [loadingModuleName, setLoadingModuleName] = useState(['', '']);

    const onLoadingModule = (moduleName: string, url: string) => {
        setLoadingModuleName([moduleName, url]);
    };

    const onReady = () => {
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
    }, [demoCode, indexCode, settingsCode, cssCode, setLoading]);

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
            <CodeSandbox
                className={styles.iframe}
                code={demoCode}
                index={indexCode}
                settings={settingsCode}
                css={cssCode}
                onLoadingModule={onLoadingModule}
                onReady={onReady}
            />
        </div>
    );
};

Sandbox.displayName = 'Sandbox';
export default Sandbox;
