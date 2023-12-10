'use client';
import React, { useMemo } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEvent } from '@zhongbr/react-hooks';

import { ICatalogue } from '@/data/posts';
import styles from './index.module.scss';
import { openPost } from '@/utils/post';
import { ImageSize, imgLevel } from '@/utils/cover';

export interface IPostProps {
    catalogue: ICatalogue;
    className?: string;
}

const Posts: React.FC<IPostProps> = (props) => {
    const { className, catalogue } = props;
    const searchParams = useSearchParams();

    const posts = useMemo(() => {
        const selectedTags = new Set(searchParams.getAll('tags'));
        if (!selectedTags.size) return Object.values(catalogue);
        return Object.values(catalogue).filter(post => {
            return post.tags.some(tag => selectedTags.has(tag));
        });
    }, [searchParams, catalogue]);

    const onOpenPassage = useEvent((passage: ICatalogue[keyof ICatalogue]) => {
        openPost(passage['json-path']);
    });

    return (
        <div className={clsx(className, styles.posts_box, 'no-default-styles')}>
            {posts.map((passage) => (
                <div
                    className={clsx(styles.post, 'blur')}
                    key={passage['json-path']}
                    onClick={() => onOpenPassage(passage)}
                >
                    <div className={styles.cover}>
                        <img src={imgLevel(passage.cover, ImageSize.Small)} alt="cover"/>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.title}>
                            {passage.title}
                        </div>
                        <div className={styles.metas}>
                            <div>📅&nbsp;{passage.mdate}</div>
                        </div>
                        <div className={styles.tags}>
                            {passage.tags.map((tag) => (
                                <Link
                                    href={`/posts?tags=${tag}`}
                                    key={tag}
                                    className="tag"
                                    onClick={e => e.stopPropagation()}
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className={styles.icon}>{passage.icon}</div>
                </div>
            ))}
        </div>
    );
};

export default Posts;
