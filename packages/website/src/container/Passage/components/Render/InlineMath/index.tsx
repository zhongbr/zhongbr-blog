import React from 'react';

import { MathJax } from '@/components';
import { IBaseProps } from '@/types/markdown';

import styles from './style.module.less';

const Math: React.FC<IBaseProps> = (props) => {
    const { node } = props;

    return (
        <span className={styles.inlineMath}>
            <MathJax latex={node.value}/>
        </span>
    );
};

export default Math;
