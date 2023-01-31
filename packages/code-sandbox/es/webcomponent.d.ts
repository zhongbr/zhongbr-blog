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
    private iframe;
    private styleElement;
    onLoadingModule: (moduleName: string, url: string) => void;
    constructor();
    private initIframe;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: any, newValue: any): Promise<any[]>;
}
export { DefaultCodes, CodeSandbox, registerPlugins };
