import React from 'react';
import * as ReactNamespace from 'react';
import ReactDom from "react-dom";
import * as ReactDomNamespace from "react-dom";

import { IDefine } from "@/utils/amd/types";

const ReactDefined = Symbol('react-defined');

export function defineReact(define: IDefine = Reflect.get(window, 'define')) {
    if (!define || Reflect.get(define.amd, ReactDefined)) {
        return;
    }
    // 默认导入 react AMD 模块，供内部 JSX 调用
    define('react', [], async () => {
        return {
            'default': React,
            ...ReactNamespace
        };
    });
    define('react-dom', [], async () => {
        return {
            'default': ReactDom,
            ...ReactDomNamespace
        };
    });
    // 在 define.amd 对象上打个标
    Reflect.set(define.amd, ReactDefined, true);
}
