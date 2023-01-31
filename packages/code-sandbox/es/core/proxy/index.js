const debugOnlyLevel = ["log", "debug"];
const logger = debugOnlyLevel.reduce((pre, key) => {
  return Object.assign(pre, {
    [key]: (...args) => {
      return null;
    }
  });
}, {});
let MessageID = 0;
const getMessageId = () => MessageID++;
const services = /* @__PURE__ */ new Set();
const waitServiceCallbacks = /* @__PURE__ */ new Map();
self.addEventListener("message", (e) => {
  const message = e.data;
  if (typeof message !== "object" || Reflect.get(message, "__proxy_internal") !== "wait") {
    return;
  }
  const serviceId = message.receiver;
  const timeout_ = setTimeout(() => {
    const callbacks2 = (waitServiceCallbacks.get(serviceId) || []).filter((c) => c !== callback);
    waitServiceCallbacks.set(serviceId, callbacks2);
    (e.source || self).postMessage({
      __proxy_internal: "wait-reply",
      error: true,
      id: message.id,
      payload: [`[proxy]wait for service ${serviceId} timeout.`]
    });
  }, message.timeout);
  const callback = () => {
    clearTimeout(timeout_);
    (e.source || self).postMessage({
      __proxy_internal: "wait-reply",
      id: message.id,
      error: false,
      payload: []
    });
    const callbacks2 = (waitServiceCallbacks.get(serviceId) || []).filter((c) => c !== callback);
    waitServiceCallbacks.set(serviceId, callbacks2);
  };
  const callbacks = waitServiceCallbacks.get(serviceId) || [];
  callbacks.push(callback);
  waitServiceCallbacks.set(serviceId, callbacks);
  if (services.has(serviceId)) {
    callback();
  }
});
function registerProxy(serviceId, obj) {
  if (services.has(serviceId)) {
    return;
  }
  services.add(serviceId);
  const callbacks = waitServiceCallbacks.get(serviceId);
  if (callbacks)
    callbacks.forEach((callback) => callback());
  const serviceHandler = async (e) => {
    var _a;
    const message = e.data;
    if (typeof message !== "object" || Reflect.get(message, "__proxy_internal") !== "call") {
      return;
    }
    if (message.receiver === serviceId) {
      const method = Reflect.get(obj, message.method);
      if (!method) {
        (e.source || self).postMessage({
          __proxy_internal: "reply",
          id: message.id,
          error: true,
          payload: [`[proxy] method \`${message.method}\` does not exist on remote object ${message.receiver} or it is not a function.`]
        });
      }
      let res = method;
      if (typeof method === "function") {
        res = await method.call(obj, ...message.payload, e);
      }
      logger.debug("[proxy] reply", ((_a = self == null ? void 0 : self.location) == null ? void 0 : _a.href) || "worker", e.source, message.receiver, message.method, e.source || self);
      (e.source || self).postMessage({
        __proxy_internal: "reply",
        id: message.id,
        error: false,
        payload: [res]
      });
    }
  };
  self.addEventListener("message", serviceHandler);
  return () => {
    self.removeEventListener("message", serviceHandler);
  };
}
async function waitProxy(win, serviceId, timeout = 1e4) {
  return new Promise((resolve, reject) => {
    const messageId = getMessageId();
    const timeout_ = setTimeout(() => {
      self.removeEventListener("message", callback);
      reject(`[proxy] wait for ${serviceId} timeout .`);
    }, timeout);
    const callback = (e) => {
      if ((e.source || self) !== win)
        return;
      const message = e.data;
      if (typeof message !== "object" || Reflect.get(message, "__proxy_internal") !== "wait-reply" || message.id !== messageId) {
        return;
      }
      resolve(null);
      clearTimeout(timeout_);
      self.removeEventListener("message", callback);
    };
    self.addEventListener("message", callback);
    win.postMessage({
      __proxy_internal: "wait",
      receiver: serviceId,
      payload: [],
      error: false,
      id: messageId
    });
  });
}
async function callProxy({ win, serviceId, method, payload, timeout = 1e4 }) {
  return new Promise((resolve, reject) => {
    var _a;
    const messageId = getMessageId();
    let handler = self;
    if (win instanceof Worker) {
      handler = win;
    }
    let timeout_ = setTimeout(() => {
      reject(`call remote object ${serviceId} method ${method.toString()} timeout`);
      handler.removeEventListener("message", callback);
    }, timeout);
    const callback = (e) => {
      var _a2;
      if (!(win instanceof Worker) && (e.source || self) !== win)
        return;
      const message = e.data;
      if (typeof message !== "object" || Reflect.get(message, "__proxy_internal") !== "reply" || message.id !== messageId)
        return;
      handler.removeEventListener("message", callback);
      clearTimeout(timeout_);
      logger.debug("[proxy] receive reply", ((_a2 = self == null ? void 0 : self.location) == null ? void 0 : _a2.href) || "worker", message.id);
      if (message.error) {
        reject(message.payload[0]);
        return;
      }
      resolve(message.payload[0]);
    };
    handler.addEventListener("message", callback);
    logger.debug("[proxy] call", ((_a = self == null ? void 0 : self.location) == null ? void 0 : _a.href) || "worker", serviceId, method);
    win.postMessage({
      id: messageId,
      __proxy_internal: "call",
      receiver: serviceId,
      method,
      payload,
      error: false
    });
  });
}
export {
  callProxy,
  registerProxy,
  waitProxy
};
//# sourceMappingURL=index.js.map
