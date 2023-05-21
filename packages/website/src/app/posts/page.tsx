import React from 'react';
import clsx from 'clsx';

import { Profile, PostTree } from '@/components';
import { getCatalogue } from '@/data/posts';
import { dividePostsByTag } from '@/app/posts/actions/dividePosts';

import { Tags, Posts } from './modules';
import styles from './index.module.scss';
import { Footer } from '@/components/Layout';

async function Page() {
    const catalogue = await getCatalogue();
    const tags = await dividePostsByTag(catalogue);

    return (
        <div className={styles.posts}>
            <div className={clsx(styles.catalogue, 'blur')}>
                <PostTree
                    catalogue={catalogue}
                    path={[]}
                    expandAll
                />
            </div>
            <Posts
                className={styles.posts_box}
                catalogue={catalogue}
            />
            <div className={styles.right_panel}>
                <Tags
                    className={styles.tags_box}
                    tags={Array.from(tags.keys())}
                    counts={Array.from(tags.values()).map(item => item.length)}
                />
                <Profile />
                <Footer />
            </div>
        </div>
    );
}

Page.test = '123';
export default Page;
