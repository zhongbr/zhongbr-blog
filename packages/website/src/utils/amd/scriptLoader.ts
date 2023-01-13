import logger from '@/utils/logger';
import { IAmdModuleManagerContext, IScriptLoader, IScriptLoadTask } from './types';

export default function bindScriptLoaderToCtx(ctx: IAmdModuleManagerContext) {
    let loadingModuleName = '';
    const scriptLoadingTasks: IScriptLoader['scriptLoadingTasks'] = [];
    const loadScript = async (dom: HTMLElement, url: string, moduleName = 'globalObj') => {
        // 由于有可能存在匿名模块，为了能区分开这些模块，一次只能加载一个脚本
        if (loadingModuleName) {
            await new Promise(resolve => {
                (resolve as IScriptLoadTask).moduleName = moduleName;
                scriptLoadingTasks.push(resolve as IScriptLoadTask);
            });
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            // 设置一个超时时间
            const timeout = setTimeout(() => {
                    logger.log('[amd] script load timeout ' + moduleName);
                    reject(new Error(`load module ${moduleName} timeout`));
                    // 加载下一个脚本
                    scriptLoadingTasks.shift()?.();
                }, ctx.scriptTimeout);

            script.onload = () => {
                logger.log('[amd] script resolved', loadingModuleName);
                clearTimeout(timeout);
                resolve(null);
                loadingModuleName = '';
                // 加载下一个脚本
                scriptLoadingTasks.shift()?.();
            }

            script.onerror = (err) => {
                logger.log('[amd] script rejected', loadingModuleName);
                clearTimeout(timeout);
                reject(err);
                loadingModuleName = '';
                // 加载下一个脚本
                scriptLoadingTasks.shift()?.();
            }

            script.crossOrigin = 'anonymous';
            script.src = url;
            script.type = 'text/javascript';

            logger.log('[amd] start load script', moduleName);
            loadingModuleName = moduleName;
            dom.appendChild(script);
        });
    }

    ctx.scriptLoader = {
        getLoadingModuleName: () => loadingModuleName,
        loadScript,
        scriptLoadingTasks,
    };
}
