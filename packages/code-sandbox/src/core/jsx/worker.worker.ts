import { registerProxy } from '../proxy';
import { transformJsxComponentCode } from './compile';
import { ServiceName } from './types';

registerProxy(ServiceName, {
    async transformJsxComponentCode(code: string) {
        const [deps, res] = await transformJsxComponentCode(code);
        return { deps, code: res };
    }
});
