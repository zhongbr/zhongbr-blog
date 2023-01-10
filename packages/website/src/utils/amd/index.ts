import React from 'react';
import * as ReactNamespace from 'react';
import ReactDom from "react-dom";
import * as ReactDomNamespace from "react-dom";

import bindScriptLoaderToCtx from './scriptLoader';
import bindDefineToCtx from "./define";
import bindRequireToCtx from "./require";
import { IAmdModuleManagerContext } from './types';
import { createEventSubscribeManager } from "../event-subscribe";
import { Factory } from "./types";

export function createAmdManager(root='/', scriptTimeout=10000) {
    const ctx = {} as IAmdModuleManagerContext;
    ctx.eventSubscribeManager = createEventSubscribeManager();
    ctx.root = root;
    ctx.scriptTimeout = scriptTimeout;
    ctx.scriptContainerDom = document.body;

    bindRequireToCtx(ctx);
    bindDefineToCtx(ctx);
    bindScriptLoaderToCtx(ctx);

    function importGlobalObjectScript(target: HTMLElement, url: string, name: string): Factory {
        // 返回一个导入脚本的异步函数作为模块的声明
        return async (_require) => {
            await ctx.scriptLoader.loadScript(target, url);
            return {
                'default': Reflect.get(window, name),
                ...Reflect.get(window, name)
            };
        };
    }

    // 默认导入 react AMD 模块，供内部 JSX 调用
    ctx.define('react', [], async () => {
        return {
            'default': React,
            ...ReactNamespace
        };
    });
    ctx.define('react-dom', [], async () => {
        return {
            'default': ReactDom,
            ...ReactDomNamespace
        };
    });

    console.log('create context', ctx);

    let unmountFromGlobal: () => void = () => {};
    return {
        require_: ctx.require_,
        define: ctx.define,
        onModuleUpdate(targets: string[] | undefined, cb: (moduleNames: string[]) => void) {
            return ctx.eventSubscribeManager.listen('update', (moduleName) => {
                if(!targets || targets.includes(moduleName as string)) {
                    cb([moduleName as string]);
                }
            });
        },
        _import: importGlobalObjectScript.bind(null, ctx.scriptContainerDom),
        mountToGlobal() {
            const currentDefine = Reflect.get(window, 'define');
            const currentRequire = Reflect.get(window, 'require');

            Reflect.set(window, 'define', ctx.define);
            Reflect.set(window, 'require', ctx.require_);

            unmountFromGlobal = () => {
                Reflect.set(window, 'define', currentDefine);
                Reflect.set(window, 'require', currentRequire);
            };
            return unmountFromGlobal;
        },
        unmountFromGlobal,
        set: ({ target, resolve: _resolve }: { target?: HTMLElement, resolve?: IAmdModuleManagerContext['require_']['resolveDeps']; }) => {
            if (_resolve) {
                ctx.require_.resolveDeps = _resolve;
            }
            if (target) {
                ctx.scriptContainerDom = target;
            }
        }
    };
}

export type IAmdManager = ReturnType<typeof createAmdManager>;

/**
 * 创建一个全局使用的默认 AMD 管理上下文
 */
export const defaultManager = createAmdManager();
export const { define, require_, onModuleUpdate, _import, mountToGlobal } = defaultManager;
