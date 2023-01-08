import React, { useRef, useLayoutEffect } from 'react';
import { editor, KeyCode, KeyMod, languages } from 'monaco-editor';
import clsx from 'clsx';

import { Icon } from '@/components';
import { usePersistFn, usePageConfig } from '@/hooks';

import styles from './style.module.less';

languages.typescript.typescriptDefaults.setCompilerOptions({
    target: languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: languages.typescript.ModuleResolutionKind.NodeJs,
    module: languages.typescript.ModuleKind.ES2015,
    noEmit: true,
    esModuleInterop: true,
    jsx: languages.typescript.JsxEmit.React,
    reactNamespace: 'React',
    allowJs: true,
    typeRoots: ['node_modules/@types'],
});

export interface IProps {
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSave?: (value: string) => void;
    className?: string;
    style?: React.CSSProperties;
}

const Editor: React.FC<IProps> = (props) => {
    const { defaultValue, value, onChange: _onChange = () => {}, onSave: _onSave = () => {}, className, style } = props;
    const ref = useRef<HTMLDivElement>(null);
    const editorInst = useRef<editor.IStandaloneCodeEditor>();

    const { theme } = usePageConfig();

    const onChange = usePersistFn(_onChange);
    const onSave = usePersistFn(_onSave);

    useLayoutEffect(() => {
        if (!ref.current) {
            return;
        }

        const editor_ = editor.create(ref.current, {
            language: 'typescript',
            automaticLayout: true
        });

        editorInst.current = editor_;

        editor_.setValue(defaultValue || '');

        editor_.onDidChangeModelContent(() => {
            onChange?.(editor_.getValue());
        });

        editor_.addAction({
            id: 'playground-save-action',
            label: '保存',
            keybindings: [
                KeyMod.Alt | KeyCode.KeyS
            ],
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 1.5,
            run: () => {
                onSave(editorInst.current?.getValue() || '');
            }
        });

        return () => {
            editor_.dispose();
        };
    }, [onChange, onSave, defaultValue]);

    const onClickSave = () => {
        onSave?.(editorInst.current?.getValue() || '');
    };

    useLayoutEffect(() => {
        if (!value) {
            return;
        }
        editorInst.current?.setValue(value);
    }, [value]);

    useLayoutEffect(() => {
        editorInst.current?.updateOptions({
            theme: theme === 'dark-theme' ? 'vs-dark' : 'vs'
        });
    }, [theme]);

    return (
        <div className={clsx(className, styles.container)}>
            <div className={styles.operations}>
                <div className={styles.item} onClick={onClickSave}>
                    <Icon className="rp-baogao"/>
                    <span>保存</span>
                </div>
            </div>
            <div
                ref={ref}
                className={styles.editor}
                style={style}
            />
        </div>
    );
};

Editor.displayName = 'Editor';
export default Editor;
