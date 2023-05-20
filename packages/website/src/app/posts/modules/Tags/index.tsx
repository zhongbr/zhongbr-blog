'use client';
import React, { useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import qs from 'querystring';

import styles from './index.module.scss';
import { useEvent } from '@zhongbr/react-hooks';

export interface ITagProps {
    tags: string[];
    className?: string;
}

const Tags: React.FC<ITagProps> = (props) => {
    const { tags, className } = props;

    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const selectedTags = useMemo(() => {
        return new Set<string>(params.getAll('tags'));
    }, [params]);

    const onClickTag = useEvent((tag: string) => {
        const tags = new Set(params.getAll('tags'));
        if (!tags.has(tag)) {
            tags.add(tag);
        }
        else {
            tags.delete(tag);
        }
        router.replace(`${pathname}?${qs.stringify({ tags: Array.from(tags) })}`);
    });

    return (
        <div className={clsx(styles.tags_container, 'blur', className)}>
            {tags.map(tag => (
                <div
                    key={tag}
                    className={styles.tag}
                    data-selected={selectedTags.has(tag)}
                    onClick={() => onClickTag(tag)}
                >
                    {tag}
                </div>
            ))}
        </div>
    );
};

export default Tags;
