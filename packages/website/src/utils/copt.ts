export async function copy(text: string) {
    if (window.location.protocol === 'http:') {
        console.info('测试环境不支持复制');
        return;
    }
    return await navigator.clipboard.writeText(text);
}
