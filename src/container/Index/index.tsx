/*
 * @Description: passages index page
 * @Author: 张盼宏
 * @Date: 2022-08-28 00:29:28
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-28 14:47:00
 */
import {useEffect, useState} from "react";

import {useAsyncEffect, usePageConfig} from '@/hooks';
import { title } from '@/config/meta';
import getPassagesCatalogue, { IPassage } from "@/service/passage/catalogue";

export default function Index() {
    const { setStates } = usePageConfig();
    const [passages, setPassages] = useState<IPassage[]>([]);

    useEffect(() => {
        setStates?.({
            title
        });
    }, [setStates]);

    useAsyncEffect(async () => {
        const catalogue = await getPassagesCatalogue();
        setPassages(Object.values(catalogue.data));
    }, []);

    return (
        <div>
            {passages?.map(passage => (
                <div key={passage["json-path"]}>
                    <div>{passage.title}</div>
                    <div>{passage.author}</div>
                </div>
            ))}
        </div>
    );
}
