import React from 'react';

import DownSvgUrl from './down.svg';
import styles from './style.module.less';

export interface IProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const DownArrow: React.FC<IProps> = (props) => {
    const { className, onClick } = props;

    return (
        <div className={className} onClick={onClick}>
            <div className={styles.downArrow}>
                <img alt="down svg" src={DownSvgUrl} className={styles.icon} />
                <img alt="down svg" src={DownSvgUrl} className={styles.icon} />
            </div>
        </div>
    );
};

DownArrow.displayName = 'DownArrow';
export default DownArrow;
