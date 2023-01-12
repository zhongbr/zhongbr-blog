import React, { useLayoutEffect, useState } from 'react';
import clsx from 'clsx';

import { Sandbox } from '@/components';
import { ResponsiveEnum, usePageConfig } from '@/hooks';
import { PlaygroundGetCodeSymbol, IPlaygroundCode } from '@/types/utils';

import { DefaultDemoCode, DefaultDepsCode, DefaultIndexCode, formatDeps } from './template';
import { Editor } from './modules';
import styles from './style.module.less';

let defaultDemoCode = DefaultDemoCode,
    defaultDepsCode = DefaultDepsCode,
    defaultIndexCode = DefaultIndexCode;

// 向来源的页面发送消息，尝试获取填充的代码
if (window.opener && typeof window.opener[PlaygroundGetCodeSymbol] === 'function') {
    const res = window.opener[PlaygroundGetCodeSymbol]() as IPlaygroundCode;
    if (res) {
        defaultIndexCode = res.index || DefaultIndexCode;
        defaultDemoCode = res.demo || DefaultDemoCode;
        defaultDepsCode = formatDeps(res.deps);
    }
}

const Playground: React.FC = () => {
    const { onPageReady, setStates, widthLevel } = usePageConfig();
    const [code, setCode] = useState(defaultDemoCode);
    const [indexCode, setIndexCode] = useState('');
    const [depCode, setDepCode] = useState(defaultDepsCode);

    // 保存代码，区分是依赖导入还是 demo 代码
    const onCodeSave = (newCode: string, index: number) => {
        switch (index) {
            case 0: {
                setCode(newCode);
                break;
            }
            case 1: {
                setIndexCode(newCode);
                break;
            }
            case 2: {
                setDepCode(newCode);
                break;
            }
        }
    };

    // 设置页面标题等信息
    useLayoutEffect(() => {
        setStates?.({
            title: 'React Playground 🚀',
            footer: {
                showICP: true,
                showPublicSecurity: true,
                showCopyRight: true
            }
        });
        onPageReady?.();
    }, [setStates, onPageReady]);

    return (
        <div className={clsx(styles.playground, widthLevel === ResponsiveEnum.tiny ? styles.tiny : undefined)}>
            <Editor
                className={styles.editor}
                onSave={onCodeSave}
                defaultValues={[defaultDemoCode, defaultIndexCode, defaultDepsCode]}
                tabsName={['App.tsx', 'index.tsx', 'Settings.tsx']}
            />
            <Sandbox
                className={styles.display}
                settingsCode={depCode}
                demoCode={code}
                indexCode={indexCode}
            />
        </div>
    );
}

Playground.displayName = 'Playground';
export default Playground;
