/*
 * @Description: code block
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:46:04
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-07 22:37:06
 */
import React, { useState } from 'react';
import clsx from "clsx";
import { Code, codepen, github } from 'react-code-blocks';

import { IBaseProps } from '@/types/markdown';
import { Icon } from "@/components";
import { copy } from "@/utils/copy";
import { usePageConfig } from '@/hooks';

import styles from './style.module.less';

const CodeBlock: React.FC<IBaseProps> = (props) => {
    const { node } = props;
    const [copied, setCopied] = useState(false);

    const { theme } = usePageConfig();
    // 深色模式使用 codepen 主题，浅色 使用 github
    const blockTheme = theme === 'dark-theme' ? codepen : github;

    const onCopyCode = async () => {
        await copy(node.value);
        setCopied(true);
    };

    return (
        <div id={node.key} className={styles.container}>
            <Code
                showLineNumbers
                text={node.value}
                language={node.lang}
                theme={{
                    ...blockTheme,
                    backgroundColor: 'transparent'
                }}
                wrapLongLines
            />
            {node.lang && (
                <div className={styles.footer}>
                    <div className={styles.item}>
                        <Icon className="rp-faxian"></Icon>
                        {node.lang}
                    </div>
                    <div
                        className={clsx(styles.item, styles.copy)}
                        onClick={onCopyCode}
                    >
                        <Icon className="rp-fuzhi"/>
                        {copied ? '已复制' : '复制'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeBlock;
