import React, { useRef, useLayoutEffect, useState } from 'react';
import { editor, KeyCode, KeyMod, languages } from 'monaco-editor';
import clsx from 'clsx';

import { Icon } from '@/components';
import { usePersistFn, usePageConfig } from '@/hooks';

import styles from './style.module.less';
import createModel = editor.createModel;

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
    defaultValues?: string[];
    values?: string[];
    tabsName?: string[];
    onChange?: (value: string, index: number) => void;
    onSave?: (value: string, index: number) => void;
    className?: string;
    style?: React.CSSProperties;
    saveDisabled?: (index: number) => boolean;
}

const Editor: React.FC<IProps> = (props) => {
    const { defaultValues, values, tabsName, onChange: _onChange = () => {}, onSave: _onSave = () => {}, saveDisabled, className, style } = props;
    const ref = useRef<HTMLDivElement>(null);
    const editorInst = useRef<editor.IStandaloneCodeEditor>();
    const [index, setIndex] = useState(0);

    const { theme } = usePageConfig();

    const valuesRef = useRef<string[]>([]);

    const defaultValueRef = useRef<string>();
    defaultValueRef.current = defaultValues?.[index];

    const onChange = usePersistFn((value: string) => {
        valuesRef.current[index] = value;
        _onChange?.(value, index);
    });

    const onSave = usePersistFn((value: string) => {
        if (saveDisabled?.(index)) {
            return;
        }
        _onSave?.(value, index);
    });

    useLayoutEffect(() => {
        if (!ref.current) {
            return;
        }

        const editor_ = editor.create(ref.current, {
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 15,
            readOnly: false,
            value: defaultValueRef.current || '',
            language: 'typescript',
            fontFamily: 'fira-code, smile-sans, monospace'
        });

        editorInst.current = editor_;

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
    }, [onChange, onSave]);

    const onClickSave = () => {
        onSave?.(editorInst.current?.getValue() || '');
    };

    useLayoutEffect(() => {
        if (!tabsName || !defaultValues) {
            return;
        }
        if (tabsName[index].endsWith('css')) {
            editorInst.current?.setModel(createModel(valuesRef.current[index] || defaultValues[index], 'css'));
        }
        else {
            editorInst.current?.setModel(createModel(valuesRef.current[index] || defaultValues[index], 'typescript'));
        }
    }, [index, defaultValues, tabsName]);

    useLayoutEffect(() => {
        if (!values || !tabsName) {
            return;
        }
        if (tabsName[index].endsWith('css')) {
            editorInst.current?.setModel(createModel(values[index], 'css'));
        }
        else {
            editorInst.current?.setModel(createModel(values[index], 'typescript'));
        }
    }, [values, index, tabsName]);

    useLayoutEffect(() => {
        editorInst.current?.updateOptions({
            theme: theme === 'dark-theme' ? 'vs-dark' : 'vs'
        });
    }, [theme]);

    return (
        <div className={clsx(className, styles.container)}>
            <div className={styles.operations}>
                <div className={styles.tabs}>
                    {tabsName?.map((tab, index_) => (
                        <div
                            key={index_}
                            className={styles.item}
                            onClick={() => setIndex(index_)}
                            data-selected={index_ === index}
                        >
                            <Icon className="rp-baogao"/>
                            <span>{tab}</span>
                        </div>
                    ))}
                </div>
                <div className={styles.item} data-disabled={saveDisabled?.(index)} onClick={onClickSave}>
                    <Icon className="rp-baogao"/>
                    <span>运行</span>
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
