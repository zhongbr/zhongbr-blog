/*
 * @Description: get blog catalogue index data
 * @Author: 张盼宏
 * @Date: 2022-09-03 14:02:52
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 17:53:50
 */
import { useEffect } from "react";
import { useAsyncEffect, useAsyncFn, useStates } from '@/hooks';
import getPassagesCatalogue, { ICatalogue, IPassage } from '@/service/passage/catalogue';

import { usePersistFn, useTags } from '@/hooks';

export type TagsMap = Map<string, IPassage[]>;

interface IStates {
    tagsMap: TagsMap;
    catalogue: ICatalogue;
}

const initStates: IStates = {
    tagsMap: new Map(),
    catalogue: {}
};

export default function useCatalogue() {
    const [fetchCatalogue, res, loading] = useAsyncFn(getPassagesCatalogue);
    const { tags } = useTags();

    const [states, setStates] = useStates(initStates);

    const filterPassages = usePersistFn((catalogue: ICatalogue) => {
        // filter passages with one of tags at least
        return Object.keys(catalogue).reduce((pre, key) => {
            const passage = catalogue[key];
            if (tags.length === 0 || passage.tags?.some(tag => tags.includes(tag))) {
                return {...pre, [key]: passage};
            }
            return pre;
        }, {});
    });

    useAsyncEffect(async () => {
        const res = await fetchCatalogue();

        const catalogue = res.data;
        const tagsMap = new Map();

        Object.values(catalogue).reduce((map, passage) => {
            const { tags = [] } = passage;

            tags.forEach(tag => {
                const current = map.get(tag) || [];
                current.push(passage);
                map.set(tag, current);
            });

            return map;
        }, tagsMap);

        setStates({
            tagsMap,
            catalogue: filterPassages(catalogue)
        });
    }, [tags.join(','), filterPassages, setStates]);

    useEffect(() => {
        const catalogue = res?.data || {};

        setStates({
            catalogue: filterPassages(catalogue)
        });
    }, [filterPassages, res?.data, setStates])

    return {
        loading,
        ...states
    };
}
