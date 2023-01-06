import { IImportDependencies } from "../jsx-core/compile";
export declare enum EventTypeEnum {
    JsxCodeTransform = 1
}
export interface IEvent<P = unknown> {
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
export declare class Event<P = unknown> implements IEvent {
    EventId: string;
    EventType: EventTypeEnum;
    params: P;
    constructor(params: IEvent);
    toJSON(): {
        EventId: string;
        EventType: EventTypeEnum;
        params: P;
    };
    reply(params: unknown): void;
}
export type Handler<P = any, R = any> = (event: Event<P>) => Promise<R>;
