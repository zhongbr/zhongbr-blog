import { useState, useEffect, useRef } from 'react';

import { useMessage, usePersistFn } from '@/hooks';
import { sendMessage } from "@/utils/post-message";
import { IEvent, IMessageType } from "@/types/iframe-sandbox";

export interface IOptions {
    onAfterRun?: () => Promise<void>;
}

/**
 * 在 模块代码或者模块名称发生变化之后，在 iframe 内声明并执行
 * @param iframe iframe 节点
 * @param name 模块的名称
 * @param deps 模块依赖的模块
 * @param code 模块的代码
 * @param opt 其他参数
 */
export default function useIframeModule(iframe: HTMLIFrameElement | null, name: string, deps: string[], code: string, opt?: IOptions) {
    const [loading, setLoading] = useState(false);

    const runModule = usePersistFn(async () => {
        if (!iframe) return;
        if (!iframe.contentWindow) return;
        if (!code) return;
        setLoading(true);
        // 发送消息到 iframe 让 iframe 执行设置代码
        await sendMessage<IEvent, typeof iframe.contentWindow>(iframe.contentWindow, {
            id: Math.random().toString(),
            type: IMessageType.DefineModule,
            payload: [name, code, deps]
        });
        await sendMessage<IEvent, typeof iframe.contentWindow>(iframe.contentWindow, {
            id: Math.random().toString(),
            type: IMessageType.RunModule,
            payload: [name]
        });
        await opt?.onAfterRun?.();
        setLoading(false);
    });

    const mountRef = useRef(false);

    // 接收到 iframe 发来的消息后，执行模块
    useMessage(e => {
        mountRef.current = true;
        return e.data.type === IMessageType.IFrameReady && e.source === iframe?.contentWindow;
    }, runModule);

    useEffect(() => {
        if (!mountRef.current) return;
        runModule();
    }, [code, runModule]);

    return [loading, runModule] as const;
}
