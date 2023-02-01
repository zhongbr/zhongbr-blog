import React, { useLayoutEffect, useRef } from "react";

import { onIframeLoadingModule, initMainThreadService } from './utils/iframe';
import { getSandboxRefresher, getIframeHTML, iframeStyles, setSandboxPlugins } from './iframe';
import * as DefaultCodes from './default';
import { registerPlugins, getPlugins } from './plugins';

initMainThreadService();

export interface IProps {
    className?: string;
    title?: string;
    html?: string;
    code?: string;
    index?: string;
    css?: string;
    style?: React.CSSProperties;
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
        html = DefaultCodes.DefaultHtml,
        style,
        onLoadingModule,
        onReady
    } = props;

    const iframe = useRef<HTMLIFrameElement>(null);

    const previousCodesRef = useRef<readonly [string, string, string, string]>(null);
    const currentCode = [html, code, index, css] as const;
    useLayoutEffect(() => {
        (async () => {
            const { refreshIndex, refreshApp, refreshHtml, refreshStyle } = getSandboxRefresher({
                iframe: iframe.current,
                code,
                index,
                css,
                html
            });

            const [preHtml, preCode, preIndex, preCss] = previousCodesRef.current || [];
            const tasks = [];
            switch (true) {
                case preHtml !== html: {
                    tasks.push(refreshHtml());
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
        setSandboxPlugins(iframe.current, getPlugins());
    }, []);

    const [srcDoc] = getIframeHTML();

    return (
        <>
            <style>
                {iframeStyles}
            </style>
            <iframe
                ref={iframe}
                className={`code-sandbox-iframe ${className || ''}`}
                title={title}
                srcDoc={srcDoc}
                allowFullScreen
                style={style}
                sandbox="allow-scripts"
            />
        </>
    )
}

Demo.displayName = 'Demo';

export { DefaultCodes, registerPlugins };
export default Demo;
