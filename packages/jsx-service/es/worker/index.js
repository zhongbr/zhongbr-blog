var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JsxCodeTransformHandler } from '../jsx-core/index.js';
import { EventTypeEnum, Event } from '../types/worker.js';
const handlers = new Map([
    [EventTypeEnum.JsxCodeTransform, JsxCodeTransformHandler]
]);
export const startJsxServiceWorker = () => {
    console.log('-------------🚀 jsx service worker started --------------');
    onmessage = function (e) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('---------- receive message -----------');
            console.log(e);
            const event = new Event(e.data);
            event.reply(yield ((_a = handlers.get(event.EventType)) === null || _a === void 0 ? void 0 : _a(event)));
        });
    };
};
//# sourceMappingURL=index.js.map