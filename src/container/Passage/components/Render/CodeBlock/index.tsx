/*
 * @Description: code block
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:46:04
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:33:27
 */
import React from 'react';
import { IBaseProps } from '@/types/markdown';
import styles from './style.module.less';

const CodeBlock: React.FC<IBaseProps> = (props) => {
    const { node } = props;

    return (
        <div id={node.key} className={styles.container}>
            <div className={styles.codeBlock}>{node.value}</div>
            {node.lang && <div className={styles.lang}>{node.lang}</div>}
        </div>
    );
};

export default CodeBlock;
