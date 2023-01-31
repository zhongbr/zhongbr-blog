import { waitIframeReady } from "../utils/iframe";
import { callProxy, waitProxy } from "../core/proxy";
import { DemoServiceName, IDemoService } from "../type";

export interface IOptions {
    iframe: HTMLIFrameElement | null;
    index?: string;
    code?: string;
    html?: string;
    css?: string;
    className?: string;
    style?: string;
}

export const getSandboxRefresher = (opt: IOptions) => {
    const { iframe, code, index, html, css, className, style } = opt;

    /**
     * 定义并运行一个模块
     * @param name 模块的名称/路径
     * @param deps 模块的依赖
     * @param code 模块的代码
     */
    const defineAndRunModule = async (name: string, deps: string[], code: string) => {
        if (!iframe || !code) return;
        // 等待 demo iframe 提供的服务准备好
        await waitIframeReady(iframe);
        await waitProxy(iframe.contentWindow, DemoServiceName);
        // 调用 iframe 提供的服务
        await callProxy<IDemoService, 'defineModule'>({
            win: iframe.contentWindow,
            serviceId: DemoServiceName,
            method: 'defineModule',
            payload: [name, deps, code]
        });
        await callProxy<IDemoService, 'executeModule'>({
            win: iframe.contentWindow,
            serviceId: DemoServiceName,
            method: 'executeModule',
            payload: [name]
        });
    };

    const refreshIndex = async () => {
        await defineAndRunModule('/index', ['require'], index);
    }

    const refreshApp = async () => {
        await defineAndRunModule('/App', ['require'], code);
        await refreshIndex();
    }

    const refreshHtml = async () => {
        // 等待 demo iframe 提供的服务准备好
        await waitIframeReady(iframe);
        await waitProxy(iframe.contentWindow, DemoServiceName);
        await callProxy<IDemoService>({
            win: iframe.contentWindow,
            serviceId: DemoServiceName,
            method: 'setBodyHtml',
            payload: [html]
        });
        await refreshApp();
    }

    const refreshStyle = async () => {
        if (!iframe || !css) return;
        await waitIframeReady(iframe);
        await waitProxy(iframe.contentWindow, DemoServiceName);
        await callProxy<IDemoService, 'setStyle'>({
            win: iframe.contentWindow,
            serviceId: DemoServiceName,
            method: 'setStyle',
            payload: [css]
        });
    };

    return { refreshApp, refreshIndex, refreshHtml, refreshStyle };
};
export { getIframeHTML, iframeStyles } from './html';

export const setSandboxPlugins = async (iframe: HTMLIFrameElement | null, pluginsId: string[]) => {
    await waitIframeReady(iframe);
    await waitProxy(iframe.contentWindow, DemoServiceName);
    return await callProxy<IDemoService>({
        win: iframe.contentWindow,
        serviceId: DemoServiceName,
        method: 'setPlugins',
        payload: [pluginsId]
    });
};
