/*
 * @Description: tag
 * @Author: 张盼宏
 * @Date: 2022-09-03 15:18:55
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 18:01:33
 */
import React from 'react';
import clsx from 'clsx';
import Button from "@mui/material/Button";
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';

import Icon from '@/components/Icon';

import styles from './style.module.less';

export interface IProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    selected?: boolean;
    onRemove?: () => void;
}


export default React.forwardRef<any, IProps>((props, ref) => {
    const { children, className, selected, onClick, onRemove } = props;

    const remove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove?.();
    };

    return (
        <Button
            ref={ref}
            className={clsx([styles.tag, className])}
            size="medium"
            variant={selected ? 'outlined' : undefined}
            startIcon={<Icon className="rp-biaoqian"/>}
            endIcon={selected ? <ClearTwoToneIcon onClick={remove}/> : undefined}
            onClick={onClick}
        >
            {children}
        </Button>
    );
});
