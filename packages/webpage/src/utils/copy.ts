import { useMessage } from '@/components';

type IMessages = ReturnType<typeof useMessage>;

let message: IMessages;

export function useInitCopy() {
    message = useMessage();
}

export async function copy(text: string) {
    if (window.location.protocol === 'http:') {
        message?.fail({
            title: '复制失败',
            content: '测试环境不支持复制'
        });
        return;
    }
    const res = await navigator.clipboard.writeText(text);
    message?.success?.({
        title: '复制成功',
        content: '复制文本成功，赶快去粘贴使用吧！'
    });
    return res;
}
