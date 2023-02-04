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
    }, {
      targetOrigin: "*"
    });
  }, message.timeout);
  const callback = () => {
    clearTimeout(timeout_);
    (e.source || self).postMessage({
      __proxy_internal: "wait-reply",
      id: message.id,
      error: false,
      payload: []
    }, {
      targetOrigin: "*"
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
        }, {
          targetOrigin: "*"
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
      }, {
        targetOrigin: "*"
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
      if (typeof message !== "object" || Reflect.get(message, "__proxy_internal") !== "wait-reply" || message.id !== messageId) {
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
    }, {
      targetOrigin: "*"
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
      if (typeof message !== "object" || Reflect.get(message, "__proxy_internal") !== "reply" || message.id !== messageId)
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
    }, {
      targetOrigin: "*"
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
  IEventTypes2["ModuleDeps"] = "module-deps";
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
    const modulePath2 = ctx2.require.resolve(moduleName2);
    const { factories: factories2, cache: cache2, dependencies: dependencies2 } = ctx2.require;
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
    if (moduleName2.startsWith("/")) {
      return pathBrowserify.resolve(ctx.root, moduleName2);
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
    let factory = factories.get(modulePath);
    if (!factory) {
      if (!moduleName.startsWith(".") && !pathBrowserify.isAbsolute(moduleName)) {
        const [name, version, file] = parseModuleName(moduleName);
        const scriptUrl = await resolveDeps(name, version, file);
        ctx.eventSubscribeManager.trigger(IEventTypes.LoadingScript, moduleName, scriptUrl);
        if (typeof scriptUrl === "string") {
          await ctx.scriptLoader.loadScript(document.body, scriptUrl, moduleName);
          factory = factories.get(modulePath);
          ctx.logger.log("[amd] script loaded", factory, modulePath);
        }
      } else {
        const [exist, file] = ctx.fs.pathReduce(modulePath);
        if (exist && Reflect.has(file, "content")) {
          const content = file.content;
          factories.set(modulePath, content);
          factory = content;
        }
      }
      if (!factory) {
        const err = new Error(`[amd] module error: ${modulePath} does not exist.`);
        return clearAllTasks(err);
      }
    }
    const moduleDeps = [];
    const requireCtx = { __dirname: modulePath, deps: moduleDeps };
    const require_ = getRequireFunc(requireCtx);
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
      ctx.eventSubscribeManager.trigger(IEventTypes.ModuleDeps, requireCtx);
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
  const getRequireFunc = (_this2) => {
    return Object.assign(async (...args) => {
      var _a, _b;
      const [moduleNames_, cb] = args;
      const moduleNames = await ctx.pluginReduce(async (preValue, plugin) => {
        return {
          result: await plugin.require(_this2, preValue)
        };
      }, moduleNames_);
      if (typeof moduleNames === "string") {
        (_a = _this2.deps) == null ? void 0 : _a.push(resolve(moduleNames, _this2.__dirname));
      } else {
        (_b = _this2.deps) == null ? void 0 : _b.push(...moduleNames.reduce((previousValue, currentValue) => {
          previousValue.push(resolve(currentValue, _this2.__dirname));
          return previousValue;
        }, []));
      }
      let modules;
      if (Array.isArray(moduleNames)) {
        modules = await Promise.all(moduleNames.map((name) => moduleFactory(name, _this2)));
      } else {
        modules = await moduleFactory(moduleNames, _this2);
      }
      cb == null ? void 0 : cb(modules);
      return modules;
    }, {
      cache,
      factories,
      resolve,
      dependencies,
      moduleRequiringTasks,
      resolveDeps
    });
  };
  ctx.require = getRequireFunc({ __dirname: ctx.root });
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
    const _cb = Object.assign(cb, {
      filter
    });
    (_b = (_a = eventsHandlersMap.get(key)) == null ? void 0 : _a.push) == null ? void 0 : _b.call(_a, _cb);
    return () => {
      var _a2;
      eventsHandlersMap.set(key, (_a2 = eventsHandlersMap.get(key)) == null ? void 0 : _a2.filter((handler) => handler !== _cb));
    };
  };
  const once = (key, cb, filter, onTimeout, timeout = -1) => {
    var _a, _b;
    if (!eventsHandlersMap.has(key)) {
      eventsHandlersMap.set(key, []);
    }
    const dispose = () => {
      var _a2;
      eventsHandlersMap.set(key, (_a2 = eventsHandlersMap.get(key)) == null ? void 0 : _a2.filter((handler) => handler !== _cb));
    };
    let _timeout;
    if (timeout !== -1) {
      _timeout = setTimeout(() => {
        dispose();
        onTimeout == null ? void 0 : onTimeout();
      }, timeout);
    }
    const _cb = Object.assign((...args) => {
      if (_timeout)
        clearTimeout(_timeout);
      cb(...args);
    }, {
      once: true,
      filter
    });
    (_b = (_a = eventsHandlersMap.get(key)) == null ? void 0 : _a.push) == null ? void 0 : _b.call(_a, _cb);
    return dispose;
  };
  return { trigger, listen, once };
};
function createAmdManager(fs2, root = "/", scriptTimeout = 1e4, logger2 = console) {
  const ctx2 = {};
  ctx2.eventSubscribeManager = createEventSubscribeManager();
  ctx2.fs = fs2;
  ctx2.root = root;
  ctx2.scriptTimeout = scriptTimeout;
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
    require_: ctx2.require,
    define: ctx2.define,
    _import: importGlobalObjectScript.bind(null, document.body),
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
    onModuleDeps(cb) {
      return ctx2.eventSubscribeManager.listen(IEventTypes.ModuleDeps, (_this2) => {
        if (!_this2.deps) {
          debugger;
        }
        cb(_this2.deps || [], _this2.__dirname);
      });
    },
    mountToGlobal(global_ = window) {
      const currentDefine = Reflect.get(global_, "define");
      const currentRequire = Reflect.get(global_, "require");
      Reflect.set(global_, "define", ctx2.define);
      Reflect.set(global_, "require", ctx2.require);
      return () => {
        Reflect.set(global_, "define", currentDefine);
        Reflect.set(global_, "require", currentRequire);
      };
    },
    setPlugins(plugins) {
      ctx2.plugins = plugins;
    }
  };
  return module_2;
}
var FilesChangeType = /* @__PURE__ */ ((FilesChangeType2) => {
  FilesChangeType2["Delete"] = "delete";
  FilesChangeType2["Change"] = "change";
  FilesChangeType2["New"] = "new";
  return FilesChangeType2;
})(FilesChangeType || {});
const getPathFileName = (pathObject) => `${pathObject.name}${pathObject.ext}`;
const traverse = (dir = "", directory, cb) => {
  directory.children.forEach((item) => {
    if (Reflect.has(item, "children")) {
      traverse(`${pathBrowserify}/${item.name}`, item, cb);
      return;
    }
    cb(`${pathBrowserify}/${item.name}`, item);
  });
};
class FilesSystem {
  constructor() {
    this.root = {
      name: "",
      children: this.getProxyMap("", [])
    };
    this.eventCount = 0;
    this.event = createEventSubscribeManager();
    this.cp = this.cpOrMv.bind(this, false);
    this.mv = this.cpOrMv.bind(this, true);
  }
  getProxyMap(path2, entries) {
    const _this2 = this;
    const map = new Map(entries);
    const proxyMethod = (methodName, eventName) => {
      const _method = Reflect.get(map, methodName);
      if (typeof _method === "function") {
        const method = function(...args) {
          _this2.event.trigger(eventName, _this2.eventCount++, path2, ...args);
          return _method.call(map, ...args);
        };
        Reflect.set(map, methodName, method);
      }
    };
    proxyMethod("set", "dir-set");
    proxyMethod("delete", "dir-delete");
    proxyMethod("clear", "dir-clear");
    return map;
  }
  pathReduce(target) {
    const paths = target.split(pathBrowserify.sep);
    return paths.reduce(([status, dir], cur, index, arr) => {
      var _a, _b;
      if (index === 0) {
        return [status, dir];
      }
      if (index === arr.length - 1 && cur === "") {
        return [status, dir];
      }
      return [status && ((_a = dir.children) == null ? void 0 : _a.has(cur)), (_b = dir.children) == null ? void 0 : _b.get(cur)];
    }, [true, this.root]);
  }
  exist(target) {
    const [exist] = this.pathReduce(target);
    return exist;
  }
  mkdir(target) {
    const pathObject = pathBrowserify.parse(target);
    if (this.exist(target)) {
      throw new Error(`[fs] failed to mkdir ${target}, it is already existed.`);
    }
    const [parentExist, parent] = this.pathReduce(pathObject.dir);
    if (!parentExist) {
      throw new Error(`[fs] failed to mkdir ${target}, parent path ${pathObject.dir} is not existed.`);
    }
    if (!Reflect.has(parent, "children") || Reflect.has(parent, "content")) {
      throw new Error(`[fs] failed to mkdir ${target}, parent path ${pathObject.dir} is not a directory.`);
    }
    parent.children.set(getPathFileName(pathObject), {
      name: getPathFileName(pathObject),
      children: this.getProxyMap(pathBrowserify.format(pathObject), [])
    });
  }
  readDirectory(target) {
    const pathObject = pathBrowserify.parse(target);
    const [parentExist, parent] = this.pathReduce(pathObject.dir);
    if (!parentExist) {
      throw new Error(`[fs] failed to read directory ${target}, parent path ${pathObject.dir} is not existed.`);
    }
    return parent.children.get(getPathFileName(pathObject));
  }
  readFile(target) {
    const [exist, file] = this.pathReduce(target);
    if (!exist) {
      throw new Error(`[fs] failed to read file ${target}, it is not existed.`);
    }
    if (Reflect.has(file, "children")) {
      throw new Error(`[fs] failed to read file ${target}, it is a directory.`);
    }
    return file;
  }
  writeFile(target, contents) {
    const pathObject = pathBrowserify.parse(target);
    const [parentExist, parent] = this.pathReduce(pathObject.dir);
    if (!parentExist) {
      throw new Error(`[fs] failed to write file ${target}, parent path ${pathObject.dir} is not existed.`);
    }
    let writeContent = contents;
    if (typeof contents !== "string") {
      writeContent = btoa(String.fromCharCode.apply(null, new Uint8Array(contents)));
    }
    const existBefore = parent.children.has(getPathFileName(pathObject));
    parent.children.set(getPathFileName(pathObject), {
      name: getPathFileName(pathObject),
      content: writeContent
    });
    this.event.trigger("files-change", this.eventCount++, existBefore ? "change" : "new", [target]);
  }
  cpOrMv(isMv = false, source, target) {
    const sourcePathObject = pathBrowserify.parse(source);
    const targetPathObject = pathBrowserify.parse(target);
    const [sourceParentExist, sourceParent] = this.pathReduce(sourcePathObject.dir);
    const [targetParentExist, targetParent] = this.pathReduce(targetPathObject.dir);
    if (!sourceParentExist || !targetParentExist) {
      throw new Error(`[fs] failed to ${isMv ? "mv" : "cp"} ${source} to ${target}, source or target path is not existed.`);
    }
    if (targetParent.children.has(getPathFileName(targetPathObject))) {
      throw new Error(`[fs] failed to ${isMv ? "mv" : "cp"} ${source} to ${target}, target path is already existed.`);
    }
    targetParent.children.set(getPathFileName(targetPathObject), sourceParent.children.get(getPathFileName(sourcePathObject)));
    const sourceFileOrDirectory = sourceParent.children.get(source);
    const deletedFiles = [];
    const newFiles = [];
    if (Reflect.has(sourceFileOrDirectory, "content")) {
      deletedFiles.push(source);
      newFiles.push(target);
    } else {
      traverse(void 0, sourceFileOrDirectory, (path_) => {
        deletedFiles.push(pathBrowserify.join(sourcePathObject.dir, path_));
        newFiles.push(pathBrowserify.join(targetPathObject.dir, path_));
      });
    }
    if (isMv) {
      sourceParent.children.delete(getPathFileName(sourcePathObject));
      this.event.trigger("files-change", this.eventCount++, "delete", deletedFiles);
    }
    this.event.trigger("files-change", this.eventCount++, "new", newFiles);
  }
  rm(target) {
    const pathObject = pathBrowserify.parse(target);
    const [parentExist, parent] = this.pathReduce(pathObject.dir);
    if (!parentExist || !parent.children.has(getPathFileName(pathObject))) {
      throw new Error(`[fs] failed to rm ${target}, it is not existed.`);
    }
    const targetFileOrDirectory = parent.children.get(target);
    const deletedFiles = [];
    if (Reflect.has(targetFileOrDirectory, "content")) {
      deletedFiles.push(target);
    } else {
      traverse(void 0, targetFileOrDirectory, (path_) => {
        deletedFiles.push(pathBrowserify.join(pathObject.dir, path_));
      });
    }
    parent.children.delete(getPathFileName(pathObject));
    this.event.trigger("files-change", this.eventCount++, "delete", deletedFiles);
  }
  /**
   * 序列化内部存储的所有数据
   */
  getDataPayload() {
    return JSON.stringify(this.root, (key, value) => {
      if (value instanceof Map) {
        return {
          __dataType: "Map",
          entries: Array.from(value.entries())
        };
      }
      return value;
    });
  }
  /**
   * 触发将文件对象存储的数据传输到远端的事件
   */
  transfer() {
    const payload = this.getDataPayload();
    this.event.trigger("transfer", this.eventCount++, "", payload);
  }
  /**
   * 接收外部设置的数据
   * @param payload 底层数据
   */
  receive(payload) {
    const traverse2 = (obj, path2 = "") => {
      if (obj.children && Reflect.get(obj.children, "__dataType") === "Map") {
        const entries = obj.children.entries.map(([key, value]) => [key, traverse2(value, [path2, key].join("/"))]);
        return {
          ...obj,
          children: this.getProxyMap(path2, entries)
        };
      }
      return obj;
    };
    const root = traverse2(JSON.parse(payload));
    this.root = root;
    console.log("this.root", root);
    this.event.trigger("receive", this.eventCount++);
  }
}
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
const SyncServiceName = "code-sandbox-sync-files";
async function initIframeFilesSyncService(fs2) {
  const cacheQueue = /* @__PURE__ */ new Map();
  let currentCount = 0;
  const dispose = registerProxy(SyncServiceName, {
    sync: async (eventType, orderCount, path, ...args) => {
      cacheQueue.set(orderCount, [eventType, path, ...args]);
      while (cacheQueue.get(currentCount)) {
        const [eventType2, path2, ...args2] = cacheQueue.get(currentCount);
        cacheQueue.delete(currentCount);
        currentCount++;
        const [, dir_] = fs2.pathReduce(path2);
        const dir = dir_;
        switch (eventType2) {
          case "transfer": {
            fs2.receive.apply(fs2, args2);
            break;
          }
          case "dir-clear": {
            dir.children.clear();
            break;
          }
          case "dir-set": {
            dir.children.set.apply(dir.children, args2);
            break;
          }
          case "dir-delete": {
            dir.children.delete.apply(dir.children, args2);
            break;
          }
          case "files-change": {
            fs2.event.trigger(eventType2, path2, ...args2);
            break;
          }
        }
      }
    }
  });
  const payload = await callProxy({
    win: self.parent || self.opener || self.top,
    method: "requestFs",
    serviceId: SyncServiceName,
    payload: []
  });
  if (payload) {
    fs2.receive(payload);
    console.log("receive", payload, fs2);
    return;
  }
  return dispose;
}
const DemoServiceName = "demo-service";
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
class DepsGraph {
  constructor() {
    this.DepNodeIndexes = /* @__PURE__ */ new Map();
  }
  getDepNode(_target, create = false) {
    const target = _target.replace(/\/$/, "");
    if (!this.DepNodeIndexes.has(target) && create) {
      this.DepNodeIndexes.set(target, {
        path: target,
        come: /* @__PURE__ */ new Set(),
        out: /* @__PURE__ */ new Set()
      });
    }
    return this.DepNodeIndexes.get(target);
  }
  /**
   * 更新 from -> to 的路径
   * @param from 起点 node 数组
   * @param to 终点 node
   */
  updatePaths(from, to) {
    const targetNode = this.getDepNode(to, true);
    if (targetNode.come.size) {
      targetNode.come.forEach((depNode) => {
        depNode.out.delete(targetNode);
      });
      targetNode.come.clear();
    }
    from.forEach((nodePath) => {
      const depNode = this.getDepNode(nodePath, true);
      targetNode.come.add(depNode);
      depNode.out.add(targetNode);
    });
  }
  /**
   * 删除 from -> to 的路径
   * @param from 起点 node 数组
   * @param to 终点 node
   */
  deletePaths(from, to) {
    const targetNode = this.getDepNode(to);
    if (!targetNode)
      return false;
    from.forEach((sourcePath) => {
      const sourceNode = this.getDepNode(sourcePath);
      if (!sourceNode)
        return;
      sourceNode.out.delete(targetNode);
      targetNode.come.delete(sourceNode);
      this.deleteNode(sourceNode.path);
    });
  }
  /**
   * 删除指定的依赖节点
   * @param source
   */
  deleteNode(source) {
    const sourceNode = this.getDepNode(source);
    if (!sourceNode)
      return false;
    this.DepNodeIndexes.delete(source);
    if (sourceNode.come.size) {
      sourceNode.come.forEach((comeNode) => {
        comeNode.out.delete(sourceNode);
        if (!comeNode.out.size) {
          this.deleteNode(comeNode.path);
        }
      });
    }
    return true;
  }
  /**
   * 遍历所有直接或者间接依赖 source 的节点
   * @param source 要遍历的节点
   * @param cb 对每个节点的处理
   * @param tracked 用于存储遍历过的节点
   * @param wait 用于存储需要遍历的节点
   * @param order 是否按照顺序开始遍历
   */
  traverse(source, cb, tracked = /* @__PURE__ */ new Set(), wait = /* @__PURE__ */ new Set(), order = true) {
    const isAllDepsTracked = (node) => Array.from(node.come).every((dep) => !wait.has(dep.path) || tracked.has(dep.path));
    const traverse2 = (node, order2 = false, cb_) => {
      if (!order2) {
        wait.add(node.path);
      } else {
        if (!isAllDepsTracked(node))
          return;
        tracked.add(node.path);
        cb_ == null ? void 0 : cb_(node, tracked.size, wait.size);
      }
      node.out.forEach((child) => {
        if (!order2 || isAllDepsTracked(child)) {
          traverse2(child, order2, cb_);
        }
      });
    };
    const sourceNode = this.getDepNode(source);
    if (!sourceNode)
      return;
    traverse2(sourceNode, false, cb);
    if (order) {
      traverse2(sourceNode, true, cb);
    }
  }
  /**
   * 批量遍历直接或者间接 sources 节点的所有节点
   * @param sources 被依赖的节点数组
   * @param cb 对每个节点的处理
   */
  batchTraverse(sources, cb) {
    const tracked = /* @__PURE__ */ new Set();
    const wait = /* @__PURE__ */ new Set();
    sources.forEach((source) => {
      this.traverse(source, cb, tracked, wait, false);
    });
    sources.forEach((source) => {
      this.traverse(source, cb, tracked, wait, true);
    });
    return Array.from(tracked);
  }
}
const fs = new FilesSystem();
const fsSyncPromise = initIframeFilesSyncService(fs);
const depsGraph = new DepsGraph();
const manager = createAmdManager(fs, void 0, void 0, logger);
manager.mountToGlobal();
const style = document.createElement("style");
document.head.appendChild(style);
manager.onModuleLoading(iframeLoadingModule);
manager.onModuleDeps(depsGraph.updatePaths.bind(depsGraph));
fs.event.listen("files-change", async (type, files) => {
  if (type === FilesChangeType.Change) {
    console.log("files change", files);
    depsGraph.batchTraverse(files, (node) => {
      console.log("update dep", node.path);
      manager.require_.factories.delete(node.path);
      manager.require_.cache.delete(node.path);
      if (node.out.size) {
        manager.require_(node.path);
      }
    });
  }
});
registerProxy(DemoServiceName, {
  run: async (jsEntry, htmlEntry, stylesEntry) => {
    await fsSyncPromise;
    if (typeof htmlEntry === "string") {
      const [htmlExist, html] = fs.pathReduce(htmlEntry);
      if (!htmlExist)
        return false;
      document.body.innerHTML = html.content;
    }
    if (typeof stylesEntry === "string") {
      const [stylesExist, styles] = fs.pathReduce(stylesEntry);
      if (!stylesExist)
        return false;
      style.innerHTML = styles.content;
    }
    if (typeof jsEntry === "string") {
      const [jsExist] = fs.pathReduce(jsEntry);
      if (!jsExist)
        return false;
      await manager.require_(jsEntry);
    }
    return true;
  },
  setPlugins: async (pluginIds) => {
    const plugins = generatePlugins(pluginIds);
    manager.setPlugins(plugins);
  }
});
window.onerror = (err) => {
  console.error(err);
};
iframeReady();
//# sourceMappingURL=iframe.js.map
