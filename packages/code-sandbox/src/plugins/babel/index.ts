import service from './worker';
import { BasePlugin } from "../types";

class JsxPlugin extends BasePlugin {
    constructor() {
        super();
        this.pluginId = 'code-sandbox-jsx-plugin';
    }

    async beforeModuleGenerate(ctx, meta) {
        meta.factory = service.jsx(meta.factory);
        return meta;
    }
}

class EsmToAmdPlugin extends BasePlugin {
    constructor() {
        super();
        this.pluginId = 'code-sandbox-esm-to-amd-plugin';
    }

    async beforeModuleGenerate(ctx, meta) {
        const [code] = await service.esm2Amd(meta.factory);
        meta.factory = code;
        return meta;
    }
}

export { EsmToAmdPlugin, JsxPlugin };
