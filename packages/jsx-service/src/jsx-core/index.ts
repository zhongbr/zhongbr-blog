import { Handler, IJsxCodeTransformResp, IJsxCodeTransformParams } from '../types/worker';
import { transformJsxComponentCode } from './compile.js';

export const JsxCodeTransformHandler: Handler<IJsxCodeTransformParams, IJsxCodeTransformResp> = async event => {
    const { code } = event.params;
    const [deps, res] = await transformJsxComponentCode(code);
    return {
        deps,
        code: res
    };
}
