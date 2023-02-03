export interface IFile {
    name: string;
    content: string;
}
export interface IDirectory {
    name: string;
    children: Map<string, IDirectory | IFile>;
}
export declare type EventTypes = 'transfer' | 'dir-set' | 'dir-delete' | 'dir-clear' | 'files-change';
export declare enum FilesChangeType {
    Delete = "delete",
    Change = "change",
    New = "new"
}
export declare class FilesSystem {
    private root;
    private eventCount;
    event: {
        trigger: (key: EventTypes, ...params: unknown[]) => void;
        listen: (key: EventTypes, cb: import("../event").Handler, filter?: (...params: unknown[]) => boolean) => () => void;
        once: (key: EventTypes, cb: import("../event").Handler, filter?: (...params: unknown[]) => boolean, onTimeout?: () => void, timeout?: number) => () => void;
    };
    private getProxyMap;
    pathReduce(target: string): readonly [boolean, IDirectory | IFile];
    exist(target: any): boolean;
    mkdir(target: string): void;
    readDirectory(target: string): IDirectory | IFile;
    readFile(target: string): IFile;
    writeFile(target: string, contents: ArrayBuffer | string): void;
    private cpOrMv;
    cp: (source: string, target: string) => void;
    mv: (source: string, target: string) => void;
    rm(target: string): void;
    /**
     * 序列化内部存储的所有数据
     */
    getDataPayload(): string;
    /**
     * 触发将文件对象存储的数据传输到远端的事件
     */
    transfer(): void;
    /**
     * 接收外部设置的数据
     * @param payload 底层数据
     */
    receive(payload: string): void;
}
