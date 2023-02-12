import React from 'react';
import { IBaseProps } from "@/types/markdown";
import styles from './style.module.less';

const Code: React.FC<IBaseProps> = props => {
    const { node } = props;

    return (
        <span className={styles.code}>
            {node.value}
        </span>
    );
};

export default Code;
