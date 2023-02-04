import { useSearchParams } from 'react-router-dom';
import qs from 'query-string';
import { useEvent } from '@zhongbr/react-hooks';
import useNavigate from './useNavigate';

export default function useTags() {
    const [params, updateParams] = useSearchParams();
    const navigate = useNavigate();

    const tags = params.getAll("tags") || [];

    const onSelectTag = useEvent((tag: string) => {
        updateParams({
            tags: Array.from(new Set([...tags, tag]))
        }, {
            replace: true
        });
    });

    const onRemoveTag = useEvent((tag: string) => {
        updateParams({
            tags: tags.filter(_tag => _tag !== tag)
        }, {
            replace: true
        });
    });

    const onReplaceTags = useEvent((tags: string[]) => {
        updateParams({
            tags
        }, {
            replace: true
        });
    });

    const onOpenTags = useEvent((tags: string[]) => {
        navigate(`/tags?${qs.stringify({ tags })}`);
    });

    return { tags, onSelectTag, onRemoveTag, onReplaceTags, onOpenTags };
}
