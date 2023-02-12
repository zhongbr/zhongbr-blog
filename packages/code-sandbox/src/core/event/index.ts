export interface Handler {
    (...params: unknown[]): void;
    filter?: (...params: unknown[]) => boolean;
    once?: boolean;
}

export const createEventSubscribeManager = <K = string>() => {
    const eventsHandlersMap = new Map<K, Array<Handler>>();

    const trigger = (key: K, ...params: unknown[]) => {
        const handlers = eventsHandlersMap.get(key);
        if (handlers) {
            const drops = new Map<number, boolean>();
            handlers.forEach((handler, index) => {
                // 存在触发条件，但是不满足的跳过
                if (handler.filter && !handler.filter(...params)) {
                    return;
                }
                handler(...params);
                if (handler.once) {
                    drops.set(index, true);
                }
            });
            eventsHandlersMap.set(key, handlers.filter((_, index) => !drops.get(index)));
        }
    }

    const listen = (key: K, cb: Handler, filter?: Handler['filter']) => {
        if (!eventsHandlersMap.has(key)) {
            eventsHandlersMap.set(key, []);
        }
        const _cb = Object.assign(cb, {
            filter
        });
        eventsHandlersMap.get(key)?.push?.(_cb);
        return () => {
            eventsHandlersMap.set(key, eventsHandlersMap.get(key)?.filter(handler => handler !== _cb));
        }
    };

    const once = (key: K, cb: Handler, filter?: Handler['filter'], onTimeout?: () => void, timeout = -1) => {
        if (!eventsHandlersMap.has(key)) {
            eventsHandlersMap.set(key, []);
        }
        const dispose = () => {
            eventsHandlersMap.set(key, eventsHandlersMap.get(key)?.filter(handler => handler !== _cb));
        }

        // 超时
        let _timeout;
        if (timeout !== -1) {
            _timeout = setTimeout(() => {
                dispose();
                onTimeout?.();
            }, timeout);
        }
        const _cb = Object.assign((...args) => {
            if (_timeout) clearTimeout(_timeout);
            cb(...args);
        }, {
            once: true,
            filter
        });
        eventsHandlersMap.get(key)?.push?.(_cb);
        return dispose;
    }

    return { trigger, listen, once };
}