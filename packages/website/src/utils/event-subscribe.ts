export interface Handler {
    (params: unknown): void;
    once?: boolean;
}

export const createEventSubscribeManager = () => {
    const eventsHandlersMap = new Map<string, Array<Handler>>;

    const trigger = (key: string, params: unknown) => {
        const handlers = eventsHandlersMap.get(key);
        if (handlers) {
            const drops = new Map<number, boolean>();
            handlers.forEach((handler, index) => {
                handler(params);
                if (handler.once) {
                    drops.set(index, true);
                }
            });
            eventsHandlersMap.set(key, handlers.filter((_, index) => !drops.get(index)));
        }
    }

    const listen = (key: string, cb: Handler) => {
        if (!eventsHandlersMap.has(key)) {
            eventsHandlersMap.set(key, []);
        }
        eventsHandlersMap.get(key)?.push?.(cb);
        return () => {
            eventsHandlersMap.get(key)?.filter(handler => handler !== cb);
        }
    };

    const once = (key: string, cb: Handler) => {
        if (!eventsHandlersMap.has(key)) {
            eventsHandlersMap.set(key, []);
        }
        cb.once = true;
        eventsHandlersMap.get(key)?.push?.(cb);
        return () => {
            eventsHandlersMap.get(key)?.filter(handler => handler !== cb);
        }
    }

    return { trigger, listen, once };
}
