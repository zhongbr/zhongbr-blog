const EVENT_KEY = 'iframe_ready';
export const waitIframe = async (window_: WindowProxy, timeout=10000) => {
    return new Promise<null>((resolve, reject) => {
        const _timeout = setTimeout(() => {
            reject(`[iframe] wait iframe timeout.`);
        }, timeout);
        const callback = (e: MessageEvent) => {
            clearTimeout(_timeout);
            const message = e.data;
            if (!Reflect.get(message, EVENT_KEY)|| e.source !== window_) {
                return;
            }
            resolve(null);
        };
        window.addEventListener('message', callback);
        window_?.postMessage({
            [EVENT_KEY]: 'query'
        });
    });
}

export const iframeReady = async () => {
    self.addEventListener('message', e => {
        if (Reflect.get(e.data, EVENT_KEY) === 'query') {
            e.source?.postMessage?.({
                [EVENT_KEY]: true
            });
        }
    });
    const parent = window.top || window.parent || window.opener;
    if (!parent) return;
    parent.postMessage({
        [EVENT_KEY]: true
    });
};
