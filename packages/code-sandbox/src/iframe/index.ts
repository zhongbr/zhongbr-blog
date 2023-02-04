import {waitIframeReady} from "../utils/iframe";
import {callProxy, waitProxy} from "../core/proxy";
import {DemoServiceName, IDemoService} from "../type";
import {FilesSystem} from '../core/files-system';

export interface IOptions {
    fs?: FilesSystem;
    iframe: HTMLIFrameElement | null;
}

export const JSEntry = '/index.js';
export const StylesEntry = '/styles.css';
export const HTMLEntry = '/index.html';

export const getSandboxRefresher = (opt: IOptions) => {
    const iframe = opt.iframe;

    return async (payload = [JSEntry, HTMLEntry, StylesEntry]) => {
        if (!iframe) return;
        // 等待 demo iframe 提供的服务准备好
        await waitIframeReady(iframe);
        await waitProxy(iframe.contentWindow, DemoServiceName);
        // 调用 iframe 提供的服务
        await callProxy<IDemoService, 'run'>({
            win: iframe.contentWindow,
            serviceId: DemoServiceName,
            method: 'run',
            payload: payload as Parameters<IDemoService['run']>
        });
    };
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
