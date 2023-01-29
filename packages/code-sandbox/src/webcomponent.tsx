import { getIframeHTML, iframeStyles, getSandboxRefresher } from './iframe';
import * as DefaultCodes from './default';
import { IProps as IDemoProps } from "./index";
import { onIframeLoadingModule, initMainThreadService } from './utils/iframe';

// 生成转化 jsx 代码的 worker 服务
import('./core/jsx').then(({ getJsxService }) => {
    getJsxService();
});

initMainThreadService();

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'code-sandbox': IDemoProps;
        }
    }
}

class CodeSandbox extends HTMLElement {
    private iframe: HTMLIFrameElement;
    private styleElement: HTMLStyleElement;

    public onLoadingModule: (moduleName: string, url: string) => void;

    constructor() {
        super();
        this.initIframe();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.append(this.styleElement, this.iframe);
    }

    private initIframe() {
        const [srcDoc, src] = getIframeHTML(this.getAttribute('placeholder') || DefaultCodes.Placeholder);

        this.iframe = document.createElement('iframe');
        this.iframe.srcdoc = srcDoc;
        this.iframe.src = src;
        this.iframe.setAttribute('class', `code-sandbox-iframe ${this.getAttribute('class') || ''}`);
        this.iframe.setAttribute('style', this.getAttribute('style'));

        // 监听 iframe 内加载模块，并分发对象的事件
        onIframeLoadingModule(this.iframe, (moduleName, extraInfo) => {
            this.onLoadingModule?.(moduleName, extraInfo);
            this.dispatchEvent(new CustomEvent('loading-module', {
                detail: {
                    moduleName,
                    url: extraInfo
                }
            }));
        });

        this.styleElement = document.createElement('style');
        this.styleElement.innerText = iframeStyles;
    }

    static get observedAttributes() {
        return ['code', 'css', 'index', 'settings', 'class', 'style', 'placeholder'];
    }

    public async attributeChangedCallback(name: string, oldValue, newValue) {
        const settings = this.getAttribute('settings') || DefaultCodes.DefaultDepsCode;
        const index = this.getAttribute('index') || DefaultCodes.DefaultIndexCode;
        const code = this.getAttribute('code') || DefaultCodes.DefaultDemoCode;
        const css = this.getAttribute('css') || DefaultCodes.DefaultCssCode;

        const { refreshSettings, refreshApp, refreshIndex, refreshStyle } = getSandboxRefresher({
            iframe: this.iframe,
            settings,
            index,
            code,
            css
        });
        const tasks = [];
        switch (name) {
            case 'settings': {
                tasks.push(refreshSettings())
                break;
            }
            case 'code': {
                tasks.push(refreshApp());
                break;
            }
            case 'index': {
                tasks.push(refreshIndex());
                break;
            }
            case 'css': {
                tasks.push(refreshStyle());
                break;
            }
            default: {
                this.iframe.setAttribute(name, newValue);
            }
        }
        return Promise.all(tasks);
    }
}

if (!customElements.get('code-sandbox')) {
    customElements.define('code-sandbox', CodeSandbox);
}
export { DefaultCodes, CodeSandbox };
