/*
 * @Description: code block
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:46:04
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 21:48:43
 */
import React from 'react';
import Paper from "@mui/material/Paper";
import { CopyBlock, github } from 'react-code-blocks';

import { IBaseProps } from '@/types/markdown';
import styles from './style.module.less';

const CodeBlock: React.FC<IBaseProps> = (props) => {
    const { node } = props;

    return (
        <Paper id={node.key} className={styles.container} variant="outlined">
            <CopyBlock
                text={node.value}
                language={node.lang}
                theme={github}
                wrapLongLines
            />
            {node.lang && <div className={styles.lang}>{node.lang}</div>}
        </Paper>
    );
};

export default CodeBlock;
