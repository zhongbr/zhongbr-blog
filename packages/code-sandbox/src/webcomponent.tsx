import {
    getIframeHTML,
    iframeStyles,
    getSandboxRefresher,
    setSandboxPlugins,
    HTMLEntry,
    JSEntry,
    StylesEntry
} from './iframe';
import * as DefaultCodes from './default';
import {onIframeLoadingModule, initMainThreadService, waitIframeReady} from './utils/iframe';
import { getPlugins, registerPlugins } from './plugins';
import { FilesSystem, initMainFilesSyncCaller } from "./core/files-system";
import React from "react";

export type IAttributes = React.HTMLAttributes<CodeSandbox> & {
    html?: string;
    css?: string;
    index?: string;
    code?: string;
    title?: string;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'code-sandbox': React.DetailedHTMLProps<IAttributes, CodeSandbox>
        }
    }
}

const defaultCodes = {
    html: [HTMLEntry, DefaultCodes.DefaultHtml],
    code: [DefaultCodes.DefaultDemoFileName, DefaultCodes.DefaultDemoCode],
    index: [JSEntry, DefaultCodes.DefaultIndexCode],
    css: [StylesEntry, DefaultCodes.DefaultCssCode]
};

class CodeSandbox extends HTMLElement {
    public iframe: HTMLIFrameElement;
    private styleElement: HTMLStyleElement;
    public fs: FilesSystem = new FilesSystem();
    private fsSyncServiceDispose: () => void = null;
    private mainThreadServiceDispose: () => void = null;
    public root: ShadowRoot = null;
    private initial: boolean = false;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.initIframe();
    }

    public addEventListener<K extends keyof (HTMLElementEventMap & { 'ready': unknown; 'loading-module': unknown; })>(type: K, listener, options?) {
        super.addEventListener(type, listener, options);
    }

    public removeEventListener<K extends keyof (HTMLElementEventMap & { 'ready': unknown; 'loading-module': unknown; })>(type: K, listener, options?) {
        super.removeEventListener(type, listener, options);
    }

    private async initIframe() {
        if (this.iframe) {
            this.root.removeChild(this.iframe);
        }
        this.fsSyncServiceDispose?.();
        this.mainThreadServiceDispose?.();

        this.mainThreadServiceDispose = initMainThreadService();

        const [srcDoc] = getIframeHTML();

        this.iframe = document.createElement('iframe');
        this.iframe.srcdoc = srcDoc;
        this.iframe.setAttribute('title', this.iframe.getAttribute('title'));
        this.iframe.setAttribute('sandbox', 'allow-scripts');
        this.iframe.setAttribute('class', `code-sandbox-iframe ${this.getAttribute('class') || ''}`);
        this.iframe.setAttribute('style', this.getAttribute('style'));

        // 监听 iframe 内加载模块，并分发对象的事件
        onIframeLoadingModule(this.iframe, (moduleName, extraInfo) => {
            this.dispatchEvent(new CustomEvent('loading-module', {
                detail: {
                    moduleName,
                    url: extraInfo
                }
            }));
        });

        this.styleElement = document.createElement('style');
        this.styleElement.innerHTML = iframeStyles;

        this.root.append(this.styleElement, this.iframe);
        this.fsSyncServiceDispose = initMainFilesSyncCaller(this.fs, this.iframe);
        await setSandboxPlugins(this.iframe, getPlugins());
        await this.writeFile('html');
        await this.writeFile('css');
        await this.writeFile('code');
        await this.writeFile('index');
        await this.execute();
        this.initial = true;
    }

    static get observedAttributes() {
        return ['code', 'css', 'index', 'html', 'class', 'style'];
    }

    private async execute(files?: string[]) {
        await getSandboxRefresher({ iframe: this.iframe })(files);
        this.dispatchEvent(new CustomEvent('ready'));
    }

    public async attributeChangedCallback(name: string, oldValue, newValue) {
        if (['html', 'code', 'index', 'css'].includes(name)) {
            if (!this.initial) return;
            // 等待 iframe 环境准备好之后再执行代码
            await waitIframeReady(this.iframe);
            await this.writeFile(name, newValue);
            const files: string[] = [null, null, null];
            if (name === 'index' || name === 'code') files[0] = defaultCodes[name][0];
            if (name === 'html') files[1] = defaultCodes[name][0];
            if (name === 'css') files[2] = defaultCodes[name][0];
            await this.execute(files);
        }
        else {
            this.iframe.setAttribute(name, newValue);
        }
    }

    public async refresh() {
        this.initIframe();
        await waitIframeReady(this.iframe);
        return this.execute();
    }

    private async writeFile(name: string, value?: string) {
        await waitIframeReady(this.iframe);
        const [fileName, defaultCode] = defaultCodes[name];
        this.fs.writeFile(fileName, value || this.getAttribute(name) || defaultCode);
    }
}

export { DefaultCodes, CodeSandbox, registerPlugins };
