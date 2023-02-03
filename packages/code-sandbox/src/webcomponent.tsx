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

initMainThreadService();

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

class CodeSandbox extends HTMLElement {
    public iframe: HTMLIFrameElement;
    private styleElement: HTMLStyleElement;
    private fs_: FilesSystem = new FilesSystem();
    private fsMode: 'fs' | 'code' = 'code';
    public root: ShadowRoot = null;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.initIframe();
    }

    public set fs(fs: FilesSystem) {
        this.fsMode = 'fs';
        this.fs_ = fs;
    }

    public get fs() {
        return this.fs_;
    }

    public addEventListener<K extends keyof (HTMLElementEventMap & { 'ready': unknown; 'loading-module': unknown; })>(type: K, listener, options?) {
        super.addEventListener(type, listener, options);
    }

    public removeEventListener<K extends keyof (HTMLElementEventMap & { 'ready': unknown; 'loading-module': unknown; })>(type: K, listener, options?) {
        super.removeEventListener(type, listener, options);
    }

    private initIframe() {
        if (this.iframe) {
            this.root.removeChild(this.iframe);
        }
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

        initMainFilesSyncCaller(this.fs, this.iframe);

        this.styleElement = document.createElement('style');
        this.styleElement.innerHTML = iframeStyles;

        this.root.append(this.styleElement, this.iframe);
        setSandboxPlugins(this.iframe, getPlugins());
        this.writeFile('html');
        this.writeFile('css');
        this.writeFile('code');
        this.writeFile('index');
    }

    static get observedAttributes() {
        return ['code', 'css', 'index', 'html', 'class', 'style'];
    }

    private async execute() {
        await getSandboxRefresher({ iframe: this.iframe })();
        this.dispatchEvent(new CustomEvent('ready'));
    }

    public async attributeChangedCallback(name: string, oldValue, newValue) {
        if (['html', 'code', 'index', 'css'].includes(name)) {
            // 等待 iframe 环境准备好之后再执行代码
            waitIframeReady(this.iframe).then(() => {
                this.writeFile(name);
                this.execute();
            });
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

    private async writeFile(name: string) {
        await waitIframeReady(this.iframe);
        const defaultCodes = {
            html: [HTMLEntry, DefaultCodes.DefaultHtml],
            code: [DefaultCodes.DefaultDemoFileName, DefaultCodes.DefaultDemoCode],
            index: [JSEntry, DefaultCodes.DefaultIndexCode],
            css: [StylesEntry, DefaultCodes.DefaultCssCode]
        };
        const [fileName, defaultCode] = defaultCodes[name];
        this.fs.writeFile(fileName, this.getAttribute(name) || defaultCode);
    }
}

export { DefaultCodes, CodeSandbox, registerPlugins };
