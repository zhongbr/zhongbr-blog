// @ts-ignore
import React, { useState, useLayoutEffect } from 'react';
import * as ReactDom from 'react-dom/client';

import Demo, { DefaultCodes, IProps as IDemoProps } from '../src';
// @ts-ignore
import WebComponentUrl from '../src/webcomponent?url';

const root = ReactDom.createRoot(document.getElementById('root'));

const script = document.createElement('script');
script.type = 'module';
script.innerHTML =
`import { CodeSandbox } from '${WebComponentUrl}';`;
document.head.appendChild(script);

const useCode = (defaultCode: string) => {
    const [code, setCode] = useState(defaultCode);
    const [innerCode, setInnerCode] = useState(defaultCode);
    return [code, innerCode, newCode => setInnerCode(newCode), () => setCode(innerCode)] as const;
};

const DemoComp = () => {
    const [code, showCode, onCodeChange, onConfirmDemoCode] = useCode(DefaultCodes.DefaultDemoCode);
    const [index, showIndex, onIndexChange, onConfirmIndexCode] = useCode(DefaultCodes.DefaultIndexCode);
    const [settings, showSettings, onSettingsChange, onConfirmDepsCode] = useCode(DefaultCodes.DefaultDepsCode);
    const [css, showCss, onCssChange, onConfirmCssCode] = useCode(DefaultCodes.DefaultCssCode);

    const onConfirm = () => {
        onConfirmDemoCode();
        onConfirmIndexCode();
        onConfirmDepsCode();
        onConfirmCssCode();
    };

    useLayoutEffect(() => {
        const codeSandbox = document.getElementsByTagName('code-sandbox')?.[0];
        if (!codeSandbox) return;
        codeSandbox.addEventListener('loading-module', e => {
            console.log('web component loading module', e);
        });
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '1000px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: '1' }}>
                    <div>App.tsx</div>
                    <div>
                        <textarea rows={30} value={showCode} onChange={e => onCodeChange(e.target.value)}/>
                    </div>
                </div>
                <div style={{ flex: '1' }}>
                    <div>index.tsx</div>
                    <div>
                        <textarea rows={30} value={showIndex} onChange={e => onIndexChange(e.target.value)}/>
                    </div>
                </div>
                <div style={{ flex: '1' }}>
                    <div>styles.css</div>
                    <div>
                        <textarea rows={30} value={showCss} onChange={e => onCssChange(e.target.value)}/>
                    </div>
                </div>
                <div style={{ flex: '1' }}>
                    <div>settings.tsx</div>
                    <div>
                        <textarea rows={30} value={showSettings} onChange={e => onSettingsChange(e.target.value)}/>
                    </div>
                </div>
            </div>

            <div style={{ margin: '8px', textAlign: 'right' }}>
                <button onClick={onConfirm}>运行</button>
            </div>

            <div style={{ flex: '1' }}>
                <div>React 组件</div>
                <Demo
                    title="demo"
                    code={code}
                    index={index}
                    settings={settings}
                    css={css}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    onLoadingModule={(moduleName, url) => {
                        console.log('loading module react', moduleName, url);
                    }}
                />
            </div>

            <div style={{ flex: '1' }}>
                <div>Web Component 组件</div>
                {/* @ts-ignore */}
                <code-sandbox
                    title="demo"
                    code={code}
                    index={index}
                    settings={settings}
                    css={css}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                />
            </div>
        </div>
    );
};

root.render(
    <DemoComp/>
);
