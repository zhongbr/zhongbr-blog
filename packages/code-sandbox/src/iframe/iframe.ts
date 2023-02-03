import { registerProxy } from '../core/proxy';
import { createAmdManager } from '../core/amd';
import { FilesSystem, initIframeFilesSyncService } from '../core/files-system';
import { DemoServiceName, IDemoService } from '../type';
import { iframeReady, iframeLoadingModule } from '../utils/iframe';
import logger from '../utils/logger';
import { generatePlugins } from './generatePlugins';
import { FilesChangeType, IFile } from "../core/files-system/types";
import DepsGraph from "../core/dep-graph";

// 创建一个 files system
const fs = new FilesSystem();
// 保持 FS 和外部页面的同步
initIframeFilesSyncService(fs);

// 模块依赖关系图
const depsGraph = new DepsGraph();

// 创建一个 AMD 上下文
const manager = createAmdManager(fs,undefined, undefined, logger);
manager.mountToGlobal();
const style = document.createElement('style');
document.head.appendChild(style);

// 监听包管理器加载模块，并通知外部容器
manager.onModuleLoading(iframeLoadingModule);

// 监听包之间的 require ，确定依赖关系图
manager.onModuleDeps(depsGraph.updatePaths.bind(depsGraph));

fs.event.listen('files-change', async (type: FilesChangeType, files: string[]) => {
    // 监听到文件发生变化时，批量更新发生变化的文件的模块
    if (type === FilesChangeType.Change) {
        // 批量更新依赖
        depsGraph.batchTraverse(files, (node) => {
            // 把包管理器里的缓存删掉，下次 require 时就会重新执行代码
            manager.require_.factories.delete(node.path);
            manager.require_.cache.delete(node.path);
            // 如果 node 没有后续节点依赖，就运行一下 require
            if (node.out.size) {
                manager.require_(node.path);
            }
        });
    }
});

// 注册一个服务，接受远程的消息更新代码
registerProxy<IDemoService>(DemoServiceName, {
    run: async (jsEntry, htmlEntry, stylesEntry) => {
        // 设置 html、css
        if (htmlEntry) {
            const [htmlExist, html] = fs.pathReduce(htmlEntry);
            if (!htmlExist) return false;
            document.body.innerHTML = (html as IFile).content;
        }
        if (stylesEntry) {
            const [stylesExist, styles] = fs.pathReduce(stylesEntry);
            if (!stylesExist) return false;
            style.innerHTML = (styles as IFile).content;
        }
        // 执行 js 入口
        const [jsExist] = fs.pathReduce(jsEntry);
        if (!jsExist) return false;
        await manager.require_(jsEntry);
        return true;
    },
    setPlugins: async (pluginIds: string[]) => {
        const plugins = generatePlugins(pluginIds);
        manager.setPlugins(plugins);
    }
});

window.onerror = err => {
    console.error(err);
};

iframeReady();
