import { IAmdModuleManagerContext, IScriptLoader, IScriptLoadTask } from './types';

let loadingModuleName = '';
const scriptLoadingTasks: IScriptLoader['scriptLoadingTasks'] = [];

export default function bindScriptLoaderToCtx(ctx: IAmdModuleManagerContext) {
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
            script.onload = () => {
                resolve(null);
                console.log('script resolved', loadingModuleName);
                loadingModuleName = '';
                // 加载下一个脚本
                scriptLoadingTasks.shift()?.();
            }

            script.onerror = (err) => {
                reject(err);
                console.log('script rejected', loadingModuleName);
                loadingModuleName = '';
                // 加载下一个脚本
                scriptLoadingTasks.shift()?.();
            }

            // 设置一个超时时间
            setTimeout(() => {
                reject(new Error(`load module ${moduleName} timeout`));
                // 加载下一个脚本
                scriptLoadingTasks.shift()?.();
            }, ctx.scriptTimeout);

            script.crossOrigin = 'anonymous';
            script.src = url;
            script.type = 'text/javascript';

            console.log('start load script', moduleName);
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
