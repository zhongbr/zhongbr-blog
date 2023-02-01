import React, { useLayoutEffect, useRef } from "react";

import { onIframeLoadingModule, initMainThreadService } from './utils/iframe';
import { getSandboxRefresher, getIframeHTML, iframeStyles, setSandboxPlugins } from './iframe';
import * as DefaultCodes from './default';
import { registerPlugins, getPlugins } from './plugins';

initMainThreadService();

export interface IRef {
    getIframe: () => HTMLIFrameElement | null;
    refresh: () => void;
}

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

const CodeSandbox = React.forwardRef<IRef, IProps>((props, ref) => {
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
    if (ref) {
        const ref_: IRef = {
            getIframe: () => iframe.current,
            refresh: () => {
                if (!iframe.current) return;
                iframe.current.srcdoc = Reflect.get(iframe.current, 'srcdoc');
                previousCodesRef.current = null;
                runCode();
            }
        };
        if (typeof ref === 'function') {
            ref(ref_);
        }
        else {
            ref.current = ref_;
        }
    }

    const runCode = () => {
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
    };

    const previousCodesRef = useRef<readonly [string, string, string, string]>(null);
    const currentCode = [html, code, index, css] as const;
    useLayoutEffect(runCode, currentCode);

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
});

CodeSandbox.displayName = 'Demo';

export { DefaultCodes, registerPlugins };
export default CodeSandbox;
