export enum IMessageType {
    Refresh = 'refresh',
    IFrameReady = 'iframe-ready',
    DefineModule = 'define-module',
    RunModule = 'run-module',
    Reply = 'reply',
    Error = 'error',
    LoadingModule = 'load-module'
}

export interface IEvent {
    type: IMessageType;
    payload?: unknown[];
    id: string;
}
