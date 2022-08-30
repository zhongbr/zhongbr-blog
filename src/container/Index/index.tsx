/*
 * @Description: passages index page
 * @Author: 张盼宏
 * @Date: 2022-08-28 00:29:28
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 22:54:55
 */
import { useEffect, memo } from "react";

import { useAsyncEffect, usePageConfig, useAsyncFn } from '@/hooks';
import { title } from '@/config/meta';
import getPassagesCatalogue from "@/service/passage/catalogue";

import { Catalogue } from './modules';

import styles from './style.module.less';

const Index = () => {
    const { setStates } = usePageConfig();
    const [fetchCatalogue, catalogue] = useAsyncFn(getPassagesCatalogue);

    useEffect(() => {
        setStates?.({
            title
        });
    }, [setStates]);

    useAsyncEffect(async () => {
        await fetchCatalogue();
    }, []);

    return (
        <div className={styles.catalogue}>
            <Catalogue
                catalogue={catalogue?.data}
            />
        </div>
    );
}

export default memo(Index);
