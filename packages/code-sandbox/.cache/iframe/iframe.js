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
  if (Reflect.get(message, "__proxy_internal") !== "wait") {
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
    if (Reflect.get(message, "__proxy_internal") !== "call") {
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
      if (res instanceof Promise) {
        debugger;
      }
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
  return new Promise((resolve3, reject) => {
    const messageId = getMessageId();
    const timeout_ = setTimeout(() => {
      self.removeEventListener("message", callback);
      reject(`[proxy] wait for ${serviceId} timeout .`);
    }, timeout);
    const callback = (e) => {
      if ((e.source || self) !== win)
        return;
      const message = e.data;
      if (Reflect.get(message, "__proxy_internal") !== "wait-reply" || message.id !== messageId) {
        return;
      }
      resolve3(null);
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
  return new Promise((resolve3, reject) => {
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
      if (Reflect.get(message, "__proxy_internal") !== "reply" || message.id !== messageId)
        return;
      handler.removeEventListener("message", callback);
      clearTimeout(timeout_);
      logger.debug("[proxy] receive reply", ((_a2 = self == null ? void 0 : self.location) == null ? void 0 : _a2.href) || "worker", message.id);
      if (message.error) {
        reject(message.payload[0]);
        return;
      }
      resolve3(message.payload[0]);
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
function bindScriptLoaderToCtx(ctx2) {
  let loadingModuleName = "";
  const scriptLoadingTasks = [];
  const loadScript = async (dom, url, moduleName2 = "globalObj") => {
    if (loadingModuleName) {
      await new Promise((resolve3) => {
        resolve3.moduleName = moduleName2;
        scriptLoadingTasks.push(resolve3);
      });
    }
    return new Promise((resolve3, reject) => {
      const script = document.createElement("script");
      const timeout = setTimeout(() => {
        var _a;
        ctx2.logger.log("[amd] script load timeout " + moduleName2);
        reject(new Error(`load module ${moduleName2} timeout`));
        (_a = scriptLoadingTasks.shift()) == null ? void 0 : _a();
      }, ctx2.scriptTimeout);
      script.onload = () => {
        var _a;
        ctx2.logger.log("[amd] script resolved", loadingModuleName);
        clearTimeout(timeout);
        resolve3(null);
        loadingModuleName = "";
        (_a = scriptLoadingTasks.shift()) == null ? void 0 : _a();
      };
      script.onerror = (err) => {
        var _a;
        ctx2.logger.log("[amd] script rejected", loadingModuleName);
        clearTimeout(timeout);
        reject(err);
        loadingModuleName = "";
        (_a = scriptLoadingTasks.shift()) == null ? void 0 : _a();
      };
      script.crossOrigin = "anonymous";
      script.src = url;
      script.type = "text/javascript";
      ctx2.logger.log("[amd] start load script", moduleName2);
      loadingModuleName = moduleName2;
      dom.appendChild(script);
    });
  };
  ctx2.scriptLoader = {
    getLoadingModuleName: () => loadingModuleName,
    loadScript,
    scriptLoadingTasks
  };
}
var IEventTypes = /* @__PURE__ */ ((IEventTypes2) => {
  IEventTypes2["ModuleUpdate"] = "module-update";
  IEventTypes2["LoadingScript"] = "loading-script";
  return IEventTypes2;
})(IEventTypes || {});
function bindDefineToCtx(ctx2) {
  function define(moduleName2, dependencies_, factory2) {
    if (typeof moduleName2 === "function") {
      factory2 = moduleName2;
      dependencies_ = ["require", "exports", "module"];
      moduleName2 = ctx2.scriptLoader.getLoadingModuleName();
    }
    if (Array.isArray(moduleName2)) {
      factory2 = dependencies_;
      dependencies_ = moduleName2;
      moduleName2 = ctx2.scriptLoader.getLoadingModuleName();
    }
    ctx2.logger.log("[amd] define module", moduleName2, dependencies_);
    const modulePath2 = ctx2.require_.resolve(moduleName2);
    const { factories: factories2, cache: cache2, dependencies: dependencies2 } = ctx2.require_;
    if (factories2.has(modulePath2)) {
      factories2.delete(modulePath2);
    }
    if (cache2.has(modulePath2)) {
      cache2.delete(modulePath2);
    }
    if (dependencies2.has(modulePath2)) {
      dependencies2.delete(modulePath2);
    }
    ctx2.eventSubscribeManager.trigger(IEventTypes.ModuleUpdate, modulePath2);
    factories2.set(modulePath2, factory2);
    dependencies2.set(modulePath2, dependencies_);
    return () => {
      ctx2.logger.log("[amd] module dispose", moduleName2);
      factories2.delete(modulePath2);
    };
  }
  ctx2.define = Object.assign(define, {
    amd: {}
  });
}
function assertPath(path) {
  if (typeof path !== "string") {
    throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
  }
}
function normalizeStringPosix(path, allowAboveRoot) {
  var res = "";
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47)
      break;
    else
      code = 47;
    if (code === 47) {
      if (lastSlash === i - 1 || dots === 1)
        ;
      else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = "";
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += "/..";
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += "/" + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}
var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve2() {
    var resolvedPath = "";
    var resolvedAbsolute = false;
    var cwd;
    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === void 0)
          cwd = process.cwd();
        path = cwd;
      }
      assertPath(path);
      if (path.length === 0) {
        continue;
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47;
    }
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return "/" + resolvedPath;
      else
        return "/";
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return ".";
    }
  },
  normalize: function normalize(path) {
    assertPath(path);
    if (path.length === 0)
      return ".";
    var isAbsolute2 = path.charCodeAt(0) === 47;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47;
    path = normalizeStringPosix(path, !isAbsolute2);
    if (path.length === 0 && !isAbsolute2)
      path = ".";
    if (path.length > 0 && trailingSeparator)
      path += "/";
    if (isAbsolute2)
      return "/" + path;
    return path;
  },
  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47;
  },
  join: function join() {
    if (arguments.length === 0)
      return ".";
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === void 0)
          joined = arg;
        else
          joined += "/" + arg;
      }
    }
    if (joined === void 0)
      return ".";
    return posix.normalize(joined);
  },
  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to)
      return "";
    from = posix.resolve(from);
    to = posix.resolve(to);
    if (from === to)
      return "";
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47) {
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47) {
            lastCommonSep = i;
          } else if (i === 0) {
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47)
        lastCommonSep = i;
    }
    var out = "";
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47) {
        if (out.length === 0)
          out += "..";
        else
          out += "/..";
      }
    }
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47)
        ++toStart;
      return to.slice(toStart);
    }
  },
  _makeLong: function _makeLong(path) {
    return path;
  },
  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0)
      return ".";
    var code = path.charCodeAt(0);
    var hasRoot = code === 47;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
        matchedSlash = false;
      }
    }
    if (end === -1)
      return hasRoot ? "/" : ".";
    if (hasRoot && end === 1)
      return "//";
    return path.slice(0, end);
  },
  basename: function basename(path, ext) {
    if (ext !== void 0 && typeof ext !== "string")
      throw new TypeError('"ext" argument must be a string');
    assertPath(path);
    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;
    if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path)
        return "";
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                end = i;
              }
            } else {
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end)
        end = firstNonSlashEnd;
      else if (end === -1)
        end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
      }
      if (end === -1)
        return "";
      return path.slice(start, end);
    }
  },
  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46) {
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path.slice(startDot, end);
  },
  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format("/", pathObject);
  },
  parse: function parse(path) {
    assertPath(path);
    var ret = { root: "", dir: "", base: "", ext: "", name: "" };
    if (path.length === 0)
      return ret;
    var code = path.charCodeAt(0);
    var isAbsolute2 = code === 47;
    var start;
    if (isAbsolute2) {
      ret.root = "/";
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;
    var preDotState = 0;
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46) {
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute2)
          ret.base = ret.name = path.slice(1, end);
        else
          ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute2) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0)
      ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute2)
      ret.dir = "/";
    return ret;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
