import {createEventSubscribeManager} from "../event";
import path, {PathObject} from "path-browserify";

export interface IFile {
    name: string;
    content: string;
}

export interface IDirectory {
    name: string;
    children: Map<string, IDirectory | IFile>;
}

export type EventTypes = 'transfer' | 'dir-set' | 'dir-delete' | 'dir-clear' | 'files-change';
export enum FilesChangeType {
    Delete = 'delete',
    Change = 'change',
    New = 'new'
}

const getPathFileName = (pathObject: PathObject) => `${pathObject.name}${pathObject.ext}`;

const traverse = (dir = '', directory: IDirectory, cb: (path: string, item: IFile) => void) => {
    directory.children.forEach((item) => {
        if (Reflect.has(item, 'children')) {
            traverse(`${path}/${item.name}`, item as IDirectory, cb);
            return;
        }
        cb(`${path}/${item.name}`, item as IFile);
    });
};

export class FilesSystem {
    private root: IDirectory = {
        name: '',
        children: this.getProxyMap('', [])
    };
    // 保证同步消息执行顺序的 id
    private eventCount: number = 0;
    public event = createEventSubscribeManager<EventTypes>();

    private getProxyMap(path: string, entries) {
        const _this = this;
        const map: IDirectory['children'] = new Map(entries);

        const proxyMethod = (methodName: keyof typeof map, eventName: EventTypes) => {
            const _method = Reflect.get(map, methodName);
            if (typeof _method === 'function') {
                const method = function (...args) {
                    _this.event.trigger(eventName, _this.eventCount++, path, ...args);
                    return _method.call(map, ...args);
                }
                Reflect.set(map, methodName, method);
            }
        };

        // 可以改变 Map 值的方法，通知外部
        proxyMethod('set', 'dir-set');
        proxyMethod('delete', 'dir-delete');
        proxyMethod('clear', 'dir-clear');

        return map;
    }

    public pathReduce(target: string) {
        const paths = target.split(path.sep);
        return paths.reduce(([status, dir], cur, index, arr) => {
            if (index === 0) {
                return [status, dir] as const;
            }
            // 如果最后一个路径是空串，说明路径是 / 结尾，忽略
            if (index === arr.length - 1 && cur === '') {
                return [status, dir]  as const;
            }
            return [status && dir.children?.has(cur), dir.children?.get(cur)] as const;
        }, [true, this.root] as const);
    }

    public exist(target) {
        const [exist] = this.pathReduce(target);
        return exist;
    }

    public mkdir(target: string) {
        const pathObject = path.parse(target);
        if (this.exist(target)) {
            throw new Error(`[fs] failed to mkdir ${target}, it is already existed.`);
        }
        const [parentExist, parent] = this.pathReduce(pathObject.dir);
        if (!parentExist) {
            throw new Error(`[fs] failed to mkdir ${target}, parent path ${pathObject.dir} is not existed.`);
        }
        if (!Reflect.has(parent, 'children') || Reflect.has(parent, 'content')) {
            throw new Error(`[fs] failed to mkdir ${target}, parent path ${pathObject.dir} is not a directory.`);
        }
        (parent as IDirectory).children.set(getPathFileName(pathObject), {
            name: getPathFileName(pathObject),
            children: this.getProxyMap(path.format(pathObject), []),
        });
    }

    public readDirectory(target: string) {
        const pathObject = path.parse(target);
        const [parentExist, parent] = this.pathReduce(pathObject.dir);
        if (!parentExist) {
            throw new Error(`[fs] failed to read directory ${target}, parent path ${pathObject.dir} is not existed.`);
        }
        return (parent as IDirectory).children.get(getPathFileName(pathObject));
    }

    public readFile(target: string) {
        const [exist, file] = this.pathReduce(target);
        if (!exist) {
            throw new Error(`[fs] failed to read file ${target}, it is not existed.`);
        }
        if (Reflect.has(file, 'children')) {
            throw new Error(`[fs] failed to read file ${target}, it is a directory.`);
        }
        return file as IFile;
    }

