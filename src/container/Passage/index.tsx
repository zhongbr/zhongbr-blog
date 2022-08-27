/*
 * @Description: passage
 * @Author: 张盼宏
 * @Date: 2022-08-27 23:24:29
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-27 23:45:31
 */
import { useEffect } from 'react';

import {usePageConfig} from "@/hooks";

export default function Passage () {
    const { setStates } = usePageConfig();

    useEffect(() => {
        setStates?.({
            title: '文章标题'
        });
    }, [setStates])

    return (
        <div>
            <div>
                <span>这个是文章的内容</span>
                <span>这个是文章的内容</span>
                <span>这个是文章的内容</span>
                <span>这个是文章的内容</span>
            </div>
            <div>
                <span>这个是文章的内容</span>
                <span>这个是文章的内容</span>
                <span>这个是文章的内容</span>
                <span>这个是文章的内容</span>
            </div>
        </div>
    );
}
