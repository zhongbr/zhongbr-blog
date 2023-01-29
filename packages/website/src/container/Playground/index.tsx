import React, { useLayoutEffect, useState } from 'react';
import clsx from 'clsx';
import { DefaultCodes } from '@zhongbr/code-sandbox';

import { Sandbox } from '@/components';
import { ResponsiveEnum, usePageConfig } from '@/hooks';
import { PlaygroundGetCodeSymbol, IPlaygroundCode } from '@/types/utils';

import { Editor } from './modules';
import styles from './style.module.less';

const { DefaultDemoCode, DefaultDepsCode, DefaultIndexCode, DefaultCssCode, formatDeps } = DefaultCodes;

let defaultDemoCode = DefaultDemoCode,
    defaultDepsCode = DefaultDepsCode,
    defaultIndexCode = DefaultIndexCode,
    defaultCssCode = DefaultCssCode;

// 向来源的页面发送消息，尝试获取填充的代码
if (window.opener && typeof window.opener[PlaygroundGetCodeSymbol] === 'function') {
    const res = window.opener[PlaygroundGetCodeSymbol]() as IPlaygroundCode;
    if (res) {
        defaultIndexCode = res.index || DefaultIndexCode;
        defaultDemoCode = res.demo || DefaultDemoCode;
        defaultCssCode = res.css || DefaultCssCode;
        defaultDepsCode = formatDeps(res.deps || []);
    }
}

const Playground: React.FC = () => {
    const { onPageReady, setStates, widthLevel } = usePageConfig();
    const defaultCodes = [defaultDemoCode, defaultIndexCode, defaultDepsCode, defaultCssCode];
    const tags = ['App.tsx', 'index.tsx', 'settings.tsx', 'index.css'];
    const [codes, setCodes] = useState<string[]>([defaultDemoCode, '', defaultDepsCode, defaultCssCode]);

    // 保存代码，区分是依赖导入还是 demo 代码
    const onCodeSave = (newCode: string, index: number) => {
        setCodes(codes => codes.map((code, _index) => {
            return index === _index ? newCode : code || defaultCodes[_index];
        }));
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
                defaultValues={defaultCodes}
                tabsName={tags}
            />
            <Sandbox
                className={styles.display}
                settingsCode={codes[2]}
                demoCode={codes[0]}
                indexCode={codes[1]}
                cssCode={codes[3]}
            />
        </div>
    );
}

Playground.displayName = 'Playground';
export default Playground;
