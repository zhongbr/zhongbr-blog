/*
 * @Description: selected tags hook
 * @Author: 张盼宏
 * @Date: 2022-09-03 17:39:29
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 18:01:12
 */
import { useSearchParams } from 'react-router-dom';

import usePersistFn from './usePersistFn';

export default function useTags() {
    const [params, updateParams] = useSearchParams();
    const tags = params.getAll("tags") || [];

    const onSelectTag = usePersistFn((tag: string) => {
        console.log('on select tag', tag);
        updateParams({
            tags: Array.from(new Set([...tags, tag]))
        }, {
            replace: true
        });
    });

    const onRemoveTag = usePersistFn((tag: string) => {
        console.log('on remove tag', tag);
        updateParams({
            tags: tags.filter(_tag => _tag !== tag)
        }, {
            replace: true
        });
    });

    const onReplaceTags = usePersistFn((tags: string[]) => {
        updateParams({
            tags
        }, {
            replace: true
        });
    });

    return { tags, onSelectTag, onRemoveTag, onReplaceTags };
}
