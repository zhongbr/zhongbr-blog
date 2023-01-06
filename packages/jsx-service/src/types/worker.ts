import {IImportDependencies} from "../jsx-core/compile";

export enum EventTypeEnum {
    JsxCodeTransform = 1
}

export interface IEvent<P=unknown> {
    EventId?: string;
    EventType: EventTypeEnum;
    params: P;
}

export interface IJsxCodeTransformParams {
    code: string;
}

export interface IJsxCodeTransformResp {
    deps: IImportDependencies[];
    code: string;
}

let eventId = 0;

export class Event<P = unknown> implements IEvent {
    public EventId: string;
    public EventType: EventTypeEnum;
    public params: P;

    constructor(params: IEvent) {
        this.EventId = params.EventId || (`${eventId++ + Math.random()}`.replace(/\D/, ''));
        this.EventType = params.EventType;
        this.params = params.params as P;
    }

    public toJSON() {
        return {
            EventId: this.EventId,
            EventType: this.EventType,
            params: this.params
        };
    }

    public reply(params: unknown) {
        postMessage(new Event({
            params,
            EventType: this.EventType,
            EventId: this.EventId
        }));
    }
}

export type Handler<P = any, R = any> = (event: Event<P>) => Promise<R>;
