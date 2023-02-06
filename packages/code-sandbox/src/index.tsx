import React, { useLayoutEffect, useRef } from "react";

import { FilesSystem } from "./core/files-system";
import { CodeSandbox as CodeSandboxDom, registerPlugins, DefaultCodes, IAttributes } from './webcomponent';

if (!customElements.get('code-sandbox')) {
    customElements.define('code-sandbox', CodeSandboxDom);
}

export interface IProps extends IAttributes {
    fs?: FilesSystem;
    onLoadingModule?: (moduleName: string, url: string) => void;
    onReady?: () => void;
}

const CodeSandbox = React.forwardRef<CodeSandboxDom, IProps>((props, ref) => {
    const { fs, onLoadingModule, onReady, className, ...others } = props;
    const sandboxRef = useRef<CodeSandboxDom>(null);

    useLayoutEffect(() => {
        if (className) {
            sandboxRef.current.iframe?.classList?.add(className);
        }
        if (fs) {
            sandboxRef.current.fs = fs;
        }
        if (onReady) {
            sandboxRef.current.addEventListener('ready', onReady);
        }
        const onLoadingModule_ = (e) => {
            const { moduleName, url } = e.detail;
            onLoadingModule?.(moduleName, url);
        };
        if (onLoadingModule) {
            sandboxRef.current.addEventListener('loading-module', onLoadingModule_);
        }
        return () => {
            if (!sandboxRef.current) return;
            if (onReady) {
                sandboxRef.current.removeEventListener('ready', onReady);
            }
            if (onLoadingModule) {
                sandboxRef.current.removeEventListener('loading-module', onLoadingModule_);
            }
        };
    }, [className, onReady, onLoadingModule, fs]);

    return (
        <code-sandbox
            ref={(ele) => {
                ref && (typeof ref === 'function' ? ref(ele) : ref.current = ele);
                sandboxRef.current = ele;
            }}
            {...others}
        />
    );
});

CodeSandbox.displayName = 'Demo';

export { DefaultCodes, registerPlugins, CodeSandboxDom };
export default CodeSandbox;
