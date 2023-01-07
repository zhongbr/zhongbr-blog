import React from 'react';
import clsx from 'clsx';
import { usePropsStates } from '../hooks';
import styles from './style.module.less';

export interface IProps {
    value?: boolean;
    disabled?: boolean;
    onChange?: (value: boolean) => void;
    onContent?: React.ReactNode;
    offContent?: React.ReactNode;
    size?: 'small' | 'large';
}

const Switch: React.FC<IProps> = props => {
    const { value = false, disabled, onChange, onContent, offContent, size } = props;
    const [states, setStates] = usePropsStates({ value });

    const onClick = () => {
        if (disabled) {
            return;
        }
        onChange?.(!states.value);
        setStates({
            value: !states.value
        });
    };

    return (
        <div
            onClick={onClick}
            className={clsx(size, styles.switch)}
            data-value={states.value}
        >
            {states.value && onContent}
            {!states.value && offContent}
        </div>
    );
};

Switch.displayName = 'Switch';
export default Switch;
