import React from "react";
import * as DefaultCodes from './default';
import { registerPlugins } from './plugins';
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
declare const CodeSandbox: React.ForwardRefExoticComponent<IProps & React.RefAttributes<IRef>>;
export { DefaultCodes, registerPlugins };
export default CodeSandbox;
