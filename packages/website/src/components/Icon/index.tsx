/*
 * @Description: icons
 * @Author: 张盼宏
 * @Date: 2022-08-27 14:50:50
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-27 14:54:57
 */
import clsx from 'clsx';
import styles from './style.module.less';

export interface IProps {
    /** icon font class name */
    className: string;
    text?: string;
    textClassName?: string;
    onClick?: () => void;
}

export default function Icon(props: IProps) {
    const { className, text, textClassName, onClick } = props;

    const icon = <i
        onClick={onClick}
        style={{ fontSize: 'unset' }}
        className={clsx(['iconfont', className])}
    />;

    if (!text) {
        return icon;
    }

    return (
        <div className={styles.iconTextContainer} onClick={onClick}>
            <div className={styles.icon}>
                {icon}
            </div>
            <div className={clsx(textClassName, styles.textContainer)}>
                {text}
            </div>
        </div>
    );
}
