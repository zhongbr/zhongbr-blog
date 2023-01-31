class BasePlugin {
  constructor() {
    this.pluginId = "base";
  }
  async resolveModuleUrl(meta) {
    return meta;
  }
  async require(ctx, modules) {
    return modules;
  }
  async beforeModuleGenerate(ctx, meta) {
    return meta;
  }
}
export {
  BasePlugin as B
};
//# sourceMappingURL=types-9fd137f3.js.map
