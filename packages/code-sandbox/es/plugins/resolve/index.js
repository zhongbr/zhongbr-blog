import { B as BasePlugin } from "../../types-9fd137f3.js";
class UnpkgPlugin extends BasePlugin {
  async resolveModuleUrl(meta) {
    const { packageName, file, version } = meta;
    const versionSuffix = version ? `@${version}` : "";
    const fileSuffix = file ? `${file}` : "";
    return `https://unpkg.com/${packageName}${versionSuffix}${fileSuffix}`;
  }
}
class JsdelivrPlugin extends BasePlugin {
  async resolveModuleUrl(meta) {
    const { packageName, file, version } = meta;
    const versionSuffix = version ? `@${version}` : "";
    const fileSuffix = file ? `${file}` : "";
    return `https://cdn.jsdelivr.net/npm/${packageName}${versionSuffix}${fileSuffix}`;
  }
}
export {
  JsdelivrPlugin,
  UnpkgPlugin
};
//# sourceMappingURL=index.js.map
