import React from 'react';
import styles from "./style.module.less";

export interface IProps {
    error?: Error;
}

const ErrorDisplay: React.FC<IProps> = props => {
    const { error } = props;

    if (!error) {
        return null;
    }

    return (
        <div className={styles.errorStack}>
            <div className={styles.title}>
                {error?.name}: {error?.message}
            </div>
            <div className={styles.content}>
                {error?.stack}
            </div>
        </div>
    );
};

ErrorDisplay.displayName = 'ErrorDisplay';
export default ErrorDisplay;
