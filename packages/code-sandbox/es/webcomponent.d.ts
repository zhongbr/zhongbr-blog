import * as DefaultCodes from './default';
import { IProps as IDemoProps } from "./index";
import { registerPlugins } from './plugins';
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'code-sandbox': IDemoProps;
        }
    }
}
declare class CodeSandbox extends HTMLElement {
    iframe: HTMLIFrameElement;
    private styleElement;
    constructor();
    private initIframe;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: any, newValue: any): Promise<any[]>;
    refresh(): Promise<any[]>;
}
export { DefaultCodes, CodeSandbox, registerPlugins };
