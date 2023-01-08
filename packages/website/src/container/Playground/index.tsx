import React, { useLayoutEffect, useState, useRef, useMemo } from 'react';
import clsx from 'clsx';

import { ResponsiveEnum, usePageConfig, useAsyncEffect, useAsyncFn } from '@/hooks';
import { JsxDemoDisplay, Icon, Splash, ErrorDisplay } from '@/components';
import { createAmdManager, IAmdManager, IModule } from '@/utils/amd';

import { DefaultDemoCode, DefaultDepsCode } from './template';
import { Editor } from './modules';
import styles from './style.module.less';

let playgroundId = 0;

const Playground: React.FC = () => {
    const { onPageReady, setStates, widthLevel } = usePageConfig();
    const [code, setCode] = useState('');

    const [depCode, setDepCode] = useState(DefaultDepsCode);
    const [depsError, setDepsError] = useState<Error>();

    const moduleName = useMemo(() => `PlaygroundDeps${playgroundId++}`, []);

    // 预览环境使用的 Amd 模块管理的实例
    const moduleManagerRef = useRef<IAmdManager>();
    if (!moduleManagerRef.current) {
        moduleManagerRef.current = createAmdManager();
        // 将包管理器声明到内部
        moduleManagerRef.current?.define('module-manager', async () => {
            return { ...moduleManagerRef.current, 'default': moduleManagerRef.current };
        });
    }

    // 刷新依赖代码
    const [onRefreshDeps, depsValid, loading] = useAsyncFn(async () => {
        // 把依赖代码也声明成一个模块，然后立即导入执行
        moduleManagerRef.current?.define(moduleName, depCode);
        // 导入依赖模块，校验 default 是否是 'module-valid'，判断代码是否正常
        try {
            const module_ = await moduleManagerRef.current?._require(moduleName) as IModule;
            return module_?.['default'] === 'module-valid';
        } catch (e) {
            setDepsError(e as Error);
        }
    });

    // 保存代码，区分是依赖导入还是 demo 代码
    const onCodeSave = (code: string, index: number) => {
        switch (index) {
            case 1: {
                setCode(code);
                break;
            }
            case 0: {
                setDepCode(code);
                break;
            }
        }
    };

    // 如果依赖发生变化，就刷新依赖
    useAsyncEffect(async () => {
        await onRefreshDeps();
    }, [depCode]);

    // 设置页面标题等信息
    useLayoutEffect(() => {
        setStates?.({
            title: 'React Playground 🚀',
            footer: {
                showICP: true,
                showPublicSecurity: true,
                showCopyRight: true
            }
        });
        onPageReady?.();
    }, [setStates, onPageReady]);

    return (
        <div className={clsx(styles.playground, widthLevel === ResponsiveEnum.tiny ? styles.tiny : undefined)}>
            <Editor
                className={styles.editor}
                onSave={onCodeSave}
                defaultValues={[DefaultDepsCode, DefaultDemoCode]}
                tabsName={['Dependencies', 'Demo']}
                saveDisabled={index => index === 1 && (!depsValid || loading)}
            />
            <div className={styles.display}>
                {(() => {
                    if (loading) return <Splash texts="🚀依赖加载中..."/>;
                    if (!depsValid) return (
                        <div className={styles.depsInvalid}>
                            <span>❌ 依赖解析出错了哦</span>
                            <ErrorDisplay error={depsError}/>
                        </div>
                    );
                    if (code) return (
                        <JsxDemoDisplay
                            jsx={code}
                            moduleManagerRef={moduleManagerRef}
                        />
                    );
                    return (
                        <div>
                            <h3>
                                <Icon className="rp-jiaoxue"/>
                                <span style={{ marginLeft: '8px' }}>React JSX Playground</span>
                            </h3>
                            <p>在左侧的代码块内输入 React JSX 代码，将要渲染的组件 default 导出，点击保存即可预览效果</p>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

Playground.displayName = 'Playground';
export default Playground;
