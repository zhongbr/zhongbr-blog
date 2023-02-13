/*
 * @Description: passages index page
 * @Author: 张盼宏
 * @Date: 2022-08-28 00:29:28
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 17:52:42
 */
import { useEffect, memo } from "react";

import { usePageConfig } from '@/hooks';
import { useBlogConfig } from '@/config/ConfigContext';

import { Catalogue } from './modules';
import { useCatalogue } from './hooks';

const Index = () => {
    const { setStates, onPageReady } = usePageConfig();

    const { catalogue } = useCatalogue({
        onReady: onPageReady
    });

    const { metas } = useBlogConfig();

    useEffect(() => {
        setStates?.({
            title: metas?.title,
            footer: {
                showICP: true,
                showCopyRight: true,
                showPublicSecurity: true
            }
        });
    }, [setStates]);

    return (
        <Catalogue
            catalogue={catalogue}
        />
    );
}

export default memo(Index);
