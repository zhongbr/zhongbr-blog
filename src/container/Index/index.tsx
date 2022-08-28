/*
 * @Description: passages index page
 * @Author: 张盼宏
 * @Date: 2022-08-28 00:29:28
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-28 02:07:03
 */
import { useEffect } from "react";

import { usePageConfig} from '@/hooks';
import { title } from '@/config/meta';

export default function Index() {
    const { setStates } = usePageConfig();

    useEffect(() => {
        setStates?.({
            title
        });
    }, [setStates]);

    return (
        <div>
            目录页面
        </div>
    );
}
