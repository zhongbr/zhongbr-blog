import React, { useLayoutEffect, useRef } from "react";

import { onIframeLoadingModule, initMainThreadService } from './utils/iframe';
import { getSandboxRefresher, getIframeHTML, iframeStyles } from './iframe';
import * as DefaultCodes from './default';

// 生成转化 jsx 代码的 worker 服务
import('./core/jsx').then(({ getJsxService }) => {
    getJsxService();
});

initMainThreadService();

export interface IProps {
    className?: string;
    title?: string;
    code?: string;
    index?: string;
    css?: string;
    settings?: string;
    style?: React.CSSProperties;
    placeholder?: string;
    onLoadingModule?: (moduleName: string, url: string) => void;
    onReady?: () => void;
}

const Demo: React.FC<IProps> = (props) => {
    const {
        title = 'demo',
        className,
        code = DefaultCodes.DefaultDemoCode,
        index = DefaultCodes.DefaultIndexCode,
        css = DefaultCodes.DefaultCssCode,
        settings= DefaultCodes.DefaultDepsCode,
        style,
        placeholder = DefaultCodes.Placeholder,
        onLoadingModule,
        onReady
    } = props;

    const iframe = useRef<HTMLIFrameElement>(null);

    const previousCodesRef = useRef<readonly [string, string, string, string]>(null);
    const currentCode = [settings, code, index, css] as const;
    useLayoutEffect(() => {
        (async () => {
            const { refreshIndex, refreshApp, refreshSettings, refreshStyle } = getSandboxRefresher({
                iframe: iframe.current,
                code,
                index,
                css,
                settings
            });

            const [preSettings, preCode, preIndex, preCss] = previousCodesRef.current || [];
            const tasks = [];
            switch (true) {
                case preSettings !== settings: {
                    tasks.push(refreshSettings());
                    break;
                }
                case preCode !== code: {
                    tasks.push(refreshApp());
                    break;
                }
                case preIndex !== index: {
                    tasks.push(refreshIndex());
                    break;
                }
            }
            tasks.push(refreshStyle());
            await Promise.all(tasks);
            onReady?.();
            previousCodesRef.current = currentCode;
        })()
    }, currentCode);

    const onLoadingModuleRef = useRef(onLoadingModule);
    onLoadingModuleRef.current = onLoadingModule;

    useLayoutEffect(() => {
        if (!iframe.current) return;
        onIframeLoadingModule(iframe.current, (moduleName, extraInfo) => {
            onLoadingModuleRef.current(moduleName, extraInfo);
        });
    }, []);

    const [srcDoc, src] = getIframeHTML(placeholder);

    return (
        <>
            <style>
                {iframeStyles}
            </style>
            <iframe
                ref={iframe}
                className={`code-sandbox-iframe ${className || ''}`}
                title={title}
                src={src}
                srcDoc={srcDoc}
                allowFullScreen
                style={style}
            />
        </>
    )
}

Demo.displayName = 'Demo';

export { DefaultCodes };
export default Demo;
