'use client';
import React, { useState } from 'react';
import { useEvent } from '@zhongbr/react-hooks';

import { IDirectory, IPost } from './types';
import styles from './index.module.scss';
import { Icon } from '@/components';
import { openPost } from '@/utils/post';

export interface IDirectoryProps {
    directory: IDirectory;
    path: string[];
    expandAll?: boolean;
}

const Directory: React.FC<IDirectoryProps> = (props) => {
    const { directory, path, expandAll = false } = props;
    const [fold, setFold] = useState(directory.name !== path?.[0] && !expandAll);

    const onFoldChange = useEvent((e: React.MouseEvent) => {
        e.stopPropagation();
        setFold(!fold);
    });

    return (
        <div className={styles.directory} onClick={onFoldChange}>
            <div className={styles.name}>
                {fold ? <Icon className="rp-arrow-up-bold" /> : <Icon className="rp-arrow-down" />}
                {directory.name || '🚀 Zhongbr\'s Blog'}
            </div>
            {!fold && (
                <div className={styles.children}>
                    <div className={styles.items}>
                        {directory.children.map(child => {
                            if (Array.isArray((child as IDirectory).children)) {
                                return (
                                    <Directory
                                        key={child.path}
                                        directory={child as IDirectory}
                                        path={path.slice(1)}
                                        expandAll={expandAll}
                                    />
                                );
                            }
                            return (
                                <Post
                                    key={(child as IPost).name}
                                    post={child as IPost}
                                    path={path?.[path?.length - 1]}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export interface IPostProps {
    post: IPost;
    path: string;
}

const Post: React.FC<IPostProps> = (props) => {
    const { post, path } = props;

    const onClickPost = useEvent((e: React.MouseEvent) => {
        e.stopPropagation();
        openPost(post.path);
    });

    return (
        <div
            className={styles.post}
            onClick={onClickPost}
            data-selected={post.path?.includes(path)}
        >
            <Icon className="rp-jihua"/>
            {post.name}
        </div>
    );
};

export { Directory, Post };
