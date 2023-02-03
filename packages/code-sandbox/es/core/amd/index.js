import { p as pathBrowserify } from "../../index-a3b3cc38.js";
import { createEventSubscribeManager } from "../event/index.js";
function bindScriptLoaderToCtx(ctx2) {
  let loadingModuleName = "";
  const scriptLoadingTasks = [];
  const loadScript = async (dom, url, moduleName2 = "globalObj") => {
    if (loadingModuleName) {
      await new Promise((resolve2) => {
        resolve2.moduleName = moduleName2;
        scriptLoadingTasks.push(resolve2);
      });
    }
    return new Promise((resolve2, reject) => {
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
        resolve2(null);
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
      return await new Promise((resolve2, reject) => {
        const tasks = moduleRequiringTasks.get(modulePath);
        tasks.push([resolve2, reject]);
        ctx.logger.log(`[amd] require ${moduleName}, already has task requiring, waiting tasks: ${tasks.length}.`);
      });
    }
    ctx.logger.log("[amd] start require", modulePath);
    moduleRequiringTasks.set(modulePath, []);
    const clearAllTasks = (err, module_2) => {
      const tasks = moduleRequiringTasks.get(modulePath);
      if (tasks == null ? void 0 : tasks.length) {
        tasks.forEach(([resolve2, reject], index) => {
          ctx.logger.log("[amd] resolve item", index, moduleName);
          if (err) {
            reject(err);
          }
          resolve2(module_2);
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
function createAmdManager(fs, root = "/", scriptTimeout = 1e4, logger = console) {
  const ctx2 = {};
  ctx2.eventSubscribeManager = createEventSubscribeManager();
  ctx2.fs = fs;
  ctx2.root = root;
  ctx2.scriptTimeout = scriptTimeout;
  ctx2.logger = logger;
  ctx2.plugins = [];
  ctx2.pluginReduce = async (reducer, initValue) => {
    let result = initValue;
    for (const plugin of ctx2.plugins) {
      console.log("run plugin", plugin);
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
export {
  createAmdManager
};
//# sourceMappingURL=index.js.map
