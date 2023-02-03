import React from "react";
import { FilesSystem } from "./core/files-system";
import { CodeSandbox as CodeSandboxDom, registerPlugins, DefaultCodes, IAttributes } from './webcomponent';
export interface IProps extends IAttributes {
    fs?: FilesSystem;
    onLoadingModule?: (moduleName: string, url: string) => void;
    onReady?: () => void;
}
declare const CodeSandbox: React.ForwardRefExoticComponent<IProps & React.RefAttributes<CodeSandboxDom>>;
export { DefaultCodes, registerPlugins, CodeSandboxDom };
export default CodeSandbox;
