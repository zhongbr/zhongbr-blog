import * as DefaultCodes from './default';
import { registerPlugins } from './plugins';
import { FilesSystem } from "./core/files-system";
import React from "react";
export declare type IAttributes = React.HTMLAttributes<CodeSandbox> & {
    html?: string;
    css?: string;
    index?: string;
    code?: string;
    title?: string;
};
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'code-sandbox': React.DetailedHTMLProps<IAttributes, CodeSandbox>;
        }
    }
}
declare class CodeSandbox extends HTMLElement {
    iframe: HTMLIFrameElement;
    private styleElement;
    fs: FilesSystem;
    private fsSyncServiceDispose;
    private mainThreadServiceDispose;
    root: ShadowRoot;
    constructor();
    addEventListener<K extends keyof (HTMLElementEventMap & {
        'ready': unknown;
        'loading-module': unknown;
    })>(type: K, listener: any, options?: any): void;
    removeEventListener<K extends keyof (HTMLElementEventMap & {
        'ready': unknown;
        'loading-module': unknown;
    })>(type: K, listener: any, options?: any): void;
    private initIframe;
    static get observedAttributes(): string[];
    private execute;
    attributeChangedCallback(name: string, oldValue: any, newValue: any): Promise<void>;
    refresh(): Promise<void>;
    private writeFile;
}
export { DefaultCodes, CodeSandbox, registerPlugins };
