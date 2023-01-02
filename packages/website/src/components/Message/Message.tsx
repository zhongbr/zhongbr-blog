import React from 'react';
import clsx from 'clsx';

import Icon from '../Icon';
import styles from './message.module.less';

export interface IProps {
    title?: React.ReactNode;
    content?: React.ReactNode;
    icon?: React.ReactNode;
    onClose?: () => void;
}

const Message: React.FC<IProps> = props => {
    const { title, content, icon, onClose } = props;

    return (
        <div className={clsx('blur', styles.messageContainer)}>
            {icon && (
                <div className={styles.icon}>
                    {icon}
                </div>
            )}
            <div className={styles.message}>
                {title && (
                    <div className={styles.title}>
                        {title}
                    </div>
                )}
                {content && (
                    <div className={styles.content}>
                        {content}
                    </div>
                )}
            </div>
            <div className={styles.close}>
                <Icon
                    onClick={onClose}
                    className="rp-guanbi"
                />
            </div>
        </div>
    );
};

Message.displayName = 'Message';
export default Message;
