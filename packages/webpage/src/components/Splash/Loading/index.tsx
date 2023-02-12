import React from 'react';
import clsx from 'clsx';
import styles from './style.module.less';

export interface IProps {
    count?: number;
    color?: string;
    duration?: number;
    className?: string;
}

const Loading: React.FC<IProps> = (props) => {
    const { className, count = 8, color = 'rgba(128,183,249,0.56)', duration = 1.2 } = props;
    const effectCount = Math.min(duration * 10 - 1, count);

    return (
        <div
            className={clsx(styles.loading, className)}
            style={{ '--color': color, '--count': effectCount, '--duration': `${duration}s` } as React.CSSProperties}
        >
            {Array(effectCount).fill(0).map((_, index) => (
                <div
                    key={index}
                    className={styles.item}
                    style={{ '--animation-delay': `${-duration + 0.1 * (index + 1)}s` } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

Loading.displayName = 'Loading';
export default Loading;