posix.posix = posix;
var pathBrowserify = posix;
function bindRequireToCtx(ctx) {
  const cache = /* @__PURE__ */ new Map();
  const factories = /* @__PURE__ */ new Map();
  const dependencies = /* @__PURE__ */ new Map();
  const moduleRequiringTasks = /* @__PURE__ */ new Map();
  const parseModuleName = function(moduleName2) {
    const [, name, version, file] = moduleName2.match(/(^@?[^/@]+)(?:@([^/]+))?(.*)/) || [];
    return [name, version, file];
  };
  const resolve = (moduleName2, __filepath) => {
    if (["require", "module", "exports"].includes(moduleName2)) {
      return moduleName2;
    }
    if (pathBrowserify.isAbsolute(moduleName2)) {
      return moduleName2;
    }
    if (moduleName2.startsWith(".")) {
      if (!__filepath) {
        throw new Error(`[amd] can't not resolve relative path ${moduleName2} without __dirname`);
      }
      return pathBrowserify.resolve(pathBrowserify.dirname(__filepath), moduleName2);
    }
    const [modulePath2] = parseModuleName(moduleName2);
    return pathBrowserify.resolve(ctx.root, "node_modules", modulePath2);
  };
  const resolveDeps = async (_packageName, _version, _file) => {
    const params = {
      packageName: _packageName,
      version: _version,
      file: _file
    };
    const res = await ctx.pluginReduce(
      async (preValue, plugin) => {
        const res2 = await plugin.resolveModuleUrl(preValue);
        if (typeof res2 === "string") {
          return {
            result: res2,
            break: true
          };
        }
        return { result: res2 };
      },
      params
    );
    return res;
  };
  const moduleFactory = async (moduleName, _this) => {
    const modulePath = resolve(moduleName, _this.__dirname);
    if (moduleRequiringTasks.has(modulePath)) {
      return await new Promise((resolve22, reject) => {
        const tasks = moduleRequiringTasks.get(modulePath);
        tasks.push([resolve22, reject]);
        ctx.logger.log(`[amd] require ${moduleName}, already has task requiring, waiting tasks: ${tasks.length}.`);
      });
    }
    ctx.logger.log("[amd] start require", modulePath);
    moduleRequiringTasks.set(modulePath, []);
    const clearAllTasks = (err, module_2) => {
      const tasks = moduleRequiringTasks.get(modulePath);
      if (tasks == null ? void 0 : tasks.length) {
        tasks.forEach(([resolve22, reject], index) => {
          ctx.logger.log("[amd] resolve item", index, moduleName);
          if (err) {
            reject(err);
          }
          resolve22(module_2);
        });
      }
      moduleRequiringTasks.delete(modulePath);
      if (err) {
        throw err;
      }
      return module_2;
    };
    if (cache.has(modulePath)) {
      ctx.logger.log(`[amd] require ${moduleName}, resolved from cache`);
      return clearAllTasks(void 0, cache.get(modulePath));
    }
    const require_ = getRequireFunc({ __dirname: modulePath });
    let factory = factories.get(modulePath);
    if (!factory) {
      if (!moduleName.startsWith(".") && !moduleName.startsWith("__") && !pathBrowserify.isAbsolute(moduleName)) {
        const [name, version, file] = parseModuleName(moduleName);
        const scriptUrl = await require_.resolveDeps(name, version, file);
        ctx.eventSubscribeManager.trigger(IEventTypes.LoadingScript, moduleName, scriptUrl);
        if (typeof scriptUrl === "string") {
          await ctx.scriptLoader.loadScript(ctx.scriptContainerDom, scriptUrl, moduleName);
          factory = factories.get(modulePath);
          ctx.logger.log("[amd] script loaded", factory, modulePath);
        }
      }
      if (!factory) {
        const err = new Error(`[amd] module error: ${modulePath} does not exist.`);
        return clearAllTasks(err);
      }
    }
    let depModuleNames = dependencies.get(modulePath);
    if (typeof factory === "string") {
      const { deps: _depModuleNames, factory: factory_ } = await ctx.pluginReduce(async (preValue, plugin) => {
        const result = await plugin.beforeModuleGenerate(_this, preValue);
        return { result: { ...result, name: moduleName } };
      }, { name: moduleName, deps: depModuleNames, factory });
      factory = factory_;
      depModuleNames = _depModuleNames;
    }
    const _exports = {};
    const commonjs = {
      require: require_,
      module: { exports: _exports },
      exports: _exports
    };
    let deps = [];
    if (depModuleNames == null ? void 0 : depModuleNames.length) {
      deps = await Promise.all(depModuleNames.map((depName) => {
        if (commonjs[depName])
          return commonjs[depName];
        return require_(depName);
      }));
    }
    try {
      let exportsReturn;
      if (typeof factory === "string") {
        exportsReturn = await eval(factory)(...deps);
      } else {
        exportsReturn = await factory(...deps);
      }
      const module_ = (() => {
        if (Object.keys(commonjs.module.exports).length || typeof commonjs.module.exports !== "object") {
          return commonjs.module.exports;
        }
        return exportsReturn;
      })();
      cache.set(modulePath, module_);
      ctx.logger.log("[amd] resolve module tasks head", modulePath, module_);
      return clearAllTasks(void 0, module_);
    } catch (err) {
      return clearAllTasks(err, void 0);
    }
  };
  const requireProto = async (_this2, ...args) => {
    const [moduleNames_, cb] = args;
    const moduleNames = await ctx.pluginReduce(async (preValue, plugin) => {
      return {
        result: await plugin.require(_this2, preValue)
      };
    }, moduleNames_);
    let modules;
    if (Array.isArray(moduleNames)) {
      modules = await Promise.all(moduleNames.map((name) => moduleFactory(name, _this2)));
    } else {
      modules = await moduleFactory(moduleNames, _this2);
    }
    cb == null ? void 0 : cb(modules);
    return modules;
  };
  const getRequireFunc = (_this2) => {
    var _a;
    return Object.assign(requireProto.bind(null, _this2), {
      cache,
      factories,
      resolve,
      dependencies,
      moduleRequiringTasks,
      // 这么取值是为了可以从外部覆盖掉 resolveDeps 的逻辑
      resolveDeps: ((_a = ctx == null ? void 0 : ctx.require_) == null ? void 0 : _a.resolveDeps) || resolveDeps
    });
  };
  ctx.require_ = getRequireFunc({ __dirname: ctx.root });
}
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
function createAmdManager(root = "/", scriptTimeout = 1e4, logger2 = console) {
  const ctx2 = {};
  ctx2.eventSubscribeManager = createEventSubscribeManager();
  ctx2.root = root;
  ctx2.scriptTimeout = scriptTimeout;
  ctx2.scriptContainerDom = document.body;
  ctx2.logger = logger2;
  ctx2.plugins = [];
  ctx2.pluginReduce = async (reducer, initValue) => {
    let result = initValue;
    for (const plugin of ctx2.plugins) {
      const { result: res, break: break_ } = await reducer(result, plugin);
      if (break_) {
        return res;
      }
      result = res;
    }
    return result;
  };
  bindRequireToCtx(ctx2);
  bindDefineToCtx(ctx2);
  bindScriptLoaderToCtx(ctx2);
  function importGlobalObjectScript(target, url, name) {
    return async (_require) => {
      await ctx2.scriptLoader.loadScript(target, url);
      return {
        "default": Reflect.get(window, name),
        ...Reflect.get(window, name)
      };
    };
  }
  const module_2 = {
    require_: ctx2.require_,
    define: ctx2.define,
    _import: importGlobalObjectScript.bind(null, ctx2.scriptContainerDom),
    set: ({ target, resolve: _resolve }) => {
      if (_resolve) {
        ctx2.require_.resolveDeps = _resolve;
      }
      if (target) {
        ctx2.scriptContainerDom = target;
      }
    },
    onModuleUpdate(targets, cb) {
      return ctx2.eventSubscribeManager.listen(IEventTypes.ModuleUpdate, (moduleName2) => {
        if (!targets || targets.includes(moduleName2)) {
          cb([moduleName2]);
        }
      });
    },
    onModuleLoading(cb) {
      return ctx2.eventSubscribeManager.listen(IEventTypes.LoadingScript, (moduleName2, url) => {
        cb(moduleName2, url);
      });
    },
    mountToGlobal(global_ = window) {
      const currentDefine = Reflect.get(global_, "define");
      const currentRequire = Reflect.get(global_, "require");
      Reflect.set(global_, "define", ctx2.define);
      Reflect.set(global_, "require", ctx2.require_);
      return () => {
        Reflect.set(global_, "define", currentDefine);
        Reflect.set(global_, "require", currentRequire);
      };
    },
    setPlugins(plugins) {
      ctx2.plugins = plugins;
    }
  };
  ctx2.define("module-manager", [], async () => ({
    default: module_2,
    ...module_2
  }));
  return module_2;
}
createAmdManager();
const DemoServiceName = "demo-service";
const NOTIFICATION_SERVICE = "iframe-notification-service";
const iframeReady = async () => {
  registerProxy(NOTIFICATION_SERVICE, {
    iframeReady: async () => {
      return true;
    }
  });
  const parent = window.top || window.parent || window.opener;
  if (!parent)
    return;
  return callProxy({
    win: parent,
    serviceId: NOTIFICATION_SERVICE,
    method: "iframeReady",
    payload: []
  });
};
const iframeLoadingModule = async (moduleName2, extraInfo) => {
  const parent = window.top || window.parent || window.opener;
  if (!parent)
    return;
  return callProxy({
    win: parent,
    serviceId: NOTIFICATION_SERVICE,
    method: "iframeLoadingModule",
    payload: [moduleName2, extraInfo]
  });
};
function generatePlugins(pluginsServiceId) {
  const parent = window.parent || window.top || window.opener;
  const generateMethod = (key, serviceId) => async (...args) => {
    await waitProxy(parent, serviceId);
    return await callProxy({
      win: parent,
      serviceId,
      method: key,
      payload: args
    });
  };
  return pluginsServiceId.map((serviceId) => {
    const keys = ["require", "beforeModuleGenerate", "resolveModuleUrl"];
    return keys.reduce((pre, key) => {
      return {
        ...pre,
        [key]: generateMethod(key, serviceId)
      };
    }, {});
  });
}
const manager = createAmdManager(void 0, void 0, logger);
manager.mountToGlobal();
const style = document.createElement("style");
document.head.appendChild(style);
manager.onModuleLoading(iframeLoadingModule);
registerProxy(DemoServiceName, {
  defineModule: async (name, deps2, factory2) => {
    manager.define(name, deps2, factory2);
    return true;
  },
  executeModule: async (name) => {
    await manager.require_(name);
    return true;
  },
  setStyle: async (code) => {
    style.innerHTML = code;
    return true;
  },
  setPlugins: async (pluginIds) => {
    const plugins = generatePlugins(pluginIds);
    manager.setPlugins(plugins);
  },
  setBodyHtml: async (html) => {
    document.body.innerHTML = html;
  }
});
window.onerror = (err) => {
  console.error(err);
};
iframeReady();
//# sourceMappingURL=iframe.js.map
