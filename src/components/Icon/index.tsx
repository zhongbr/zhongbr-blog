/*
 * @Description: icons
 * @Author: 张盼宏
 * @Date: 2022-08-27 14:50:50
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-27 14:54:57
 */
import clsx from "clsx";

import "./icon.css";

export interface IProps {
    /** icon font class name */
    className: string;
}

export default function Icon(props: IProps) {
    const { className } = props;

    return <i className={clsx(['iconfont', className])}/>
}
