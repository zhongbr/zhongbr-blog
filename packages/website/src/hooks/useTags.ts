/*
 * @Description: selected tags hook
 * @Author: 张盼宏
 * @Date: 2022-09-03 17:39:29
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 18:01:12
 */
import { useSearchParams } from 'react-router-dom';
import qs from 'query-string';

import usePersistFn from './usePersistFn';
import useNavigate from './useNavigate';

export default function useTags() {
    const [params, updateParams] = useSearchParams();
    const navigate = useNavigate();

    const tags = params.getAll("tags") || [];

    const onSelectTag = usePersistFn((tag: string) => {
        updateParams({
            tags: Array.from(new Set([...tags, tag]))
        }, {
            replace: true
        });
    });

    const onRemoveTag = usePersistFn((tag: string) => {
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

    const onOpenTags = usePersistFn((tags: string[]) => {
        navigate(`/tags?${qs.stringify({ tags })}`);
    });

    return { tags, onSelectTag, onRemoveTag, onReplaceTags, onOpenTags };
}
