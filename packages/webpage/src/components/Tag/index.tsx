/*
 * @Description: tag
 * @Author: 张盼宏
 * @Date: 2022-09-03 15:18:55
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 18:01:33
 */
import React from 'react';
import clsx from 'clsx';

import Icon from '@/components/Icon';

import styles from './style.module.less';

export interface IProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    selected?: boolean;
    onRemove?: () => void;
    hideIcon?: boolean;
}


export default React.forwardRef<any, IProps>((props, ref) => {
    const { children, className, selected, hideIcon, onClick, onRemove } = props;

    const remove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove?.();
    };

    return (
        <div
            data-selected={selected}
            className={clsx([styles.tag, className])}
            onClick={onClick}
        >
            <div>
                {!hideIcon && (
                    <Icon className="rp-biaoqian"/>
                )}
                {children}
                {selected && (
                    <Icon className="rp-guanbi" onClick={remove}/>
                )}
            </div>
        </div>
    );
});
