import { B as BasePlugin } from "../../types-9fd137f3.js";
class ReactPolyfill extends BasePlugin {
  constructor() {
    super();
    this.pluginId = "react-polyfill";
  }
  async resolveModuleUrl(meta) {
    const { packageName } = meta;
    if (packageName.toLowerCase() === "react") {
      meta.packageName = "react";
      meta.file = "/umd/react.production.min.js";
    }
    if (packageName.toLowerCase().replace(/\W/g, "") === "reactdom") {
      meta.packageName = "react-dom";
      meta.file = "/umd/react-dom.production.min.js";
    }
    return meta;
  }
}
export {
  ReactPolyfill
};
//# sourceMappingURL=index.js.map
