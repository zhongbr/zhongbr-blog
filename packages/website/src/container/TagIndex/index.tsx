/*
 * @Description: passages index page
 * @Author: 张盼宏
 * @Date: 2022-08-28 00:29:28
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 17:52:42
 */
import { useEffect, memo } from "react";

import { usePageConfig } from '@/hooks';
import { title } from '@/config/meta';

import { Catalogue } from './modules';
import { useCatalogue } from './hooks';

const Index = () => {
    const { setStates, onPageReady } = usePageConfig();

    const { catalogue } = useCatalogue({
        onReady: onPageReady
    });

    useEffect(() => {
        setStates?.({
            title
        });
    }, [setStates]);

    return (
        <Catalogue
            catalogue={catalogue}
        />
    );
}

export default memo(Index);
