import { registerProxy } from '../core/proxy';
import { createAmdManager } from '../core/amd';
import { DemoServiceName, IDemoService } from '../type';
import { iframeReady, iframeLoadingModule } from '../utils/iframe';
import logger from '../utils/logger';

// 创建一个 AMD 上下文
const manager = createAmdManager(undefined, undefined, logger);
manager.mountToGlobal();
const style = document.createElement('style');
document.head.appendChild(style);

// 监听包管理器加载模块，并通知外部容器
manager.onModuleLoading(iframeLoadingModule);

// 注册一个服务，接受远程的消息更新代码
registerProxy<IDemoService>(DemoServiceName, {
    defineModule: async (name, deps, factory) => {
        manager.define(name, deps, factory);
        return true;
    },
    executeModule: async (name) => {
        await manager.require_(name);
        return true;
    },
    setStyle: async (code) => {
        style.innerHTML = code;
        return true;
    }
});

window.onerror = err => {
    console.error(err);
};

iframeReady();
