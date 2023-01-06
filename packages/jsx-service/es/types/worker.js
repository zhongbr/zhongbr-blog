export var EventTypeEnum;
(function (EventTypeEnum) {
    EventTypeEnum[EventTypeEnum["JsxCodeTransform"] = 1] = "JsxCodeTransform";
})(EventTypeEnum || (EventTypeEnum = {}));
let eventId = 0;
export class Event {
    constructor(params) {
        this.EventId = params.EventId || (`${eventId++ + Math.random()}`.replace(/\D/, ''));
        this.EventType = params.EventType;
        this.params = params.params;
    }
    toJSON() {
        return {
            EventId: this.EventId,
            EventType: this.EventType,
            params: this.params
        };
    }
    reply(params) {
        postMessage(new Event({
            params,
            EventType: this.EventType,
            EventId: this.EventId
        }));
    }
}
//# sourceMappingURL=worker.js.map