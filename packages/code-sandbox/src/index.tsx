import React, { useLayoutEffect, useRef, useCallback } from "react";
import { waitProxy, callProxy } from './core/proxy';
import { fallbackHtml, Html } from './iframe/html';
import { DemoServiceName, IDemoService } from './type';
import { waitIframe } from './utils/wait-iframe';

// 生成转化 jsx 代码的 worker 服务
import('./core/jsx').then(({ getJsxService }) => {
    getJsxService();
});

export interface IProps {
    className?: string;
    title?: string;
    code?: string;
    index?: string;
    css?: string;
    settings?: string;
    style?: React.CSSProperties;
}

const Demo: React.FC<IProps> = (props) => {
    const { title = 'demo', className, code, index, css, settings, style } = props;
    const iframe = useRef<HTMLIFrameElement>(null);

    const defineAndRunModule = useCallback(async (name: string, deps: string[], code: string) => {
        if (!iframe.current) return;
        // 等待 demo iframe 提供的服务准备好
        await waitIframe(iframe.current.contentWindow);
        await waitProxy(iframe.current.contentWindow, DemoServiceName);
        // 调用 iframe 提供的服务
        await callProxy<IDemoService, 'defineModule'>({
            win: iframe.current.contentWindow,
            serviceId: DemoServiceName,
            method: 'defineModule',
            payload: [name, deps, code]
        });
        await callProxy<IDemoService, 'executeModule'>({
            win: iframe.current.contentWindow,
            serviceId: DemoServiceName,
            method: 'executeModule',
            payload: [name]
        });
    }, []);

    const refreshIndex = () => {
        defineAndRunModule('/index', ['require'], index);
    };

    const refreshApp = () => {
        defineAndRunModule('/App', ['require'], code).then(refreshIndex);
    };

    useLayoutEffect(() => {
        if (!iframe.current) return;
        (async () => {
            await waitIframe(iframe.current.contentWindow);
            await waitProxy(iframe.current.contentWindow, DemoServiceName);
            await callProxy<IDemoService, 'setStyle'>({
                win: iframe.current.contentWindow,
                serviceId: DemoServiceName,
                method: 'setStyle',
                payload: [css]
            });
        })();
    }, [css]);

    useLayoutEffect(refreshApp, [code, defineAndRunModule]);

    useLayoutEffect(() => {
        defineAndRunModule('/settings', ['require'], settings).then(refreshApp);
    }, [settings, defineAndRunModule]);

    useLayoutEffect(refreshIndex, [index, defineAndRunModule]);

    return (
        <iframe
            ref={iframe}
            className={className}
            title={title}
            src={fallbackHtml}
            srcDoc={Html}
            allowFullScreen
            style={style}
        />
    )
}

Demo.displayName = 'Demo';

export default Demo;
