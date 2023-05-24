import React from 'react';

import { IBaseProps } from '@/types/markdown';
import { Mermaid } from '@/components';

import styles from './style.module.scss';

const shouldPreview = (lang: string, code: string) => {
    if (!['jsx', 'tsx', 'js'].includes(lang)) {
        return false;
    }
    return /\/\/\s*<live-demo>/.test(code);
};

const CodeBlock: React.FC<IBaseProps> = (props) => {
    const { node } = props;

    // mermaid 流程图
    if (node.lang?.toLowerCase() === 'mermaid') {
        return (
            <Mermaid source={node.value} />
        );
    }

    return (
        <pre className={styles.code_block}>{node.value}</pre>
    );
};

export default CodeBlock;
