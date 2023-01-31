import { BasePlugin } from "../types";
declare class JsxPlugin extends BasePlugin {
    constructor();
    beforeModuleGenerate(ctx: any, meta: any): Promise<any>;
}
declare class EsmToAmdPlugin extends BasePlugin {
    constructor();
    beforeModuleGenerate(ctx: any, meta: any): Promise<any>;
}
export { EsmToAmdPlugin, JsxPlugin };