    public writeFile(target: string, contents: ArrayBuffer | string) {
        const pathObject = path.parse(target);
        const [parentExist, parent] = this.pathReduce(pathObject.dir);
        if (!parentExist) {
            throw new Error(`[fs] failed to write file ${target}, parent path ${pathObject.dir} is not existed.`);
        }
        let writeContent = contents as string;
        if (typeof contents !== 'string') {
            writeContent = btoa(String.fromCharCode.apply(null, new Uint8Array(contents)));
        }
        const existBefore = (parent as IDirectory).children.has(getPathFileName(pathObject));
        (parent as IDirectory).children.set(getPathFileName(pathObject), {
            name: getPathFileName(pathObject),
            content: writeContent,
        });
        this.event.trigger('files-change', this.eventCount++, existBefore ? FilesChangeType.Change : FilesChangeType.New, [target]);
    }

    private cpOrMv(isMv: boolean = false, source: string, target: string) {
        const sourcePathObject = path.parse(source);
        const targetPathObject = path.parse(target);
        const [sourceParentExist, sourceParent] = this.pathReduce(sourcePathObject.dir);
        const [targetParentExist, targetParent] = this.pathReduce(targetPathObject.dir);
        if (!sourceParentExist || !targetParentExist) {
            throw new Error(`[fs] failed to ${isMv ? 'mv' : 'cp'} ${source} to ${target}, source or target path is not existed.`);
        }
        if ((targetParent as IDirectory).children.has(getPathFileName(targetPathObject))) {
            throw new Error(`[fs] failed to ${isMv ? 'mv' : 'cp'} ${source} to ${target}, target path is already existed.`);
        }
        (targetParent as IDirectory).children.set(getPathFileName(targetPathObject), (sourceParent as IDirectory).children.get(getPathFileName(sourcePathObject)));

        const sourceFileOrDirectory = (sourceParent as IDirectory).children.get(source);
        const deletedFiles = [];
        const newFiles = [];
        if (Reflect.has(sourceFileOrDirectory, 'content')) {
            deletedFiles.push(source);
            newFiles.push(target);
        }
        else {
            traverse(undefined, sourceFileOrDirectory as IDirectory, (path_) => {
                deletedFiles.push(path.join(sourcePathObject.dir, path_));
                newFiles.push(path.join(targetPathObject.dir, path_));
            });
        }

        if (isMv) {
            (sourceParent as IDirectory).children.delete(getPathFileName(sourcePathObject));
            this.event.trigger('files-change', this.eventCount++, FilesChangeType.Delete, deletedFiles);
        }

        this.event.trigger('files-change', this.eventCount++, FilesChangeType.New, newFiles);
    }

    public cp: (source: string, target: string) => void = this.cpOrMv.bind(this, false);

    public mv: (source: string, target: string) => void = this.cpOrMv.bind(this, true);

    public rm(target: string) {
        const pathObject = path.parse(target);
        const [parentExist, parent] = this.pathReduce(pathObject.dir);
        if (!parentExist || !(parent as IDirectory).children.has(getPathFileName(pathObject))) {
            throw new Error(`[fs] failed to rm ${target}, it is not existed.`);
        }

        const targetFileOrDirectory = (parent as IDirectory).children.get(target);
        const deletedFiles = [];
        if (Reflect.has(targetFileOrDirectory, 'content')) {
            deletedFiles.push(target);
        }
        else {
            traverse(undefined, targetFileOrDirectory as IDirectory, (path_) => {
                deletedFiles.push(path.join(pathObject.dir, path_));
            });
        }

        (parent as IDirectory).children.delete(getPathFileName(pathObject));
        this.event.trigger('files-change', this.eventCount++, FilesChangeType.Delete, deletedFiles);
    }

    /**
     * 序列化内部存储的所有数据
     */
    public getDataPayload() {
        return JSON.stringify(this.root, (key, value) => {
            if (value instanceof Map) {
                return {
                    __dataType: 'Map',
                    entries: Array.from(value.entries())
                };
            }
            return value;
        });
    }

    /**
     * 触发将文件对象存储的数据传输到远端的事件
     */
    public transfer() {
        const payload = this.getDataPayload();
        this.event.trigger('transfer', this.eventCount++, '', payload);
    }

    /**
     * 接收外部设置的数据
     * @param payload 底层数据
     */
    public receive(payload: string) {
        // 遍历所有文件，设置监听目录变化
        const traverse = (obj, path = '') => {
            if (obj.children && Reflect.get(obj.children, '__dataType') === 'Map') {
                const entries = obj.children.entries.forEach(([key, value]) => [key, traverse(value, [path, key].join('/'))]);
                return {
                    ...obj,
                    children: this.getProxyMap(path, entries)
                };
            }
            return obj;
        };
        this.root = traverse(JSON.parse(payload));
    }

}
