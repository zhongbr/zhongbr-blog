const createEventSubscribeManager = () => {
  const eventsHandlersMap = /* @__PURE__ */ new Map();
  const trigger = (key, ...params) => {
    const handlers = eventsHandlersMap.get(key);
    if (handlers) {
      const drops = /* @__PURE__ */ new Map();
      handlers.forEach((handler, index) => {
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
  };
  const listen = (key, cb, filter) => {
    var _a, _b;
    if (!eventsHandlersMap.has(key)) {
      eventsHandlersMap.set(key, []);
    }
    (_b = (_a = eventsHandlersMap.get(key)) == null ? void 0 : _a.push) == null ? void 0 : _b.call(_a, Object.assign(cb, {
      filter
    }));
    return () => {
      var _a2;
      (_a2 = eventsHandlersMap.get(key)) == null ? void 0 : _a2.filter((handler) => handler !== cb);
    };
  };
  const once = (key, cb, filter, onTimeout, timeout = -1) => {
    var _a, _b;
    if (!eventsHandlersMap.has(key)) {
      eventsHandlersMap.set(key, []);
    }
    const dispose = () => {
      var _a2;
      (_a2 = eventsHandlersMap.get(key)) == null ? void 0 : _a2.filter((handler) => handler !== cb);
    };
    let _timeout;
    if (timeout !== -1) {
      _timeout = setTimeout(() => {
        dispose();
        onTimeout == null ? void 0 : onTimeout();
      }, timeout);
    }
    (_b = (_a = eventsHandlersMap.get(key)) == null ? void 0 : _a.push) == null ? void 0 : _b.call(_a, Object.assign((...args) => {
      if (_timeout)
        clearTimeout(_timeout);
      cb(...args);
    }, {
      once: true,
      filter
    }));
    return dispose;
  };
  return { trigger, listen, once };
};
export {
  createEventSubscribeManager
};
//# sourceMappingURL=index.js.map
