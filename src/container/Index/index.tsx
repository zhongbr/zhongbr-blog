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

import { Catalogue, Tags } from './modules';
import { useCatalogue } from './hooks';

import styles from './style.module.less';

const Index = () => {
    const { setStates } = usePageConfig();

    const { catalogue, tagsMap } = useCatalogue();

    useEffect(() => {
        setStates?.({
            title
        });
    }, [setStates]);

    return (
        <div className={styles.catalogue}>
            <Tags tags={tagsMap}/>
            <Catalogue
                catalogue={catalogue}
            />
        </div>
    );
}

export default memo(Index);
