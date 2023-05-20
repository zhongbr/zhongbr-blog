import React from 'react';

import { Profile } from '@/components';
import { getCatalogue } from '@/data/posts';
import { dividePostsByTag } from '@/app/posts/actions/dividePosts';

import { Tags, Posts } from './modules';
import styles from './index.module.scss';
import { Footer } from '@/components/Layout';
import clsx from 'clsx';

async function Page() {
    const catalogue = await getCatalogue();
    const tags = await dividePostsByTag(catalogue);

    return (
        <div className={styles.posts}>
            <Tags
                className={styles.tags_box}
                tags={Array.from(tags.keys())}
            />
            <Posts
                className={styles.posts_box}
                catalogue={catalogue}
            />
            <div className={styles.right_panel}>
                <Profile />
                <Footer />
            </div>
        </div>
    );
}

Page.test = '123';
export default Page;
