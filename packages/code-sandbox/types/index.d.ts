import React from "react";
import * as DefaultCodes from './default';
export interface IProps {
    className?: string;
    title?: string;
    code?: string;
    index?: string;
    css?: string;
    settings?: string;
    style?: React.CSSProperties;
    placeholder?: string;
    onLoadingModule?: (moduleName: string, url: string) => void;
    onReady?: () => void;
}
declare const Demo: React.FC<IProps>;
export { DefaultCodes };
export default Demo;
