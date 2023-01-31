import { BasePlugin } from '../types';

export class UnpkgPlugin extends BasePlugin {
    async resolveModuleUrl(meta) {
        const { packageName, file, version } = meta;
        const versionSuffix = version ? `@${version}` : '';
        const fileSuffix = file ? `${file}` : '';
        // `return false` to cancel auto require deps.
        return `https://unpkg.com/${packageName}${versionSuffix}${fileSuffix}`;
    }
}

export class JsdelivrPlugin extends BasePlugin {
    async resolveModuleUrl(meta) {
        const { packageName, file, version } = meta;
        const versionSuffix = version ? `@${version}` : '';
        const fileSuffix = file ? `${file}` : '';
        // `return false` to cancel auto require deps.
        return `https://cdn.jsdelivr.net/npm/${packageName}${versionSuffix}${fileSuffix}`;
    }
}
