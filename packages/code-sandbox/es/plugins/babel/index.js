import { callProxy } from "../../core/proxy/index.js";
import { B as BasePlugin } from "../../types-9fd137f3.js";
const BabelServiceId = "code-sandbox-babel-service";
let worker;
const serviceKeys = ["jsx", "esm2Amd"];
const service = serviceKeys.reduce((previousValue, currentValue) => {
  return {
    ...previousValue,
    [currentValue]: async (...args) => {
      if (!worker) {
        const BabelWorker = await import("../../worker-7673604a.js");
        worker = new BabelWorker.default();
      }
      return await callProxy({
        win: worker,
        serviceId: BabelServiceId,
        method: currentValue,
        payload: args
      });
    }
  };
}, {});
class JsxPlugin extends BasePlugin {
  constructor() {
    super();
    this.pluginId = "code-sandbox-jsx-plugin";
  }
  async beforeModuleGenerate(ctx, meta) {
    meta.factory = await service.jsx(meta.factory);
    return meta;
  }
}
class EsmToAmdPlugin extends BasePlugin {
  constructor() {
    super();
    this.pluginId = "code-sandbox-esm-to-amd-plugin";
  }
  async beforeModuleGenerate(ctx, meta) {
    const [code] = await service.esm2Amd(meta.factory);
    meta.factory = code;
    return meta;
  }
}
export {
  EsmToAmdPlugin,
  JsxPlugin
};
//# sourceMappingURL=index.js.map
