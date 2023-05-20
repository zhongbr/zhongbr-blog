'use client';
import React, { useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import qs from 'querystring';

import styles from './index.module.scss';
import { useEvent } from '@zhongbr/react-hooks';

export interface ITagProps {
    tags: string[];
    counts: number[];
    className?: string;
}

const Tags: React.FC<ITagProps> = (props) => {
    const { tags, counts, className } = props;

    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const postsCount = counts.reduce((pre, item) => pre + item, 0);

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
            <div className={styles.meta}>
                <div className={styles.title}>
                    标签
                </div>
                <div className={styles.counts}>
                    <div className={styles.item}>
                        <div className={styles.number}>{tags.length}</div>
                        <div className={styles.sub_title}>标签</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.number}>{postsCount}</div>
                        <div className={styles.sub_title}>文章</div>
                    </div>
                </div>
            </div>
            <div className={styles.tags}>
                {tags.map((tag, index) => (
                    <div
                        key={tag}
                        className={styles.tag}
                        data-selected={selectedTags.has(tag)}
                        onClick={() => onClickTag(tag)}
                    >
                        {tag}
                        <span className={styles.count}>[{counts[index]}]</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tags;
