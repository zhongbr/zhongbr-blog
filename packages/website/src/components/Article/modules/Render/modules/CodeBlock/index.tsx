import React, { useMemo, useState } from 'react';
import clsx from 'clsx';

import { IBaseProps } from '@/types/markdown';

import styles from './style.module.scss';

const shouldPreview = (lang: string, code: string) => {
    if (!['jsx', 'tsx', 'js'].includes(lang)) {
        return false;
    }
    return /\/\/\s*<live-demo>/.test(code);
};

const CodeBlock: React.FC<IBaseProps> = (props) => {
    const { node } = props;

    return (
        <pre className={styles.code_block}>{node.value}</pre>
    );
};

export default CodeBlock;
