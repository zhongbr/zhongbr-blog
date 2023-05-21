import React from 'react';

import { ICatalogue } from '@/data/posts';
import { Directory } from './Posts';
import { buildPostsTreeIndexes } from './types';
import styles from './index.module.scss';

export interface IPostsTreeProps {
    catalogue: ICatalogue;
    path: string[];
    expandAll?: boolean;
}

const PostsTree: React.FC<IPostsTreeProps> = props => {
    const root = buildPostsTreeIndexes(props.catalogue);

    return (
        <div className={styles.posts_tree}>
            <Directory
                directory={root}
                path={props.path}
                expandAll={props.expandAll}
            />
        </div>
    );
};

export default PostsTree;
