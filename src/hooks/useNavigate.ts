/*
 * @Description: custom navigate
 * @Author: 张盼宏
 * @Date: 2022-08-28 00:33:37
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-28 00:41:59
 */
import {useNavigate as useNavigate_, NavigateOptions, NavigateFunction as NavigateFunction_} from 'react-router-dom';

export type NavigateFunction = (to: string | number, options?: NavigateOptions) => ReturnType<NavigateFunction_>;

export default function useNavigate(): NavigateFunction {
    const navigate = useNavigate_();

    return (to, options) => {
        // if it is complete url, use browser native
        if (typeof to === 'string') {
            if (/(?:https?:)?\/\//.test(to)) {
                if (options?.replace) {
                    window.location.replace(to);
                    return;
                }
                window.open(to);
                return;
            }
            return navigate(to, options);
        }
        return navigate(to);
    };
}
