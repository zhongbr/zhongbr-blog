import React, { useLayoutEffect, useState } from 'react';
import clsx from 'clsx';

import { ResponsiveEnum, usePageConfig } from '@/hooks';
import { JsxDemoDisplay, Icon } from '@/components';

import { Editor } from './modules';
import styles from './style.module.less';

const defaultCode =
`import React from 'react';

const TestFC = (props) => {
    const [state, setState] = React.useState(0);

    React.useEffect(() => {
        if (state === 5) throw new Error('Error Boundary test');
    }, [state]);

    return (
        <div>
            <button onClick={() => setState(state => state+1)}>Click Me To Change State!({state})</button>
        </div>
    );
}

export default TestFC;`

const Playground: React.FC = () => {
    const { onPageReady, setStates, widthLevel } = usePageConfig();
    const [code, setCode] = useState('');

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

    const BlankTips = (
        <div>
            <h3>
                <Icon className="rp-jiaoxue"/>
                <span style={{ marginLeft: '8px' }}>React JSX Playground</span>
            </h3>
            <p>在左侧的代码块内输入 React JSX 代码，将要渲染的组件 default 导出，点击保存即可预览效果</p>
        </div>
    );

    return (
        <div className={clsx(styles.playground, widthLevel === ResponsiveEnum.tiny ? styles.tiny : undefined)}>
            <Editor
                className={styles.editor}
                onSave={setCode}
                defaultValue={defaultCode}
            />
            <div className={styles.display}>
                {code ? <JsxDemoDisplay jsx={code}/> : BlankTips}
            </div>
        </div>
    );
}

Playground.displayName = 'Playground';
export default Playground;
